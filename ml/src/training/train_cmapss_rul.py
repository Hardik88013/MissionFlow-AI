import os
import json
import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle

def cmapss_score(y_true, y_pred):
    d = y_pred - y_true
    score = np.sum(np.where(d < 0, np.exp(-d / 13) - 1, np.exp(d / 10) - 1))
    return score

def run():
    print("Loading data...")
    data_dir = os.path.join('ml', 'data', 'raw', 'CMAPSS')
    cols = ['engine_id', 'cycle', 'setting1', 'setting2', 'setting3'] + [f's{i}' for i in range(1, 22)]
    train = pd.read_csv(os.path.join(data_dir, 'train_FD001.txt'), sep=r'\s+', header=None, names=cols)
    test = pd.read_csv(os.path.join(data_dir, 'test_FD001.txt'), sep=r'\s+', header=None, names=cols)
    y_test_true = pd.read_csv(os.path.join(data_dir, 'RUL_FD001.txt'), sep=r'\s+', header=None, names=['RUL'])
    
    print("Preparing train...")
    rul = pd.DataFrame(train.groupby('engine_id')['cycle'].max()).reset_index()
    rul.columns = ['engine_id', 'max_cycle']
    train = train.merge(rul, on=['engine_id'], how='left')
    train['RUL'] = train['max_cycle'] - train['cycle']
    train.drop('max_cycle', axis=1, inplace=True)
    
    def engineer_features(df):
        df = df.copy()
        sensors = ['s2', 's3', 's4', 's7', 's8', 's9', 's11', 's12', 's13', 's14', 's15', 's17', 's20', 's21']
        for s in sensors:
            df[f'{s}_lag1'] = df.groupby('engine_id')[s].shift(1).fillna(df[s])
            df[f'{s}_rmean5'] = df.groupby('engine_id')[s].rolling(window=5, min_periods=1).mean().reset_index(level=0, drop=True)
            df[f'{s}_rstd5'] = df.groupby('engine_id')[s].rolling(window=5, min_periods=1).std().fillna(0).reset_index(level=0, drop=True)
            df[f'{s}_trend5'] = df[s] - df.groupby('engine_id')[s].shift(5).fillna(df[s])
        constant_cols = ['setting3', 's1', 's5', 's6', 's10', 's16', 's18', 's19']
        df.drop(columns=[c for c in constant_cols if c in df.columns], inplace=True)
        return df

    train = engineer_features(train)
    test = engineer_features(test)
    test_last = test.groupby('engine_id').last().reset_index()
    
    features = [c for c in train.columns if c not in ['engine_id', 'cycle', 'RUL']]
    
    X_train = train[features]
    y_train = train['RUL']
    
    X_test = test_last[features]
    y_test = y_test_true['RUL']
    
    print("Training RF...")
    rf = RandomForestRegressor(n_estimators=50, max_depth=6, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    print(f"RF MAE: {mean_absolute_error(y_test, rf_preds):.2f}")
    
    print("Training XGB...")
    xgb = XGBRegressor(n_estimators=150, max_depth=4, learning_rate=0.05, 
                       subsample=0.8, colsample_bytree=0.8, random_state=42)
    xgb.fit(X_train, y_train)
    xgb_preds = xgb.predict(X_test)
    xgb_preds = np.maximum(xgb_preds, 0)
    
    mae = mean_absolute_error(y_test, xgb_preds)
    rmse = np.sqrt(mean_squared_error(y_test, xgb_preds))
    r2 = r2_score(y_test, xgb_preds)
    cmapss_val = cmapss_score(y_test, xgb_preds)
    
    print(f"XGB MAE: {mae:.2f}")
    print(f"XGB RMSE: {rmse:.2f}")
    print(f"XGB R2: {r2:.2f}")
    print(f"XGB C-MAPSS Score: {cmapss_val:.2f}")
    
    horizon = 30
    y_test_class = (y_test <= horizon).astype(int)
    y_pred_class = (xgb_preds <= horizon).astype(int)
    
    from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score
    precision = precision_score(y_test_class, y_pred_class, zero_division=0)
    recall = recall_score(y_test_class, y_pred_class, zero_division=0)
    f1 = f1_score(y_test_class, y_pred_class, zero_division=0)
    roc = roc_auc_score(y_test_class, y_pred_class)
    
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    
    artifact_dir = os.path.join('ml', 'artifacts', 'maintenance_model', 'cmapss')
    os.makedirs(artifact_dir, exist_ok=True)
    with open(os.path.join(artifact_dir, 'cmapss_xgb_model.pkl'), 'wb') as f:
        pickle.dump(xgb, f)
        
    imp = pd.DataFrame({'f': features, 'i': xgb.feature_importances_}).sort_values('i', ascending=False)
    
    metadata = {
        "model_version": "maintenance_cmapss_v3",
        "target": "RUL (Remaining Useful Life)",
        "features": features,
        "metrics": {"mae": mae, "rmse": rmse, "r2": r2, "cmapss_score": cmapss_val},
        "classifier_metrics": {"horizon": horizon, "precision": precision, "recall": recall, "f1": f1, "roc_auc": roc},
        "top_features": imp['f'].head(15).tolist(),
        "leakage_fixed": True
    }
    with open(os.path.join(artifact_dir, 'cmapss_model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

run()
