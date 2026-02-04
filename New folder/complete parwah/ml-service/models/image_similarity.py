import imagehash
from PIL import Image
import requests
from io import BytesIO

class ImageSimilarity:
    def __init__(self):
        self.threshold = 10
    
    def get_image_hash(self, image_url):
        try:
            response = requests.get(image_url, timeout=10)
            img = Image.open(BytesIO(response.content))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            return imagehash.average_hash(img)
        except Exception as e:
            print(f"Error: {e}")
            raise
    
    def compare_images(self, url1, url2):
        try:
            hash1 = self.get_image_hash(url1)
            hash2 = self.get_image_hash(url2)
            distance = hash1 - hash2
            similarity = max(0, 100 - (distance * 100 / 64))
            
            return {
                'similarity': round(similarity, 2),
                'is_duplicate': distance <= self.threshold,
                'hamming_distance': int(distance)
            }
        except Exception as e:
            return {'similarity': 0, 'is_duplicate': False, 'error': str(e)}