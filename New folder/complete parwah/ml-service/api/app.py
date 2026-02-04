from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.deduplication import DeduplicationEngine

app = Flask(__name__)
CORS(app)

dedup_engine = DeduplicationEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'PARWAH ML Service'})

@app.route('/api/deduplication/check', methods=['POST'])
def check_deduplication():
    try:
        data = request.json
        new_complaint = data.get('new_complaint')
        existing_complaints = data.get('existing_complaints', [])
        
        result = dedup_engine.check_duplicate(new_complaint, existing_complaints)
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 ML Service running on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)