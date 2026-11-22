import pytest
from app.models.sentiment_model import SentimentAnalyzer

def test_sentiment_positive():
    analyzer = SentimentAnalyzer()
    res = analyzer.analyze("I am having a wonderful day, feeling happy and optimistic!")
    assert res.label == "POSITIVE"
    assert res.confidence >= 0.40

def test_sentiment_negative():
    analyzer = SentimentAnalyzer()
    res = analyzer.analyze("I feel completely miserable, depressed, and hopeless today.")
    assert res.label == "NEGATIVE"
    assert res.confidence >= 0.40

def test_sentiment_neutral():
    analyzer = SentimentAnalyzer()
    res = analyzer.analyze("Today was an ordinary Tuesday, reviewed emails and went to the store.")
    assert res.label in ["NEUTRAL", "POSITIVE"]
