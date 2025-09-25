"""
FastAPI server for NLP Text Analysis & Motivation System
Provides REST API endpoints for text summarization, mood detection, and motivation.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import sys
import os

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

from summarizer import TextSummarizer
from mood_detector import MoodDetector
from motivator import Motivator

# Initialize FastAPI app
app = FastAPI(
    title="NLP Text Analysis & Motivation API",
    description="API for text summarization, mood detection, and motivational content generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instances
summarizer = None
mood_detector = None
motivator = None

# Request/Response Models
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to analyze")
    include_summary: bool = Field(True, description="Include text summarization")
    include_mood: bool = Field(True, description="Include mood detection")
    include_motivation: bool = Field(True, description="Include motivational content")
    summary_type: str = Field("auto", description="Type of summary: auto, extractive, abstractive")

class SummaryRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to summarize")
    summary_type: str = Field("auto", description="Type of summary: auto, extractive, abstractive")
    num_sentences: int = Field(3, ge=1, le=10, description="Number of sentences for extractive summary")

class MoodRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to analyze for mood")

class MotivationRequest(BaseModel):
    mood: str = Field(..., description="Detected mood state")
    mood_category: Optional[str] = Field(None, description="General mood category")

class SummaryResponse(BaseModel):
    summary: str
    method: str
    original_length: int
    summary_length: int
    compression_ratio: float
    key_phrases: List[str] = []

class MoodResponse(BaseModel):
    overall_mood: str
    mood_category: str
    confidence: float
    description: str
    suggestions: List[str]
    sentiment: Dict
    emotions: Dict
    indicators: Dict

class MotivationResponse(BaseModel):
    motivational_quote: str
    affirmations: List[str]
    coping_strategies: List[str]
    success_tip: str
    encouragement: str
    mood_addressed: str

class ComprehensiveAnalysisResponse(BaseModel):
    summary: Optional[SummaryResponse] = None
    mood: Optional[MoodResponse] = None
    motivation: Optional[MotivationResponse] = None
    processing_time: float
    success: bool
    message: str

# Dependency to initialize models
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
@app.get("/")
async def root():
    return {
        "message": "NLP Text Analysis & Motivation API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/docs - API documentation",
            "/analyze - Comprehensive text analysis",
            "/summarize - Text summarization only",
            "/mood - Mood detection only",
            "/motivate - Motivational content generation",
            "/daily-motivation - Daily motivational content"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running successfully"}

# Main comprehensive analysis endpoint
@app.post("/analyze", response_model=ComprehensiveAnalysisResponse)
async def analyze_text(
    request: TextAnalysisRequest,
    models: tuple = Depends(get_models)
):
    """
    Perform comprehensive text analysis including summarization, mood detection, and motivation.
    """
    import time
    start_time = time.time()
    
    try:
        summarizer_instance, mood_detector_instance, motivator_instance = models
        
        response = ComprehensiveAnalysisResponse(
            processing_time=0.0,
            success=True,
            message="Analysis completed successfully"
        )
        
        # Text Summarization
        if request.include_summary:
            try:
                summary_result = summarizer_instance.smart_summarize(
                    request.text, 
                    summary_type=request.summary_type
                )
                key_phrases = summarizer_instance.get_key_phrases(request.text)
                
                response.summary = SummaryResponse(
                    summary=summary_result["summary"],
                    method=summary_result["method"],
                    original_length=summary_result["original_length"],
                    summary_length=summary_result["summary_length"],
                    compression_ratio=summary_result["compression_ratio"],
                    key_phrases=key_phrases
                )
            except Exception as e:
                print(f"Summarization error: {e}")
                response.summary = None
        
        # Mood Detection
        if request.include_mood:
            try:
                mood_result = mood_detector_instance.comprehensive_mood_analysis(request.text)
                
                response.mood = MoodResponse(
                    overall_mood=mood_result["overall_mood"],
                    mood_category=mood_result["mood_category"],
                    confidence=mood_result["confidence"],
                    description=mood_result["description"],
                    suggestions=mood_result["suggestions"],
                    sentiment=mood_result["sentiment"],
                    emotions=mood_result["emotions"],
                    indicators=mood_result["indicators"]
                )
            except Exception as e:
                print(f"Mood detection error: {e}")
                response.mood = None
        
        # Motivational Content
        if request.include_motivation and response.mood:
            try:
                motivation_result = motivator_instance.get_motivational_content(
                    response.mood.overall_mood,
                    response.mood.mood_category
                )
                
                response.motivation = MotivationResponse(
                    motivational_quote=motivation_result["motivational_quote"],
                    affirmations=motivation_result["affirmations"],
                    coping_strategies=motivation_result["coping_strategies"],
                    success_tip=motivation_result["success_tip"],
                    encouragement=motivation_result["encouragement"],
                    mood_addressed=motivation_result["mood_addressed"]
                )
            except Exception as e:
                print(f"Motivation generation error: {e}")
                response.motivation = None
        
        response.processing_time = round(time.time() - start_time, 3)
        return response
        
    except Exception as e:
        processing_time = round(time.time() - start_time, 3)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error during analysis",
                "message": str(e),
                "processing_time": processing_time
            }
        )

# Individual endpoint for text summarization
@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(
    request: SummaryRequest,
    models: tuple = Depends(get_models)
):
    """
    Generate a summary of the provided text.
    """
    try:
        summarizer_instance, _, _ = models
        
        if request.summary_type == "extractive":
            summary = summarizer_instance.extractive_summarize(request.text, request.num_sentences)
            result = {
                "summary": summary,
                "method": "extractive",
                "original_length": len(request.text.split()),
                "summary_length": len(summary.split()),
                "compression_ratio": 0
            }
            result["compression_ratio"] = round((1 - result["summary_length"] / result["original_length"]) * 100, 2) if result["original_length"] > 0 else 0
        elif request.summary_type == "abstractive":
            summary = summarizer_instance.abstractive_summarize(request.text)
            result = {
                "summary": summary,
                "method": "abstractive",
                "original_length": len(request.text.split()),
                "summary_length": len(summary.split()),
                "compression_ratio": 0
            }
            result["compression_ratio"] = round((1 - result["summary_length"] / result["original_length"]) * 100, 2) if result["original_length"] > 0 else 0
        else:
            result = summarizer_instance.smart_summarize(request.text, request.summary_type)
        
        key_phrases = summarizer_instance.get_key_phrases(request.text)
        
        return SummaryResponse(
            summary=result["summary"],
            method=result["method"],
            original_length=result["original_length"],
            summary_length=result["summary_length"],
            compression_ratio=result["compression_ratio"],
            key_phrases=key_phrases
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during summarization: {str(e)}"
        )

# Individual endpoint for mood detection
@app.post("/mood", response_model=MoodResponse)
async def detect_mood(
    request: MoodRequest,
    models: tuple = Depends(get_models)
):
    """
    Analyze the mood and emotional state of the provided text.
    """
    try:
        _, mood_detector_instance, _ = models
        
        result = mood_detector_instance.comprehensive_mood_analysis(request.text)
        
        return MoodResponse(
            overall_mood=result["overall_mood"],
            mood_category=result["mood_category"],
            confidence=result["confidence"],
            description=result["description"],
            suggestions=result["suggestions"],
            sentiment=result["sentiment"],
            emotions=result["emotions"],
            indicators=result["indicators"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during mood detection: {str(e)}"
        )

# Individual endpoint for motivational content
@app.post("/motivate", response_model=MotivationResponse)
async def generate_motivation(
    request: MotivationRequest,
    models: tuple = Depends(get_models)
):
    """
    Generate motivational content based on detected mood.
    """
    try:
        _, _, motivator_instance = models
        
        result = motivator_instance.get_motivational_content(
            request.mood,
            request.mood_category
        )
        
        return MotivationResponse(
            motivational_quote=result["motivational_quote"],
            affirmations=result["affirmations"],
            coping_strategies=result["coping_strategies"],
            success_tip=result["success_tip"],
            encouragement=result["encouragement"],
            mood_addressed=result["mood_addressed"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating motivational content: {str(e)}"
        )

# Daily motivation endpoint
@app.get("/daily-motivation")
async def get_daily_motivation(models: tuple = Depends(get_models)):
    """
    Get daily motivational content (quotes, affirmations, tips).
    """
    try:
        _, _, motivator_instance = models
        
        result = motivator_instance.get_daily_motivation()
        
        return {
            "daily_quote": result["daily_quote"],
            "daily_affirmation": result["daily_affirmation"],
            "success_tip": result["success_tip"],
            "message": "Daily dose of motivation delivered!"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting daily motivation: {str(e)}"
        )

# Emergency support endpoint
@app.get("/emergency-support")
async def get_emergency_support(models: tuple = Depends(get_models)):
    """
    Get crisis support resources and emergency help information.
    """
    try:
        _, _, motivator_instance = models
        
        result = motivator_instance.get_emergency_support()
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting emergency support info: {str(e)}"
        )

# Model information endpoint
@app.get("/models/info")
async def get_model_info():
    """
    Get information about loaded models and their capabilities.
    """
    return {
        "models": {
            "summarizer": {
                "description": "Text summarization using extractive and abstractive methods",
                "capabilities": ["extractive", "abstractive", "auto", "key_phrases"],
                "max_input_length": "10,000 characters"
            },
            "mood_detector": {
                "description": "Comprehensive mood and sentiment analysis",
                "capabilities": ["sentiment", "emotions", "mood_indicators", "suggestions"],
                "supported_moods": ["very_positive", "positive", "neutral", "negative", "very_negative", "angry", "stressed", "excited", "surprised"]
            },
            "motivator": {
                "description": "Personalized motivational content generation",
                "capabilities": ["mood_based_quotes", "affirmations", "coping_strategies", "daily_motivation"],
                "content_types": ["quotes", "affirmations", "strategies", "tips", "encouragement"]
            }
        },
        "api_features": [
            "Comprehensive text analysis",
            "Individual component analysis",
            "Real-time processing",
            "Mood-based motivation",
            "Crisis support resources",
            "Daily motivational content"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    print("Starting NLP Text Analysis & Motivation API...")
    print("Loading models... This may take a few moments.")
    
    # Initialize models on startup
    get_models()
    
    print("Models loaded successfully!")
    print("API will be available at: http://localhost:8000")
    print("Documentation available at: http://localhost:8000/docs")
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
