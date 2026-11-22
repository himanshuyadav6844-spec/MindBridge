import re
import string

def clean_text(text: str) -> str:
    """Sanitizes and normalizes patient input text for NLP processing."""
    if not text:
        return ""
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text.strip())
    # Keep standard punctuation and alphanumeric characters
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text

def extract_keywords(text: str) -> list[str]:
    """Extracts lowercased word tokens."""
    cleaned = clean_text(text).lower()
    for p in string.punctuation:
        cleaned = cleaned.replace(p, ' ')
    tokens = [w.strip() for w in cleaned.split() if len(w.strip()) > 2]
    return tokens
