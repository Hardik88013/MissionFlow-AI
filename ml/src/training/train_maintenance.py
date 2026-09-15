import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def create_synthetic_data(num_samples=1000):
    np.random.seed(42)
    mileage = np.random.uniform(5000, 200000, num_samples)
    vehicle_age_years = np.random.uniform(0.5, 15, num_samples)
    service_history_count = np.random.randint(0, 30, num_samples)
    engine_hours = mileage / np.random.uniform(20, 60, num_samples)
    
    risk_score = (mileage / 200000) * 0.4 + (vehicle_age_years / 15) * 0.3 - (service_history_count / 30) * 0.2
    risk_score += np.random.normal(0, 0.1, num_samples)
    target = (risk_score > 0.6).astype(int)
    
    df = pd.DataFrame({
        'mileage': mileage,
        'vehicle_age_years': vehicle_age_years,
        'service_history_count': service_history_count,
        'engine_hours': engine_hours,
        'needs_maintenance': target
    })
    return df

def train_model():
    print('Generating synthetic data...')
    df = create_synthetic_data(2000)
    X = df.drop('needs_maintenance', axis=1)
    y = df['needs_maintenance']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print('Training RandomForest model...')
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f'Validation Accuracy: {acc:.4f}')
    print(classification_report(y_test, y_pred))
    
    artifact_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'artifacts', 'maintenance_model')
    os.makedirs(artifact_dir, exist_ok=True)
    
    model_path = os.path.join(artifact_dir, 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f'Model saved to {model_path}')

if __name__ == '__main__':
    train_model()
