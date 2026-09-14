"""
MissionFlow AI
ETA Prediction Service

Loads the trained ETA model and provides predictions
for delivery/trip duration.
"""

from pathlib import Path
from typing import Any, Dict

import joblib
import pandas as pd


# ------------------------------------------------------------
# Model configuration
# ------------------------------------------------------------

CURRENT_FILE = Path(__file__).resolve()

PROJECT_ROOT = CURRENT_FILE.parents[3]

MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "artifacts"
    / "eta_model"
    / "eta_model.joblib"
)


# ------------------------------------------------------------
# ETA Prediction Service
# ------------------------------------------------------------

class ETAPredictionService:
    """Service responsible for loading and running the ETA model."""

    def __init__(self, model_path: Path = MODEL_PATH):
        self.model_path = Path(model_path)
        self.model = None

    def load_model(self) -> None:
        """Load the trained ETA model from disk."""

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"ETA model not found at: {self.model_path}"
            )

        self.model = joblib.load(self.model_path)

    def predict_eta(
        self,
        features: Dict[str, Any],
    ) -> float:
        """
        Predict trip duration in minutes.

        Parameters
        ----------
        features:
            Dictionary containing the features expected by
            the trained ETA model.

        Returns
        -------
        float
            Predicted trip duration in minutes.
        """

        if self.model is None:
            self.load_model()

        input_data = pd.DataFrame([features])

        prediction = self.model.predict(input_data)[0]

        return float(max(0.0, prediction))


# ------------------------------------------------------------
# Shared service instance
# ------------------------------------------------------------

eta_prediction_service = ETAPredictionService()
