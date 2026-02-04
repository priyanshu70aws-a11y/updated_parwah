from models.image_similarity import ImageSimilarity
from models.text_similarity import TextSimilarity

class DeduplicationEngine:
    def __init__(self):
        self.image_sim = ImageSimilarity()
        self.text_sim = TextSimilarity()
        self.weights = {'image': 0.5, 'text': 0.3, 'gps': 0.2}
        self.threshold = 75
    
    def check_duplicate(self, new_complaint, existing_complaints):
        if not existing_complaints:
            return {
                'is_duplicate': False,
                'duplicate_of': None,
                'similarity_score': 0,
                'breakdown': {}
            }
        
        best_match = None
        highest_score = 0
        
        for existing in existing_complaints:
            scores = {'image': 0, 'text': 0, 'gps': 0}
            
            # Image similarity
            new_images = new_complaint.get('image_urls', [])
            existing_images = existing.get('image_urls', [])
            
            if new_images and existing_images:
                try:
                    img_result = self.image_sim.compare_images(new_images[0], existing_images[0])
                    scores['image'] = img_result['similarity']
                except:
                    scores['image'] = 0
            
            # Text similarity
            try:
                text_result = self.text_sim.compare_texts(
                    new_complaint.get('description', ''),
                    existing.get('description', '')
                )
                scores['text'] = text_result['similarity']
            except:
                scores['text'] = 0
            
            # GPS similarity (from backend)
            scores['gps'] = existing.get('gps_similarity', 0)
            
            # Combined score
            combined = (
                scores['image'] * self.weights['image'] +
                scores['text'] * self.weights['text'] +
                scores['gps'] * self.weights['gps']
            )
            
            if combined > highest_score:
                highest_score = combined
                best_match = {
                    'id': existing['id'],
                    'score': round(combined, 2),
                    'breakdown': {k: round(v, 2) for k, v in scores.items()}
                }
        
        is_duplicate = highest_score >= self.threshold
        
        return {
            'is_duplicate': is_duplicate,
            'duplicate_of': best_match['id'] if is_duplicate else None,
            'similarity_score': best_match['score'] if best_match else 0,
            'breakdown': best_match['breakdown'] if best_match else {}
        }