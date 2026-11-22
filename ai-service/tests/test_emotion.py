import pytest
from app.models.emotion_model import EmotionDetector

def test_emotion_detection_anxiety():
    detector = EmotionDetector()
    res = detector.detect("My heart is racing, panic attack, nervous overthinking every single detail.")
    assert res.dominant_emotion in ["Anxiety", "Fear"]
    assert "Anxiety" in res.scores

def test_emotion_detection_happiness():
    detector = EmotionDetector()
    res = detector.detect("Delighted and full of joy celebrating with close friends.")
    assert res.dominant_emotion == "Happiness"

def test_emotion_detection_sadness():
    detector = EmotionDetector()
    res = detector.detect("Deep grief, sorrow, crying and feeling so empty inside.")
    assert res.dominant_emotion == "Sadness"
