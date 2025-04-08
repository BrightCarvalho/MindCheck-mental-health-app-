from flask import Flask, request, jsonify
from PIL import Image
import torch
import io
import base64
import matplotlib.pyplot as plt
import sys
import json
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, pipeline
import os

# This function will be called directly from Node.js
def analyze_text(text):
    try:
        # Detect emotions
        emotion_scores = detect_emotion(text)
        mental_health_score, mental_state = analyze_mental_health(emotion_scores)
        emotion_chart = generate_emotion_chart(emotion_scores)

        return {
            "extracted_text": text,
            "emotion_scores": emotion_scores,
            "mental_health_score": mental_health_score,
            "mental_state": mental_state,
            "emotion_chart": emotion_chart
        }
    except Exception as e:
        print(f"Error processing text: {e}")
        return {"error": str(e)}

# Load Emotion Detection Model
try:
    emotion_classifier = pipeline('text-classification', model='bhadresh-savani/bert-base-uncased-emotion')
    print("Emotion classifier loaded successfully.")
except Exception as e:
    print(f"Error loading emotion classifier: {e}")
    emotion_classifier = None

# Function to detect emotions in text
def detect_emotion(text):
    if emotion_classifier is None:
        # Fallback if model fails to load
        return {
            "joy": 0.2,
            "sadness": 0.2,
            "anger": 0.2,
            "fear": 0.2,
            "love": 0.1,
            "surprise": 0.1
        }
    
    try:
        # Get emotion predictions
        emotion_prediction = emotion_classifier(text)
        
        # Create a dictionary of all possible emotions with default values
        emotions = {
            "joy": 0,
            "sadness": 0,
            "anger": 0,
            "fear": 0,
            "love": 0,
            "surprise": 0
        }
        
        # Update with predicted emotion
        predicted_emotion = emotion_prediction[0]['label']
        predicted_score = emotion_prediction[0]['score']
        
        # Set the predicted emotion score
        if predicted_emotion in emotions:
            emotions[predicted_emotion] = predicted_score
            
        # Normalize other emotions to sum to (1 - predicted_score)
        remaining_score = 1 - predicted_score
        remaining_emotions = len(emotions) - 1
        if remaining_emotions > 0:
            default_value = remaining_score / remaining_emotions
            for emotion in emotions:
                if emotion != predicted_emotion:
                    emotions[emotion] = default_value
                    
        return emotions
    except Exception as e:
        print(f"Error in emotion detection: {e}")
        # Return default values if error occurs
        return {
            "joy": 0.2,
            "sadness": 0.2,
            "anger": 0.2,
            "fear": 0.2,
            "love": 0.1,
            "surprise": 0.1
        }

# Function to analyze mental health based on emotions
def analyze_mental_health(emotion_scores):
    # Calculate mental health score (0-100)
    # Higher scores for positive emotions, lower for negative
    positive_emotions = ['joy', 'love', 'surprise']
    negative_emotions = ['sadness', 'anger', 'fear']
    
    positive_score = sum(emotion_scores.get(emotion, 0) for emotion in positive_emotions)
    negative_score = sum(emotion_scores.get(emotion, 0) for emotion in negative_emotions)
    
    # Calculate weighted score (0-100)
    mental_health_score = int((positive_score / (positive_score + negative_score + 0.0001)) * 100)
    
    # Determine mental state based on score
    if mental_health_score >= 70:
        mental_state = "Good Mental Health"
    elif mental_health_score >= 40:
        mental_state = "Moderate Mental Health"
    else:
        mental_state = "Poor Mental Health - Consider seeking support"
        
    return mental_health_score, mental_state

# Function to generate emotion chart
def generate_emotion_chart(emotion_scores):
    # In a real API, this would generate and return a chart image
    # For simplicity, we'll return a placeholder or data for frontend rendering
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQvhAAAAABJRU5ErkJggg=="

# When run directly from Node.js
if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        result = analyze_text(text)
        print(json.dumps(result))