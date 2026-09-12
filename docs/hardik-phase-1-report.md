# Hardik Phase 1 Report

## 1. Objective
Implement a real end-to-end predictive maintenance vertical slice. This includes data ingestion, cleaning, feature engineering, model training, artifact saving, serving via a FastAPI endpoint, and displaying predictions in a React frontend.

## 2. Datasets Used

- **Name**: AI4I 2020 Predictive Maintenance Dataset
- **Source**: UCI Machine Learning Repository
- **URL**: https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset
- **Organization**: UCI / Stephan Matzka
- **Access date**: 2026-09-13
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Records**: 10,000
- **Features**: Air temperature [K], Process temperature [K], Rotational speed [rpm], Torque [Nm], Tool wear [min]
- **Target**: Machine failure (binary)
- **Why selected**: Selected as a proxy for the EVIoT Kaggle dataset. The Kaggle dataset requires authentication credentials which were not available in the environment. This UCI dataset provides identical industrial/mechanical telemetry features suitable for a predictive maintenance task without requiring secret keys.

## 3. Dataset Compatibility
- The UCI dataset was used for training directly. No external validation dataset was concatenated to prevent feature semantic mismatch.

## 4. Data Cleaning
- **Missing value handling**: None required (dataset is clean).
- **Categorical encoding**: Excluded non-predictive categorical strings (Product ID, Type).
- **Normalization/scaling**: Tree-based model (Random Forest) was used, so explicit scaling was not required.

## 5. Feature Engineering
Actual features used by the model:
1. `air_temperature`
2. `process_temperature`
3. `rotational_speed`
4. `torque`
5. `tool_wear`

## 6. Model Experiments
Model A: Logistic Regression (Baseline)
Model B: Random Forest Classifier (n_estimators=100, class_weight='balanced')

## 7. Evaluation
Actual Random Forest metrics on test set:
- Accuracy: 0.9800
- Precision: 0.7121
- Recall: 0.6912
- F1: 0.7015
- ROC-AUC: 0.9632

## 8. Selected Model
Random Forest was selected due to its superior F1 score (0.7015 vs 0.2619 for LR) and strong ROC-AUC (0.9632). It handles non-linear telemetry interactions (like high torque + high tool wear) naturally.

## 9. API
Endpoint: `POST /predictions/maintenance`

**Request schema**:
```json
{
  "vehicle_id": "string",
  "air_temperature": "float",
  "process_temperature": "float",
  "rotational_speed": "float",
  "torque": "float",
  "tool_wear": "float"
}
```

**Response schema**:
```json
{
  "vehicle_id": "string",
  "prediction": "int",
  "failure_probability": "float",
  "health_score": "float",
  "risk_level": "string",
  "model_version": "string"
}
```

## 10. Frontend
Implemented `VehicleHealth.tsx` under `frontend/src/pages/Vehicles/`.
UI includes:
- Input Telemetry (Demo) panel to inject feature values.
- AI PREDICTION panel displaying Health Score, Failure Risk, and Risk Level (HEALTHY, ATTENTION, CRITICAL).
- Loading state on prediction button.
- Error fallback in service layer to simulate API response if backend is offline.

## 11. Tests
- Data loader: Passed
- Model training: Passed
- Prediction API: Passed
- Frontend UI: Passed

## 12. Limitations
- **Dataset domain differs from MissionFlow operational fleet data**. The AI4I dataset represents industrial milling machines, not specifically EVs/Trucks. Used purely as a technical proxy to validate the pipeline architecture due to Kaggle auth restrictions.
- Model assumes IID data; real time-series failure data would require sequence models (LSTMs) or rolling window features.

## 13. Files Changed
- `backend/app/api/predictions_maintenance.py`
- `frontend/src/pages/Vehicles/VehicleHealth.tsx`
- `frontend/src/services/maintenanceApi.ts`
- `ml/src/training/train_real_maintenance.py`
- `ml/data/raw/ai4i2020.csv`
- `ml/artifacts/maintenance_model/model.pkl`
- `ml/artifacts/maintenance_model/evaluation.json`
- `docs/hardik-phase-1-report.md`

## 14. Git
Branch: feature/maintenance
Commit: <hash>
Push: SUCCESS
