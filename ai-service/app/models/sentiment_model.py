import os
import joblib
import numpy as np
from app.preprocessing.text_cleaner import clean_text
from app.schemas.response_models import SentimentResult

MODEL_CANDIDATES = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "trained_models", "sentiment_model.joblib"),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "trained_models", "sentiment_model.joblib")
]

class SentimentAnalyzer:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        for path in MODEL_CANDIDATES:
            if os.path.exists(path):
                self.model = joblib.load(path)
                return
        self.model = None

    def analyze(self, text: str) -> SentimentResult:
        cleaned = clean_text(text)
        if not cleaned:
            return SentimentResult(
                label="NEUTRAL",
                confidence=0.5,
                probabilities={"POSITIVE": 0.25, "NEGATIVE": 0.25, "NEUTRAL": 0.50}
            )

        if self.model is not None:
            probs = self.model.predict_proba([cleaned])[0]
            classes = list(self.model.classes_)
            prob_dict = {cls_name: float(round(p, 4)) for cls_name, p in zip(classes, probs)}
            best_idx = int(np.argmax(probs))
            label = classes[best_idx]
            conf = float(round(probs[best_idx], 4))
            return SentimentResult(
                label=label,
                confidence=conf,
                probabilities=prob_dict
            )

        # Fallback heuristic if model file missing
        lower = cleaned.lower()
        neg_count = sum(1 for w in ["sad", "depressed", "anxious", "worried", "awful", "terrible", "bad", "hopeless", "hurt", "tired"] if w in lower)
        pos_count = sum(1 for w in ["happy", "good", "great", "glad", "peaceful", "calm", "hopeful", "joy", "better", "improving"] if w in lower)
        if neg_count > pos_count:
            return SentimentResult(label="NEGATIVE", confidence=0.75, probabilities={"NEGATIVE": 0.75, "NEUTRAL": 0.15, "POSITIVE": 0.10})
        elif pos_count > neg_count:
            return SentimentResult(label="POSITIVE", confidence=0.75, probabilities={"POSITIVE": 0.75, "NEUTRAL": 0.15, "NEGATIVE": 0.10})
        return SentimentResult(label="NEUTRAL", confidence=0.60, probabilities={"NEUTRAL": 0.60, "POSITIVE": 0.20, "NEGATIVE": 0.20})
