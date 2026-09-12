import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
from imblearn.over_sampling import SMOTE
import pickle

def train_ev_model():
    data_path = os.path.join('ml', 'data', 'raw', 'EV_Predictive_Maintenance_Dataset_15min.csv')
    df = pd.read_csv(data_path)
    
    df['needs_maintenance'] = (df['Maintenance_Type'] > 0).astype(int)
    
    # Simple engineered features
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
    
    print("Applying SMOTE to balance classes...")
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)

    X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42, stratify=y_res)

    print("Training XGBoost on balanced EV Dataset...")
    model = XGBClassifier(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='auc',
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, preds),
        "precision": precision_score(y_test, preds),
        "recall": recall_score(y_test, preds),
        "f1": f1_score(y_test, preds),
        "roc_auc": roc_auc_score(y_test, probs)
    }

    print("EV XGBoost Evaluation:")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
    
    print("\nClassification Report:\n", classification_report(y_test, preds))

    artifact_dir = os.path.join('ml', 'artifacts', 'maintenance_model')
    os.makedirs(artifact_dir, exist_ok=True)
    
    model_path = os.path.join(artifact_dir, 'ev_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Saved EV XGBoost model to {model_path}")
    
    report = {
        "dataset": "EVIoT-PredictiveMaint Dataset",
        "record_count": len(df),
        "feature_count": len(features),
        "target": "needs_maintenance (Maintenance_Type > 0)",
        "model_name": "XGBClassifier with SMOTE",
        "metrics": metrics,
        "class_distribution": y_res.value_counts().to_dict(),
        "notes": "Accuracy improved using SMOTE and XGBoost."
    }
    
    with open(os.path.join(artifact_dir, 'ev_evaluation.json'), 'w') as f:
        json.dump(report, f, indent=2)

if __name__ == '__main__':
    train_ev_model()
