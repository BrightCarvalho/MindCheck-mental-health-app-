from flask import Flask, request, jsonify
from PIL import Image
import torch
import io
import base64
import matplotlib.pyplot as plt
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, pipeline
from flask_cors import CORS
import os

# Update the CORS configuration to allow all routes
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Add a new route for text input
@app.route("/analyze-text", methods=["POST"])
def analyze_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        # Detect emotions
        emotion_scores = detect_emotion(text)
        mental_health_score, mental_state = analyze_mental_health(emotion_scores)
        emotion_chart = generate_emotion_chart(emotion_scores)

        return jsonify({
            "extracted_text": text,
            "emotion_scores": emotion_scores,
            "mental_health_score": mental_health_score,
            "mental_state": mental_state,
            "emotion_chart": emotion_chart
        }), 200
    except Exception as e:
        print(f"Error processing text: {e}")
        return jsonify({"error": str(e)}), 500

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load TrOCR processor and model
try:
    processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
    model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
    print("TrOCR model loaded successfully.")
except Exception as e:
    print(f"Error loading TrOCR model: {e}")

# Load Emotion Detection Model
try:
    emotion_classifier = pipeline('text-classification', model='bhadresh-savani/bert-base-uncased-emotion')
    print("Emotion classifier loaded successfully.")
except Exception as e:
    print(f"Error loading Emotion classifier: {e}")

# API to check if backend is running
@app.route("/")
def home():
    return jsonify({"message": "Backend is running"}), 200

# API to handle file upload and processing
@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        # Check if text data is provided
        if 'text' in request.form:
            text = request.form['text']
            # Process text directly
            emotion_scores = detect_emotion(text)
            mental_health_score, mental_state = analyze_mental_health(emotion_scores)
            emotion_chart = generate_emotion_chart(emotion_scores)

            return jsonify({
                "extracted_text": text,
                "emotion_scores": emotion_scores,
                "mental_health_score": mental_health_score,
                "mental_state": mental_state,
                "emotion_chart": emotion_chart
            }), 200

        # Handle file upload
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Process image file
        image = Image.open(file.stream).convert("RGB")
        sections = split_image_into_lines(image)
        extracted_text = extract_text_from_sections(sections)

        # Detect emotions
        emotion_scores = detect_emotion(extracted_text)
        mental_health_score, mental_state = analyze_mental_health(emotion_scores)
        emotion_chart = generate_emotion_chart(emotion_scores)

        return jsonify({
            "extracted_text": extracted_text,
            "emotion_scores": emotion_scores,
            "mental_health_score": mental_health_score,
            "mental_state": mental_state,
            "emotion_chart": emotion_chart
        }), 200

    except Exception as e:
        print(f"Error during processing: {e}")
        return jsonify({"error": str(e)}), 500

# Function to split the image into sections
def split_image_into_lines(image, num_sections=26):
    width, height = image.size
    section_height = height // num_sections
    sections = [image.crop((0, i * section_height, width, (i + 1) * section_height)) for i in range(num_sections)]
    return sections

# Function to resize image section (optimization)
def resize_section(section, max_width=512, max_height=64):
    section.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return section

# Function to extract text from an image section
def extract_text_from_section(section):
    pixel_values = processor(images=section, return_tensors="pt").pixel_values
    with torch.no_grad():
        generated_ids = model.generate(pixel_values)
    extracted_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return extracted_text

# Function to extract text from all sections
def extract_text_from_sections(sections):
    resized_sections = [resize_section(section) for section in sections]
    extracted_texts = [extract_text_from_section(section) for section in resized_sections]
    return " ".join(extracted_texts)

# Function to detect emotions from text
def detect_emotion(text):
    truncated_text = " ".join(text.split()[:512])  # Limit text length
    emotion_results = emotion_classifier(truncated_text)

    # Convert list of emotion dictionaries to a usable dictionary
    emotion_scores = {res["label"]: res["score"] for res in emotion_results}

    return emotion_scores

# Function to analyze mental health based on emotions
def analyze_mental_health(emotions):
    # Define categories
    positive_emotions = ["joy", "love"]
    negative_emotions = ["anger", "sadness", "fear"]
    neutral_emotions = ["surprise"]

    # Calculate scores
    positive_score = sum(emotions.get(em, 0) for em in positive_emotions)
    negative_score = sum(emotions.get(em, 0) for em in negative_emotions)
    neutral_score = sum(emotions.get(em, 0) for em in neutral_emotions)

    # Calculate a mental health score (scale 0-100)
    mental_health_score = ((positive_score - negative_score) + 1) * 50

    # Determine mental state
    if mental_health_score > 70:
        mental_state = "Good Mental Health"
    elif mental_health_score > 40:
        mental_state = "Moderate Mental Health"
    else:
        mental_state = "Poor Mental Health"

    return round(mental_health_score, 2), mental_state

# Function to generate an emotion distribution chart
def generate_emotion_chart(emotions):
    labels = list(emotions.keys())
    values = list(emotions.values())

    plt.figure(figsize=(6, 6))
    plt.pie(values, labels=labels, autopct="%1.1f%%", colors=["yellow", "red", "purple", "blue", "pink", "gray"])
    plt.title("Emotion Distribution")

    # Save the plot to a buffer
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    encoded_chart = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close()

    return encoded_chart

if __name__ == "__main__":
    app.run(debug=True, port=5000)