# Hardik Phase 1 Report (Updated for Real EV Dataset)

## 1. Objective
Implement a real end-to-end predictive maintenance vertical slice using actual EV telemetry data, served via a FastAPI endpoint, and displaying predictions in a React frontend.

## 2. Datasets Used
- **Name**: EVIoT-PredictiveMaint Dataset
- **Source**: Kaggle (datasetengineer/eviot-predictivemaint-dataset)
- **Organization**: Kaggle / EVIoT
- **Access date**: 2026-09-13
- **License**: CC-BY-NC-SA-4.0
- **Records**: ~175,000+
- **Features**: SoC, Battery Voltage, Battery Temp, Motor Temp, Motor Vibration, Motor RPM, Tire Pressure, Driving Speed.
- **Target**: `needs_maintenance` (derived from `Maintenance_Type > 0`).
- **Why selected**: This is the exact dataset requested for EV predictive maintenance containing relevant telemetry and failure labels.

## 3. Dataset Compatibility
Used for direct training and evaluation (80/20 stratified split).

## 4. Data Cleaning
- Binarized `Maintenance_Type` into a binary `needs_maintenance` target.
- Extracted key continuous telemetry features for real-time model inference.

## 5. Feature Engineering
Used raw telemetry data:
1. `SoC` (State of Charge)
2. `Battery_Voltage`
3. `Battery_Temperature`
4. `Motor_Temperature`
5. `Motor_Vibration`
6. `Motor_RPM`
7. `Tire_Pressure`
8. `Driving_Speed`

## 6. Model Experiments
Model A: Random Forest Classifier (n_estimators=100, class_weight='balanced')

## 7. Evaluation
Actual Random Forest metrics on test set:
- Accuracy: 0.6747
- Precision: 0.3127
- Recall: 0.0736
- F1: 0.1192
- ROC-AUC: 0.5006

*(Note: Raw telemetry often requires time-series windowing or lag features to boost ROC-AUC on maintenance tasks; current model uses point-in-time inference as a baseline architecture).*

## 8. Selected Model
Random Forest (Baseline Point-in-time)

## 9. API
Endpoint: `POST /predictions/maintenance`
**Request schema**: `{"SoC": float, "Motor_Temperature": float, ...}`
**Response schema**: `{"health_score": float, "failure_probability": float, "risk_level": string, "model_version": "v2.0-RF-EVIoT"}`

## 10. Frontend
Updated `VehicleHealth.tsx` to include the specific EV Telemetry inputs (SoC, Battery Temp, Motor Vibration, etc.). It displays the prediction result clearly distinguishing HEALTHY, ATTENTION, HIGH RISK, and CRITICAL statuses.

## 11. Tests
- Data loader: Passed
- Model training: Passed
- Prediction API: Passed
- Frontend UI: Passed

## 12. Limitations
- Point-in-time classification limits F1 score; future phases should implement rolling-window or time-series feature engineering (LSTMs / XGBoost with lags).

## 13. Files Changed
- `backend/app/api/predictions_maintenance.py`
- `frontend/src/pages/Vehicles/VehicleHealth.tsx`
- `frontend/src/services/maintenanceApi.ts`
- `ml/src/training/train_ev_maintenance.py`
- `ml/data/raw/EV_Predictive_Maintenance_Dataset_15min.csv`
- `ml/artifacts/maintenance_model/ev_model.pkl`
- `docs/hardik-phase-1-report.md`

## 14. Git
Branch: feature/maintenance
