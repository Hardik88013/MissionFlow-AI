# MissionFlow AI — Phase 3 Temporal Predictive Maintenance

## 1. Problem From Phase 2.5
The previous snapshot-based ML evaluation was severely flawed due to data leakage. When evaluated strictly chronologically on untouched future data, the model achieved a random ROC-AUC (0.49). This indicated that a snapshot of vehicle telemetry at a single moment in time (e.g., current temperature) was insufficient to predict future maintenance requirements. Phase 3 was initiated to add "temporal memory" (rolling statistics, trends, and lags) to see if historical context could predict future failures.

## 2. Dataset
- **Source:** `EV_Predictive_Maintenance_Dataset_15min.csv`
- **Structure:** 175,393 rows representing a continuous 5-year time series (2020-2025) sampled every 15 minutes.
- **Vehicle Identity:** The dataset lacks a `Vehicle_ID`. It acts as a single continuous telemetry stream.

## 3. Prediction Task
Rather than predicting the *current* state of the machine (which has limited utility for preventative maintenance), the target was shifted to predict if the system will experience a failure in the *future*.

## 4. Prediction Horizon
**Horizon:** Next 15 minutes (`t+1`).
*(Initially explored next 2 hours, but failures occur so frequently in this dataset—approx 29.9% base rate—that any 2-hour rolling window contained a failure 94% of the time, turning the target into a constant. A 15-minute horizon is the most localized and predictable target supported by the data).*

## 5. Why Snapshot Features Failed
A snapshot has no history. A motor operating at 80°C is perfectly normal if it was at 80°C an hour ago, but it is a critical warning sign if it was at 40°C five minutes ago. Snapshots fail to capture these degradation trends.

## 6. Temporal Feature Architecture
A temporal feature builder was created to ensure strict causality. No centered windows or future data were permitted to leak into the feature set for timestamp `t`.

## 7. Rolling Windows
Created 1-hour rolling means and rolling standard deviations (window size = 4) for critical telemetry:
- `Tire_Pressure`
- `Battery_Temperature`
- `Motor_Temperature`
- `Motor_Vibration`

## 8. Lag Features
Added precise historical observations:
- `lag_1` (15 minutes ago)
- `lag_2` (30 minutes ago)

## 9. Trend Features
Added 1-hour trend features: `current_value - value_1_hour_ago`.

## 10. Target Construction
`future_failure_15m = is_failure(t+1)`
The target looked 1 step into the future. Rows without future labels at the tail end of the dataset were dropped.

## 11. Leakage Prevention
All `shift()` and `rolling()` operations used causal (right-aligned) logic.

## 12. Train/Validation/Test Split
Strict temporal splitting:
- **Train:** First 70% (2020 to mid-2023)
- **Validation:** Next 15% (mid-2023 to early 2024)
- **Test:** Final 15% (early 2024 to 2025) - Untouched

## 13. Class Imbalance
SMOTE was banned due to the temporal nature of the data. XGBoost's native `scale_pos_weight` (computed strictly on the training set) was utilized.

## 14. Baseline Snapshot Model (Future Prediction)
- **Precision:** ~30%
- **Recall:** ~100% (When optimized for F1)
- **ROC-AUC:** 0.5020
- **PR-AUC:** 0.3036

## 15. Temporal Model
- **Algorithm:** XGBClassifier
- **ROC-AUC:** 0.5017
- **PR-AUC:** 0.3065

## 16. Feature Ablation
When comparing the Baseline (snapshot only) against the Temporal Model (snapshot + rolling + trends + lags), there was **no statistically significant improvement in ROC-AUC or PR-AUC**. 

## 17. Threshold Optimization
Optimized strictly on the Validation set for F1-score. The optimal threshold found was **0.30**.

## 18. Final Metrics (Untouched Future Test Set)
- **Accuracy:** 30.24%
- **Precision:** 30.23%
- **Recall:** 99.92%
- **F1:** 46.42%
- **ROC-AUC:** 0.5017
- **PR-AUC:** 0.3065

## 19. Precision-Recall Analysis
The PR-AUC (0.3065) perfectly matches the base rate of the target in the dataset (29.89%). This mathematically confirms the model is predicting at the level of random chance, despite complex historical features.

## 20. Feature Importance
Though predictive power is negligible, the tree split on:
1. `Motor_Temperature_rolling_std_1h`
2. `Battery_Temperature_rolling_mean_1h`
3. `Motor_Temperature_rolling_mean_1h`

## 21. Calibration
- **Brier Score:** 0.2467. Uncalibrated and clustered near the base rate.

## 22. Error Analysis
- **False Positives:** 18,347
- **False Negatives:** 6
- **True Positives:** 7,950
- **True Negatives:** 6
The model minimized F1 loss by lowering its threshold and raising a maintenance alert for nearly every timestamp.

## 23. API Integration Status
**BLOCKED.** The API currently receives only a current-state snapshot (`{"SoC": 0.8, ...}`). To run inference on the temporal model, the API would need to compute 1-hour rolling means and trends. Since we cannot calculate a 1-hour rolling mean from a single snapshot, the API integration is intentionally blocked pending backend architectural changes.

## 24. MongoDB Telemetry Requirement
**REQUIRED.** To support real-time temporal inference, MissionFlow AI must introduce a `missionflow.telemetry` time-series collection in MongoDB. The FastAPI backend must query the last 1 hour of telemetry for the specific vehicle to compute the rolling features before feeding them to the model. Currently, MongoDB only stores the master Fleet list.

## 25. Limitations
The Kaggle dataset (`EVIoT-PredictiveMaint`) appears to have randomly generated or entirely non-deterministic `Maintenance_Type` labels. There is ZERO auto-correlation or predictive signal linking historical telemetry to future failures. 

## 26. Final Conclusion
Phase 3 successfully engineered a scientifically robust temporal pipeline, but the results proved that **historical temporal behavior provided no genuine predictive power on untouched future data for this specific dataset.** Adding rolling features did not raise the ROC-AUC above 0.50. While the pipeline is now structurally production-ready, the current dataset cannot support a working predictive maintenance model.
