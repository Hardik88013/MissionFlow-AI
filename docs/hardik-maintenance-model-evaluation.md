# Predictive Maintenance Model Evaluation

## 1. Objective
Perform a scientifically rigorous, leakage-free evaluation of the predictive maintenance model, optimize thresholds based on precision-recall tradeoffs, and ensure maximum real-world reliability.

## 2. Dataset
- **Source:** EVIoT-PredictiveMaint Dataset (`EV_Predictive_Maintenance_Dataset_15min.csv`)
- **Total Records:** 175,393

## 3. Target Definition
`needs_maintenance`: Derived as `Maintenance_Type > 0`.

## 4. Class Distribution
- **Failure Count (Needs Maintenance):** 52,435
- **Normal Count (Healthy):** 122,958
- **Failure Percentage:** 29.90%

## 5. Original Random Forest Baseline
- **Accuracy:** 67.47%
- **Precision:** 31.27%
- **Recall:** 7.36%
- **F1:** 11.92%
- **ROC-AUC:** 50.06%
*(Note: Evaluated on a random train/test split).*

## 6. Previous XGBoost Results (Phase 2.0)
- **Precision:** 64.76%
- **Recall:** 60.55%
- **F1:** 62.59%
- **ROC-AUC:** 69.33%
*(Note: These metrics were flagged for a leakage investigation).*

## 7. Leakage Investigation (CRITICAL FINDING)
**LEAKAGE FOUND: YES.**
An extensive audit of the Phase 2.0 pipeline revealed two catastrophic sources of data leakage that artificially inflated the evaluation metrics:
1. **SMOTE Leakage:** SMOTE was previously applied to the *entire* dataset *before* the `train_test_split`. This meant synthetic samples generated from the test data leaked into the training set, allowing the model to "memorize" the test set.
2. **Temporal Leakage:** The dataset was previously split randomly. Because IoT telemetry is highly correlated sequentially (timestamp $t$ is nearly identical to timestamp $t+1$), a random split places virtually identical records in both the train and test set.

## 8. Time-Based Evaluation
**Time-Based Split: YES.**
To fix the temporal leakage, the dataset was sorted chronologically by `Timestamp`. The first 80% of time was used strictly for training, and the model was evaluated on the unseen, future 20% of data.

## 9. Vehicle-Level Evaluation
**Vehicle-Aware Split: NO.**
The dataset lacks a discrete `Vehicle_ID` column, meaning vehicle-level grouped cross-validation is impossible. Time-based splitting is the strictest available proxy.

## 10. SMOTE Evaluation
When SMOTE is correctly applied *only* to the training set during a chronological split, its benefits vanish. SMOTE was removed from the final pipeline in favor of `scale_pos_weight` to prevent overfitting to noisy minority examples.

## 11. Class Weight Evaluation
Used `scale_pos_weight = 2.34` native to XGBoost based on the exact failure ratio in the training set.

## 12. Threshold Analysis
The default threshold (0.50) yielded a 0% Recall because predicting future failures purely from point-in-time snapshot telemetry is incredibly difficult. 
The optimal threshold for F1 was found at **0.10**.

## 13. Precision-Recall Analysis
At the optimal threshold (0.10):
- **Precision:** 30.19% (Exactly matches the base prevalence of failures in the test set)
- **Recall:** 100.00%
- **F1-Score:** 46.38%
- **PR-AUC:** 30.18%

## 14. Cross-Validation
Temporal Holdout Validation (Train: 140,314 records | Test: 35,079 future records).

## 15. Model Comparison
Comparing approaches on the strictly leakage-free temporal split:
- **RF (Baseline):** Guessed "healthy" mostly (ROC-AUC: 0.50)
- **XGBoost + Leakage:** Artificially scored 69% ROC-AUC.
- **XGBoost + Strict Temporal Split:** Scores 49.89% ROC-AUC.

## 16. Hyperparameter Tuning
- `n_estimators`: 300
- `max_depth`: 6
- `learning_rate`: 0.05
- `subsample` & `colsample_bytree`: 0.8

## 17. Feature Ablation
The engineered features (`Temp_Ratio`, `Power_Demand`, `Vibration_RPM`) were retained as they slightly stabilized the training loss, but did not overcome the inherent lack of chronological predictive power in point-in-time telemetry.

## 18. Feature Importance
Top 5 Features driving the model:
1. `Tire_Pressure`
2. `Battery_Temperature`
3. `SoC`
4. `Motor_Temperature`
5. `Driving_Speed`

## 19. Error Analysis
**False Positives:** 24,487
**False Negatives:** 0
**True Positives:** 10,592
**True Negatives:** 0
To achieve any recall on future data, the model had to lower its threshold drastically, essentially raising an alert for *every* future record. This proves that snapshot telemetry cannot predict future failures.

## 20. Probability Calibration
- **Brier Score:** 0.2485. 
The probabilities are heavily clustered and weakly calibrated because the model lacks time-series history (e.g., rolling averages).

## 21. Final Model
- **Algorithm:** XGBClassifier
- **Strategy:** Time-based split + `scale_pos_weight` + Threshold tuning (0.10).

## 22. Final Honest Metrics (No Leakage)
- **Accuracy:** 30.19%
- **Precision:** 30.19%
- **Recall:** 100.00%
- **F1:** 46.38%
- **ROC-AUC:** 49.89%
- **PR-AUC:** 30.18%

## 23. Why This Model Was Selected
This model was selected because it represents the **scientifically honest reality** of the dataset. While the metrics are drastically lower than Phase 2.0, they are *real*. The previous model's high scores were a dangerous illusion caused by data leakage.

## 24. Limitations
**Point-in-Time Telemetry is Insufficient.** You cannot predict if a motor will fail tomorrow simply by knowing its temperature at exactly 12:00 PM today.

## 25. Future Improvements (Phase 3)
To achieve genuinely high metrics without leakage, we must fundamentally change the feature engineering to use **Rolling Time Windows**:
- Add `30_min_rolling_avg_temp`
- Add `vibration_delta_over_1_hour`
- Add `temperature_spikes_past_24h`
