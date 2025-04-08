# download_models.py
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, pipeline
import os

os.makedirs('./models', exist_ok=True)

# Download TrOCR model
print("Downloading TrOCR model...")
try:
    TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten', cache_dir='./models')
    VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten', cache_dir='./models')
    print("TrOCR model downloaded successfully!")
except Exception as e:
    print(f"Error downloading TrOCR model: {e}")

# Download Emotion model
print("Downloading Emotion model...")
try:
    pipeline('text-classification', 
            model='bhadresh-savani/bert-base-uncased-emotion',
            cache_dir='./models')
    print("Emotion model downloaded successfully!")
except Exception as e:
    print(f"Error downloading Emotion model: {e}")