"""
Flask server for NLP Text Analysis & Motivation System
Provides REST API endpoints for text summarization, mood detection, and motivation.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

from summarizer import TextSummarizer
from mood_detector import MoodDetector
from motivator import Motivator

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global model instances
summarizer = None
mood_detector = None
motivator = None

# Request/Response Models
class TextAnalysisRequest:
    def __init__(self, text, include_summary=True, include_mood=True, include_motivation=True, summary_type="auto"):
        self.text = text
        self.include_summary = include_summary
        self.include_mood = include_mood
        self.include_motivation = include_motivation
        self.summary_type = summary_type

class SummaryResponse:
    def __init__(self, summary, method, original_length, summary_length, compression_ratio, key_phrases=None):
        self.summary = summary
        self.method = method
        self.original_length = original_length
        self.summary_length = summary_length
        self.compression_ratio = compression_ratio
        self.key_phrases = key_phrases or []

class MoodResponse:
    def __init__(self, overall_mood, mood_category, confidence, description, suggestions, sentiment, emotions, indicators):
        self.overall_mood = overall_mood
        self.mood_category = mood_category
        self.confidence = confidence
        self.description = description
        self.suggestions = suggestions
        self.sentiment = sentiment
        self.emotions = emotions
        self.indicators = indicators

class MotivationResponse:
    def __init__(self, motivational_quote, affirmations, coping_strategies, success_tip, encouragement, mood_addressed):
        self.motivational_quote = motivational_quote
        self.affirmations = affirmations
        self.coping_strategies = coping_strategies
        self.success_tip = success_tip
        self.encouragement = encouragement
        self.mood_addressed = mood_addressed

class ComprehensiveAnalysisResponse:
    def __init__(self, summary=None, mood=None, motivation=None, processing_time=0.0, success=True, message="Analysis completed successfully"):
        self.summary = summary
        self.mood = mood
        self.motivation = motivation
        self.processing_time = processing_time
        self.success = success
        self.message = message

# Initialize models
def get_models():
    global summarizer, mood_detector, motivator

    if summarizer is None:
        print("Initializing Text Summarizer...")
        summarizer = TextSummarizer()

    if mood_detector is None:
        print("Initializing Mood Detector...")
        mood_detector = MoodDetector()

    if motivator is None:
        print("Initializing Motivator...")
        motivator = Motivator()

    return summarizer, mood_detector, motivator

# Health check endpoint
@app.route("/")
def root():
    return jsonify({
        "message": "NLP Text Analysis & Motivation API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/health - Health check",
            "/analyze - Comprehensive text analysis",
            "/summarize - Text summarization only",
            "/mood - Mood detection only",
            "/motivate - Motivational content generation"
        ]
    })

@app.route("/health")
def health_check():
    return jsonify({"status": "healthy", "message": "API is running successfully"})

# Main comprehensive analysis endpoint
@app.route("/analyze", methods=["POST"])
def analyze_text():
    """
    Perform comprehensive text analysis including summarization, mood detection, and motivation.
    """
    import time
    start_time = time.time()

    try:
        data = request.get_json()
        text_request = TextAnalysisRequest(
            text=data.get("text", ""),
            include_summary=data.get("include_summary", True),
            include_mood=data.get("include_mood", True),
            include_motivation=data.get("include_motivation", True),
            summary_type=data.get("summary_type", "auto")
        )

        summarizer_instance, mood_detector_instance, motivator_instance = get_models()

        response = {
            "summary": None,
            "mood": None,
            "motivation": None,
            "processing_time": 0.0,
            "success": True,
            "message": "Analysis completed successfully"
        }

        # Text Summarization
        if text_request.include_summary:
            try:
                summary_result = summarizer_instance.smart_summarize(
                    text_request.text,
                    summary_type=text_request.summary_type
                )
                key_phrases = summarizer_instance.get_key_phrases(text_request.text)

                response["summary"] = {
                    "summary": summary_result["summary"],
                    "method": summary_result["method"],
                    "original_length": summary_result["original_length"],
                    "summary_length": summary_result["summary_length"],
                    "compression_ratio": summary_result["compression_ratio"],
                    "key_phrases": key_phrases
                }
            except Exception as e:
                print(f"Summarization error: {e}")
                response["summary"] = None

        # Mood Detection
        if text_request.include_mood:
            try:
                mood_result = mood_detector_instance.comprehensive_mood_analysis(text_request.text)

                response["mood"] = {
                    "overall_mood": mood_result["overall_mood"],
                    "mood_category": mood_result["mood_category"],
                    "confidence": mood_result["confidence"],
                    "description": mood_result["description"],
                    "suggestions": mood_result["suggestions"],
                    "sentiment": mood_result["sentiment"],
                    "emotions": mood_result["emotions"],
                    "indicators": mood_result["indicators"]
                }
            except Exception as e:
                print(f"Mood detection error: {e}")
                response["mood"] = None

        # Motivational Content
        if text_request.include_motivation and response["mood"]:
            try:
                motivation_result = motivator_instance.get_motivational_content(
                    response["mood"]["overall_mood"],
                    response["mood"]["mood_category"]
                )

                response["motivation"] = {
                    "motivational_quote": motivation_result["motivational_quote"],
                    "affirmations": motivation_result["affirmations"],
                    "coping_strategies": motivation_result["coping_strategies"],
                    "success_tip": motivation_result["success_tip"],
                    "encouragement": motivation_result["encouragement"],
                    "mood_addressed": motivation_result["mood_addressed"]
                }
            except Exception as e:
                print(f"Motivation generation error: {e}")
                response["motivation"] = None

        response["processing_time"] = round(time.time() - start_time, 3)
        return jsonify(response)

    except Exception as e:
        processing_time = round(time.time() - start_time, 3)
        return jsonify({
            "error": "Internal server error during analysis",
            "message": str(e),
            "processing_time": processing_time
        }), 500

# Individual endpoint for text summarization
@app.route("/summarize", methods=["POST"])
def summarize_text():
    """
    Generate a summary of the provided text.
    """
    try:
        data = request.get_json()

        summarizer_instance, _, _ = get_models()

        if data.get("summary_type") == "extractive":
            summary = summarizer_instance.extractive_summarize(data["text"], data.get("num_sentences", 3))
            result = {
                "summary": summary,
                "method": "extractive",
                "original_length": len(data["text"].split()),
                "summary_length": len(summary.split()),
                "compression_ratio": 0
            }
            result["compression_ratio"] = round((1 - result["summary_length"] / result["original_length"]) * 100, 2) if result["original_length"] > 0 else 0
        elif data.get("summary_type") == "abstractive":
            summary = summarizer_instance.abstractive_summarize(data["text"])
            result = {
                "summary": summary,
                "method": "abstractive",
                "original_length": len(data["text"].split()),
                "summary_length": len(summary.split()),
                "compression_ratio": 0
            }
            result["compression_ratio"] = round((1 - result["summary_length"] / result["original_length"]) * 100, 2) if result["original_length"] > 0 else 0
        else:
            result = summarizer_instance.smart_summarize(data["text"], data.get("summary_type", "auto"))

        key_phrases = summarizer_instance.get_key_phrases(data["text"])

        return jsonify({
            "summary": result["summary"],
            "method": result["method"],
            "original_length": result["original_length"],
            "summary_length": result["summary_length"],
            "compression_ratio": result["compression_ratio"],
            "key_phrases": key_phrases
        })

    except Exception as e:
        return jsonify({
            "error": "Error during summarization",
            "message": str(e)
        }), 500

# Individual endpoint for mood detection
@app.route("/mood", methods=["POST"])
def detect_mood():
    """
    Analyze the mood and emotional state of the provided text.
    """
    try:
        data = request.get_json()
        _, mood_detector_instance, _ = get_models()

        result = mood_detector_instance.comprehensive_mood_analysis(data["text"])

        return jsonify({
            "overall_mood": result["overall_mood"],
            "mood_category": result["mood_category"],
            "confidence": result["confidence"],
            "description": result["description"],
            "suggestions": result["suggestions"],
            "sentiment": result["sentiment"],
            "emotions": result["emotions"],
            "indicators": result["indicators"]
        })

    except Exception as e:
        return jsonify({
            "error": "Error during mood detection",
            "message": str(e)
        }), 500

# Individual endpoint for motivational content
@app.route("/motivate", methods=["POST"])
def generate_motivation():
    """
    Generate motivational content based on detected mood.
    """
    try:
        data = request.get_json()
        _, _, motivator_instance = get_models()

        result = motivator_instance.get_motivational_content(
            data["mood"],
            data.get("mood_category")
        )

        return jsonify({
            "motivational_quote": result["motivational_quote"],
            "affirmations": result["affirmations"],
            "coping_strategies": result["coping_strategies"],
            "success_tip": result["success_tip"],
            "encouragement": result["encouragement"],
            "mood_addressed": result["mood_addressed"]
        })

    except Exception as e:
        return jsonify({
            "error": "Error generating motivational content",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    print("Starting NLP Text Analysis & Motivation API...")
    print("Loading models... This may take a few moments.")

    # Initialize models on startup
    get_models()

    print("Models loaded successfully!")
    print("API will be available at: http://localhost:8000")
    print("Documentation available at: http://localhost:8000")

    # Run the server
    app.run(host="0.0.0.0", port=8000, debug=True)
