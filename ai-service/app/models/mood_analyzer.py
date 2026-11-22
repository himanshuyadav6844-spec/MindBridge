from typing import Optional
from app.schemas.response_models import MoodAnalysisResult

MOOD_LABELS = {
    1: "Very Low",
    2: "Low",
    3: "Neutral",
    4: "Good",
    5: "Very Good"
}

class MoodAnalyzer:
    """
    Synthesizes self-reported mood, assessment symptom indicators,
    and NLP emotional tone into an AI-inferred mood (scale 1-5).
    Maintains a strict distinction between self-reported and AI-inferred values.
    """

    def analyze_mood(
        self,
        self_reported_mood: int,
        assessment_total_score: int, # PHQ/GAD indicator composite (0-27)
        dominant_emotion: str,
        sentiment_label: str,
        historical_mood_average: Optional[float] = None
    ) -> MoodAnalysisResult:
        # Scale: 1 = Very Low, 2 = Low, 3 = Neutral, 4 = Good, 5 = Very Good
        calculated_mood = float(self_reported_mood)

        # Adjust based on assessment score
        if assessment_total_score >= 18:
            calculated_mood -= 1.5
        elif assessment_total_score >= 12:
            calculated_mood -= 1.0
        elif assessment_total_score >= 6:
            calculated_mood -= 0.5
        elif assessment_total_score <= 2:
            calculated_mood += 0.5

        # Adjust based on sentiment
        if sentiment_label == "NEGATIVE":
            calculated_mood -= 0.5
        elif sentiment_label == "POSITIVE":
            calculated_mood += 0.5

        # Adjust based on dominant emotion
        if dominant_emotion in ["Sadness", "Loneliness", "Fear", "Anxiety"]:
            calculated_mood -= 0.5
        elif dominant_emotion in ["Happiness", "Hope"]:
            calculated_mood += 0.5

        # Bound to 1-5
        ai_inferred = int(round(max(1.0, min(5.0, calculated_mood))))

        # Determine trend if historical data provided
        trend = "STABLE"
        if historical_mood_average is not None:
            diff = ai_inferred - historical_mood_average
            if diff >= 0.7:
                trend = "IMPROVING"
            elif diff <= -0.7:
                trend = "DECLINING"
            elif abs(diff) > 0.4:
                trend = "FLUCTUATING"

        label = MOOD_LABELS.get(ai_inferred, "Neutral")
        description = (
            f"Self-reported mood was rated {self_reported_mood}/5 ({MOOD_LABELS.get(self_reported_mood, 'Neutral')}). "
            f"AI evaluation of assessment responses and emotional expression infers an overall mood state of {ai_inferred}/5 ({label})."
        )

        return MoodAnalysisResult(
            self_reported_mood=self_reported_mood,
            ai_inferred_mood=ai_inferred,
            mood_label=label,
            mood_trend=trend,
            description=description
        )
