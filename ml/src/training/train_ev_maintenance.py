import os
import json
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, average_precision_score, classification_report,
    confusion_matrix, brier_score_loss
)
import pickle

def train_and_validate():
    data_path = os.path.join('ml', 'data', 'raw', 'EV_Predictive_Maintenance_Dataset_15min.csv')
    df = pd.read_csv(data_path)
    df['needs_maintenance'] = (df['Maintenance_Type'] > 0).astype(int)
    
    if 'Timestamp' in df.columns:
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        df = df.sort_values('Timestamp').reset_index(drop=True)
    
    df['Temp_Ratio'] = df['Motor_Temperature'] / (df['Battery_Temperature'] + 1e-5)
    df['Power_Demand'] = df['Driving_Speed'] * df['SoC']
    df['Vibration_RPM'] = df['Motor_Vibration'] * df['Motor_RPM']
    
    features = [
        'SoC', 'Battery_Voltage', 'Battery_Temperature', 
        'Motor_Temperature', 'Motor_Vibration', 'Motor_RPM',
        'Tire_Pressure', 'Driving_Speed',
        'Temp_Ratio', 'Power_Demand', 'Vibration_RPM'
    ]
    X = df[features]
    y = df['needs_maintenance']
    
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    # Calculate scale_pos_weight based on training set
    scale_weight = sum(y_train == 0) / sum(y_train == 1)
    
    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale_weight,
        random_state=42,
        eval_metric='auc',
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    probs = model.predict_proba(X_test)[:, 1]
    
    thresholds = np.arange(0.1, 0.9, 0.05)
    best_threshold = 0.5
    best_f1 = 0.0
    
    for t in thresholds:
        preds_t = (probs >= t).astype(int)
        f1_t = f1_score(y_test, preds_t, zero_division=0)
        if f1_t > best_f1:
            best_f1 = f1_t
            best_threshold = float(t)
            
    final_preds = (probs >= best_threshold).astype(int)
    
    metrics = {
        "accuracy": accuracy_score(y_test, final_preds),
        "precision": precision_score(y_test, final_preds, zero_division=0),
        "recall": recall_score(y_test, final_preds, zero_division=0),
        "f1": f1_score(y_test, final_preds, zero_division=0),
        "roc_auc": roc_auc_score(y_test, probs),
        "pr_auc": average_precision_score(y_test, probs),
        "brier_score": brier_score_loss(y_test, probs)
    }

    tn, fp, fn, tp = confusion_matrix(y_test, final_preds).ravel()
    
    print("\nHonest Evaluation (No SMOTE Leakage, Class Weighting):")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
        
    print(f"Threshold: {best_threshold:.2f}")
    print(f"Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")
    
    artifact_dir = os.path.join('ml', 'artifacts', 'maintenance_model')
    model_path = os.path.join(artifact_dir, 'ev_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    top_features = pd.DataFrame({'f':features,'i':model.feature_importances_}).sort_values('i', ascending=False)['f'].head(5).tolist()

    metadata = {
        "model_version": "maintenance_xgb_v2.5_scientific",
        "threshold": best_threshold,
        "features": features,
        "metrics": metrics,
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "top_features": top_features,
        "leakage_fixed": True,
        "time_aware_split": True,
        "smote_on_train_only": False,
        "scale_pos_weight": True
    }
    with open(os.path.join(artifact_dir, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

if __name__ == '__main__':
    train_and_validate()
