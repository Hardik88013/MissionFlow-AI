import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
import pickle

def load_and_clean_data():
    data_path = os.path.join('ml', 'data', 'raw', 'ai4i2020.csv')
    df = pd.read_csv(data_path)
    # Features: Air temperature [K], Process temperature [K], Rotational speed [rpm], Torque [Nm], Tool wear [min]
    # We will rename them for API convenience
    df = df.rename(columns={
        'Air temperature [K]': 'air_temperature',
        'Process temperature [K]': 'process_temperature',
        'Rotational speed [rpm]': 'rotational_speed',
        'Torque [Nm]': 'torque',
        'Tool wear [min]': 'tool_wear',
        'Machine failure': 'failure'
    })
    # Drop non-predictive/identifier columns
    features = ['air_temperature', 'process_temperature', 'rotational_speed', 'torque', 'tool_wear']
    X = df[features]
    y = df['failure']
    return X, y, df

def train_and_evaluate():
    X, y, df = load_and_clean_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("Training Baseline (Logistic Regression)...")
    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train, y_train)
    lr_preds = lr.predict(X_test)
    print("LR F1:", f1_score(y_test, lr_preds))

    print("Training RandomForest...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_probs = rf.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, rf_preds),
        "precision": precision_score(y_test, rf_preds),
        "recall": recall_score(y_test, rf_preds),
        "f1": f1_score(y_test, rf_preds),
        "roc_auc": roc_auc_score(y_test, rf_probs)
    }

    print("Random Forest Evaluation:")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
    
    print("\nClassification Report:\n", classification_report(y_test, rf_preds))

    artifact_dir = os.path.join('ml', 'artifacts', 'maintenance_model')
    os.makedirs(artifact_dir, exist_ok=True)
    
    model_path = os.path.join(artifact_dir, 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(rf, f)
    print(f"Saved model to {model_path}")

    report = {
        "dataset": "UCI AI4I Predictive Maintenance Dataset (Proxy for Fleet)",
        "record_count": len(df),
        "feature_count": len(X.columns),
        "target": "failure",
        "train_records": len(X_train),
        "test_records": len(X_test),
        "model_name": "RandomForestClassifier",
        "metrics": metrics,
        "class_distribution": y.value_counts().to_dict(),
        "limitations": "Industrial machinery dataset used as a proxy because Kaggle EVIoT requires authentication."
    }
    
    with open(os.path.join(artifact_dir, 'evaluation.json'), 'w') as f:
        json.dump(report, f, indent=2)

if __name__ == '__main__':
    train_and_evaluate()
