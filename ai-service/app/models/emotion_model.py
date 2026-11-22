import os
import joblib
import numpy as np
from app.preprocessing.text_cleaner import clean_text
from app.schemas.response_models import EmotionResult

MODEL_CANDIDATES = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "trained_models", "emotion_model.joblib"),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "trained_models", "emotion_model.joblib")
]
SUPPORTED_EMOTIONS = ["Happiness", "Sadness", "Anger", "Fear", "Anxiety", "Frustration", "Loneliness", "Hope", "Neutral"]

class EmotionDetector:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        for path in MODEL_CANDIDATES:
            if os.path.exists(path):
                self.model = joblib.load(path)
                return
        self.model = None

    def detect(self, text: str) -> EmotionResult:
        cleaned = clean_text(text)
        default_scores = {emo: (0.50 if emo == "Neutral" else 0.06) for emo in SUPPORTED_EMOTIONS}
        if not cleaned:
            return EmotionResult(
                dominant_emotion="Neutral",
                confidence=0.50,
                scores=default_scores
            )

        if self.model is not None:
            probs = self.model.predict_proba([cleaned])[0]
            classes = list(self.model.classes_)
            scores_dict = {}
            for emo in SUPPORTED_EMOTIONS:
                if emo in classes:
                    idx = classes.index(emo)
                    scores_dict[emo] = float(round(probs[idx], 4))
                else:
                    scores_dict[emo] = 0.01

            best_idx = int(np.argmax(probs))
            dominant = classes[best_idx]
            conf = float(round(probs[best_idx], 4))
            return EmotionResult(
                dominant_emotion=dominant,
                confidence=conf,
                scores=scores_dict
            )

        # Fallback if model not loaded
        return EmotionResult(
            dominant_emotion="Neutral",
            confidence=0.50,
            scores=default_scores
        )
