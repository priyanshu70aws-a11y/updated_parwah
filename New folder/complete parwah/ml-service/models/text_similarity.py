from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

class TextSimilarity:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(lowercase=True, stop_words='english', max_features=100)
        self.threshold = 0.7
    
    def preprocess_text(self, text):
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text.strip()
    
    def compare_texts(self, text1, text2):
        try:
            text1_clean = self.preprocess_text(text1)
            text2_clean = self.preprocess_text(text2)
            
            if not text1_clean or not text2_clean:
                return {'similarity': 0, 'is_duplicate': False}
            
            vectors = self.vectorizer.fit_transform([text1_clean, text2_clean])
            sim_matrix = cosine_similarity(vectors)
            cosine_score = sim_matrix[0][1]
            
            return {
                'similarity': round(cosine_score * 100, 2),
                'is_duplicate': cosine_score >= self.threshold,
                'cosine_score': round(cosine_score, 4)
            }
        except Exception as e:
            return {'similarity': 0, 'is_duplicate': False, 'error': str(e)}