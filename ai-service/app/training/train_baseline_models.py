import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "trained_models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Training corpora for Sentiment Analysis (POSITIVE, NEGATIVE, NEUTRAL)
SENTIMENT_DATA = [
    # Positive
    ("I feel great today, very energetic and optimistic about work.", "POSITIVE"),
    ("Having a good day, spent quality time with family and friends.", "POSITIVE"),
    ("Things are improving gradually and I feel hopeful for tomorrow.", "POSITIVE"),
    ("I accomplished my tasks and enjoyed a peaceful walk outdoors.", "POSITIVE"),
    ("Feeling grateful, happy, and calm inside today.", "POSITIVE"),
    ("I am making healthy progress with my daily mindfulness routine.", "POSITIVE"),
    ("Everything went smoothly and I feel motivated and refreshed.", "POSITIVE"),
    ("I slept well last night and woke up feeling energized and happy.", "POSITIVE"),
    ("Had a lovely conversation that lifted my spirits completely.", "POSITIVE"),
    ("Proud of myself for completing my workout and staying focused.", "POSITIVE"),
    
    # Negative
    ("I feel completely overwhelmed, exhausted, and cannot focus on anything.", "NEGATIVE"),
    ("Feeling very low and depressed today, having trouble getting out of bed.", "NEGATIVE"),
    ("Constant worry and panic make it difficult to breathe or relax.", "NEGATIVE"),
    ("Nobody understands what I am going through, I feel so isolated.", "NEGATIVE"),
    ("Everything is going wrong and I feel hopeless about the future.", "NEGATIVE"),
    ("Stressed out from work and constant headaches every day.", "NEGATIVE"),
    ("I feel miserable, lonely, and deeply sad inside.", "NEGATIVE"),
    ("Terrible insomnia again, lying awake worrying about failures.", "NEGATIVE"),
    ("Very irritable and angry at everyone around me today.", "NEGATIVE"),
    ("Feel like crying all the time and cannot stop worrying.", "NEGATIVE"),
    
    # Neutral
    ("I attended standard meetings and completed routine paperwork.", "NEUTRAL"),
    ("The weather was mild today, went to the grocery store.", "NEUTRAL"),
    ("Normal day at the office, nothing particularly good or bad.", "NEUTRAL"),
    ("Had breakfast at 8am, walked the dog around the park.", "NEUTRAL"),
    ("Checking emails and updating the weekly project spreadsheet.", "NEUTRAL"),
    ("Average day, feeling neither especially happy nor especially sad.", "NEUTRAL"),
    ("Read a chapter of a book and prepared dinner as usual.", "NEUTRAL"),
    ("Just following my regular schedule and everyday checklist.", "NEUTRAL")
]

# Training corpora for Emotion Detection (9 emotions: Happiness, Sadness, Anger, Fear, Anxiety, Frustration, Loneliness, Hope, Neutral)
EMOTION_DATA = [
    # Happiness
    ("I am so delighted and cheerful about how things turned out!", "Happiness"),
    ("Spent a joyful afternoon laughing with dear loved ones.", "Happiness"),
    ("Celebrating a big milestone, feeling wonderfully proud and happy.", "Happiness"),
    ("Such a pleasant, sunny day that brought a wide smile to my face.", "Happiness"),
    
    # Sadness
    ("Tears kept welling up, feeling deep sorrow and emptiness inside.", "Sadness"),
    ("Lost someone special and the grief feels heavy on my heart.", "Sadness"),
    ("Feeling low, gloomy, and emotionally drained since yesterday.", "Sadness"),
    ("A lingering feeling of sorrow that I cannot seem to shake off.", "Sadness"),
    
    # Anger
    ("I am absolutely furious at how unfairly I was treated today.", "Anger"),
    ("Boiling with rage because people refuse to take responsibility.", "Anger"),
    ("Mad at the betrayal and cannot believe the sheer disrespect.", "Anger"),
    ("So angry right now, clenched my fists and had to step away.", "Anger"),
    
    # Fear
    ("Terrified of what might happen next, my heart is pounding fast.", "Fear"),
    ("Trembling with fear, dreading the worst possible outcome.", "Fear"),
    ("A terrifying nightmare woke me up in cold sweat and panic.", "Fear"),
    ("Scared that something terrible is going to occur at any second.", "Fear"),
    
    # Anxiety
    ("Racing thoughts, constant restlessness, unable to sit still.", "Anxiety"),
    ("Anxious butterflies in my stomach, worrying endlessly about tomorrow.", "Anxiety"),
    ("Paralyzing dread, overthinking every little detail and possibility.", "Anxiety"),
    ("Constantly on edge, feeling tense and unable to calm my mind.", "Anxiety"),
    
    # Frustration
    ("Stuck on the same issue for hours and making zero progress.", "Frustration"),
    ("Exasperated by constant roadblocks and technical obstacles.", "Frustration"),
    ("It is so annoying when nothing seems to work out despite my effort.", "Frustration"),
    ("Tired of repeating myself to deaf ears, completely exasperated.", "Frustration"),
    
    # Loneliness
    ("Sitting in an empty room wishing someone would call or visit.", "Loneliness"),
    ("Surrounded by people yet feeling utterly alone and alienated.", "Loneliness"),
    ("Nobody truly knows me, feeling deeply detached and lonesome.", "Loneliness"),
    ("Yearning for connection and companionship, feeling forgotten.", "Loneliness"),
    
    # Hope
    ("I believe things will get better soon if I take it one day at a time.", "Hope"),
    ("Looking forward with optimism, new opportunities are dawning.", "Hope"),
    ("Grateful for small blessings, confident that brighter days are ahead.", "Hope"),
    ("Encouraged by my recovery progress, feeling hopeful for the future.", "Hope"),
    
    # Neutral
    ("I reviewed the documents and organized the filing cabinet.", "Neutral"),
    ("Walked to the bus station and commuted to the city center.", "Neutral"),
    ("Today was a standard ordinary day with usual tasks.", "Neutral"),
    ("Ordered lunch and watched an educational documentary.", "Neutral")
]

def train_and_save_models():
    print("Training Sentiment Analysis Model...")
    X_sent, y_sent = zip(*SENTIMENT_DATA)
    sentiment_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
        ('clf', LogisticRegression(max_iter=500, C=1.5, class_weight='balanced'))
    ])
    sentiment_pipeline.fit(X_sent, y_sent)
    joblib.dump(sentiment_pipeline, os.path.join(MODEL_DIR, "sentiment_model.joblib"))
    print("Sentiment model saved successfully.")

    print("Training Emotion Detection Model (9 classes)...")
    X_emo, y_emo = zip(*EMOTION_DATA)
    emotion_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
        ('clf', LogisticRegression(max_iter=500, C=1.5, class_weight='balanced'))
    ])
    emotion_pipeline.fit(X_emo, y_emo)
    joblib.dump(emotion_pipeline, os.path.join(MODEL_DIR, "emotion_model.joblib"))
    print("Emotion model saved successfully.")

if __name__ == "__main__":
    train_and_save_models()
