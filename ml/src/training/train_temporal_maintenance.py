import os
import json
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, average_precision_score, brier_score_loss, confusion_matrix
)
import pickle

def create_temporal_features(df):
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df = df.sort_values('Timestamp').reset_index(drop=True)
    
    # 1. Base snapshot features
    df['Temp_Ratio'] = df['Motor_Temperature'] / (df['Battery_Temperature'] + 1e-5)
    df['Power_Demand'] = df['Driving_Speed'] * df['SoC']
    df['Vibration_RPM'] = df['Motor_Vibration'] * df['Motor_RPM']
    
    rolling_vars = ['Tire_Pressure', 'Battery_Temperature', 'Motor_Temperature', 'Motor_Vibration']
    
    # 2. Rolling features (CAUSAL)
    for var in rolling_vars:
        df[f'{var}_rolling_mean_1h'] = df[var].rolling(window=4, min_periods=1).mean()
        df[f'{var}_rolling_std_1h'] = df[var].rolling(window=4, min_periods=1).std().fillna(0)
        df[f'{var}_trend_1h'] = df[var] - df[var].shift(4).fillna(df[var])
        df[f'{var}_lag_1'] = df[var].shift(1).fillna(df[var])
        df[f'{var}_lag_2'] = df[var].shift(2).fillna(df[var])
        
    return df.iloc[4:].reset_index(drop=True)

def train_and_validate():
    data_path = os.path.join('ml', 'data', 'raw', 'EV_Predictive_Maintenance_Dataset_15min.csv')
    df = pd.read_csv(data_path)
    
    df['is_failure'] = (df['Maintenance_Type'] > 0).astype(int)
    
    # Predict exactly the NEXT 15 minutes (t+1)
    df['future_failure_15m'] = df['is_failure'].shift(-1)
    
    df = df.dropna(subset=['future_failure_15m']).reset_index(drop=True)
    df = create_temporal_features(df)
    
    feature_cols = [c for c in df.columns if c not in [
        'Timestamp', 'is_failure', 'future_failure_15m', 'Maintenance_Type', 
        'Failure_Probability', 'TTF', 'Component_Health_Score', 'RUL'
    ]]
    
    X = df[feature_cols]
    y_target = df['future_failure_15m']
    
    print(f"Total dataset: {len(df)} records.")
    print(f"Future Failure Rate (Next 15m): {y_target.mean()*100:.2f}%")
    
    n = len(df)
    train_idx = int(n * 0.70)
    val_idx = int(n * 0.85)
    
    X_train, y_train = X.iloc[:train_idx], y_target.iloc[:train_idx]
    X_val, y_val = X.iloc[train_idx:val_idx], y_target.iloc[train_idx:val_idx]
    X_test, y_test = X.iloc[val_idx:], y_target.iloc[val_idx:]
    
    snapshot_cols = ['SoC', 'Battery_Voltage', 'Battery_Temperature', 'Motor_Temperature', 'Motor_Vibration', 'Motor_RPM', 'Tire_Pressure', 'Driving_Speed']
    X_train_snap = X_train[snapshot_cols]
    X_test_snap = X_test[snapshot_cols]
    
    scale_weight = sum(y_train == 0) / (sum(y_train == 1) + 1e-5)
    
    print("\n--- Training Snapshot Baseline ---")
    base_model = XGBClassifier(n_estimators=100, max_depth=6, scale_pos_weight=scale_weight, random_state=42, n_jobs=-1)
    base_model.fit(X_train_snap, y_train)
    base_probs = base_model.predict_proba(X_test_snap)[:, 1]
    
    print("Baseline Test ROC-AUC:", roc_auc_score(y_test, base_probs))
    print("Baseline Test PR-AUC:", average_precision_score(y_test, base_probs))
    
    print("\n--- Training Temporal Model ---")
    temp_model = XGBClassifier(
        n_estimators=300, max_depth=6, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        scale_pos_weight=scale_weight, random_state=42, n_jobs=-1
    )
    temp_model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    
    val_probs = temp_model.predict_proba(X_val)[:, 1]
    
    best_thresh, best_f1 = 0.5, 0.0
    for t in np.arange(0.1, 0.9, 0.05):
        f1 = f1_score(y_val, (val_probs >= t).astype(int), zero_division=0)
        if f1 > best_f1:
            best_f1 = f1
            best_thresh = float(t)
            
    print(f"Optimal Threshold (from Val): {best_thresh:.2f}")
    
    test_probs = temp_model.predict_proba(X_test)[:, 1]
    test_preds = (test_probs >= best_thresh).astype(int)
    
    metrics = {
        "accuracy": accuracy_score(y_test, test_preds),
        "precision": precision_score(y_test, test_preds, zero_division=0),
        "recall": recall_score(y_test, test_preds, zero_division=0),
        "f1": f1_score(y_test, test_preds, zero_division=0),
        "roc_auc": roc_auc_score(y_test, test_probs),
        "pr_auc": average_precision_score(y_test, test_probs),
        "brier_score": brier_score_loss(y_test, test_probs)
    }
    
    print("\nHonest Temporal Evaluation (Untouched Future Test Set):")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
        
    tn, fp, fn, tp = confusion_matrix(y_test, test_preds).ravel()
    print(f"Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")

if __name__ == '__main__':
    train_and_validate()
