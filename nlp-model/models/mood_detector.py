"""
Mood Detection Model
Analyzes text sentiment and emotional state to detect user mood.
"""

import re
from typing import Dict, List, Tuple
from textblob import TextBlob
from transformers import pipeline
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

class MoodDetector:
    def __init__(self):
        """Initialize the mood detector with sentiment analysis models."""
        self.sentiment_analyzer = None
        self.emotion_classifier = None
        self._download_nltk_data()
        self._initialize_models()
        
        # Emotion keywords for enhanced detection
        self.emotion_keywords = {
            'joy': ['happy', 'joyful', 'excited', 'cheerful', 'delighted', 'pleased', 'glad', 'thrilled', 'elated', 'content'],
            'sadness': ['sad', 'depressed', 'unhappy', 'melancholy', 'down', 'blue', 'miserable', 'dejected', 'gloomy', 'sorrowful'],
            'anger': ['angry', 'furious', 'mad', 'irritated', 'annoyed', 'frustrated', 'enraged', 'livid', 'outraged', 'irate'],
            'fear': ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous', 'frightened', 'panicked', 'alarmed', 'uneasy'],
            'surprise': ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'bewildered', 'startled', 'astounded'],
            'disgust': ['disgusted', 'revolted', 'sickened', 'appalled', 'repulsed', 'nauseated', 'horrified'],
            'trust': ['trust', 'confident', 'secure', 'assured', 'certain', 'optimistic', 'hopeful', 'positive'],
            'anticipation': ['excited', 'eager', 'expectant', 'hopeful', 'looking forward', 'anticipating']
        }
        
        # Stress and mental health indicators
        self.stress_keywords = ['stressed', 'overwhelmed', 'burnout', 'exhausted', 'tired', 'drained', 'pressure', 'burden']
        self.negative_keywords = ['terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'pathetic', 'useless']
        self.positive_keywords = ['amazing', 'wonderful', 'fantastic', 'excellent', 'brilliant', 'awesome', 'perfect', 'love']
    
    def _download_nltk_data(self):
        """Download required NLTK data."""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
    
    def _initialize_models(self):
        """Initialize pre-trained sentiment analysis models."""
        try:
            # Initialize transformer-based sentiment analyzer
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
        except Exception as e:
            print(f"Warning: Could not load RoBERTa model: {e}")
            try:
                # Fallback to DistilBERT
                self.sentiment_analyzer = pipeline("sentiment-analysis")
            except Exception as e2:
                print(f"Warning: Could not load fallback sentiment model: {e2}")
                self.sentiment_analyzer = None
        
        try:
            # Initialize emotion classification model
            self.emotion_classifier = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base"
            )
        except Exception as e:
            print(f"Warning: Could not load emotion classifier: {e}")
            self.emotion_classifier = None
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for better analysis."""
        # Remove URLs, mentions, and hashtags
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        text = re.sub(r'@[A-Za-z0-9_]+', '', text)
        text = re.sub(r'#[A-Za-z0-9_]+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def analyze_sentiment_basic(self, text: str) -> Dict:
        """Basic sentiment analysis using TextBlob."""
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity  # -1 to 1
        subjectivity = blob.sentiment.subjectivity  # 0 to 1
        
        # Convert polarity to sentiment label
        if polarity > 0.1:
            sentiment = "positive"
        elif polarity < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "sentiment": sentiment,
            "polarity": round(polarity, 3),
            "subjectivity": round(subjectivity, 3),
            "confidence": abs(polarity)
        }
    
    def analyze_sentiment_advanced(self, text: str) -> Dict:
        """Advanced sentiment analysis using transformer models."""
        if not self.sentiment_analyzer:
            return self.analyze_sentiment_basic(text)
        
        try:
            result = self.sentiment_analyzer(text)
            label = result[0]['label'].lower()
            score = result[0]['score']
            
            # Map model labels to standard format
            if 'positive' in label or 'pos' in label:
                sentiment = "positive"
            elif 'negative' in label or 'neg' in label:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            return {
                "sentiment": sentiment,
                "confidence": round(score, 3),
                "raw_label": result[0]['label'],
                "raw_score": score
            }
        
        except Exception as e:
            print(f"Advanced sentiment analysis failed: {e}")
            return self.analyze_sentiment_basic(text)
    
    def detect_emotions(self, text: str) -> Dict:
        """Detect specific emotions in text."""
        emotions = {}
        
        if self.emotion_classifier:
            try:
                # Use transformer-based emotion classification
                result = self.emotion_classifier(text)
                primary_emotion = result[0]['label'].lower()
                confidence = result[0]['score']
                
                emotions = {
                    "primary_emotion": primary_emotion,
                    "confidence": round(confidence, 3),
                    "all_emotions": [{
                        "emotion": r['label'].lower(),
                        "score": round(r['score'], 3)
                    } for r in result]
                }
            
            except Exception as e:
                print(f"Transformer emotion detection failed: {e}")
        
        # Fallback to keyword-based emotion detection
        if not emotions:
            text_lower = text.lower()
            emotion_scores = {}
            
            for emotion, keywords in self.emotion_keywords.items():
                score = sum(1 for keyword in keywords if keyword in text_lower)
                if score > 0:
                    emotion_scores[emotion] = score
            
            if emotion_scores:
                primary_emotion = max(emotion_scores.items(), key=lambda x: x[1])[0]
                emotions = {
                    "primary_emotion": primary_emotion,
                    "confidence": min(emotion_scores[primary_emotion] / 10, 1.0),
                    "detected_emotions": emotion_scores
                }
            else:
                emotions = {
                    "primary_emotion": "neutral",
                    "confidence": 0.5,
                    "detected_emotions": {}
                }
        
        return emotions
    
    def analyze_mood_indicators(self, text: str) -> Dict:
        """Analyze various mood indicators in text."""
        text_lower = text.lower()
        
        # Check for stress indicators
        stress_count = sum(1 for keyword in self.stress_keywords if keyword in text_lower)
        stress_level = min(stress_count / 3, 1.0)  # Normalize to 0-1
        
        # Check for intensity words
        positive_intensity = sum(1 for keyword in self.positive_keywords if keyword in text_lower)
        negative_intensity = sum(1 for keyword in self.negative_keywords if keyword in text_lower)
        
        # Check for personal pronouns (indicates personal involvement)
        personal_pronouns = ['i', 'me', 'my', 'myself', 'mine']
        personal_involvement = sum(1 for pronoun in personal_pronouns if pronoun in text_lower.split())
        
        # Check for temporal indicators
        time_indicators = {
            'present': ['now', 'today', 'currently', 'right now'],
            'past': ['yesterday', 'last', 'ago', 'before', 'was', 'were'],
            'future': ['tomorrow', 'will', 'going to', 'next', 'soon']
        }
        
        temporal_focus = {}
        for time_type, indicators in time_indicators.items():
            count = sum(1 for indicator in indicators if indicator in text_lower)
            temporal_focus[time_type] = count
        
        dominant_time = max(temporal_focus.items(), key=lambda x: x[1])[0] if any(temporal_focus.values()) else 'present'
        
        return {
            "stress_level": round(stress_level, 3),
            "positive_intensity": positive_intensity,
            "negative_intensity": negative_intensity,
            "personal_involvement": personal_involvement,
            "temporal_focus": dominant_time,
            "temporal_distribution": temporal_focus
        }
    
    def comprehensive_mood_analysis(self, text: str) -> Dict:
        """Perform comprehensive mood analysis combining multiple approaches."""
        if not text or len(text.strip()) == 0:
            return {
                "overall_mood": "neutral",
                "confidence": 0.0,
                "mood_category": "unknown",
                "details": "No text provided for analysis."
            }
        
        # Preprocess text
        processed_text = self._preprocess_text(text)
        
        # Get sentiment analysis
        sentiment = self.analyze_sentiment_advanced(processed_text)
        
        # Get emotion detection
        emotions = self.detect_emotions(processed_text)
        
        # Get mood indicators
        indicators = self.analyze_mood_indicators(processed_text)
        
        # Determine overall mood
        overall_mood, mood_category = self._determine_overall_mood(sentiment, emotions, indicators)
        
        # Calculate confidence
        confidence = self._calculate_confidence(sentiment, emotions, indicators)
        
        # Generate mood description
        description = self._generate_mood_description(overall_mood, sentiment, emotions, indicators)
        
        return {
            "overall_mood": overall_mood,
            "mood_category": mood_category,
            "confidence": round(confidence, 3),
            "sentiment": sentiment,
            "emotions": emotions,
            "indicators": indicators,
            "description": description,
            "suggestions": self._get_mood_suggestions(overall_mood, indicators)
        }
    
    def _determine_overall_mood(self, sentiment: Dict, emotions: Dict, indicators: Dict) -> Tuple[str, str]:
        """Determine overall mood from analysis components."""
        sentiment_label = sentiment.get('sentiment', 'neutral')
        primary_emotion = emotions.get('primary_emotion', 'neutral')
        stress_level = indicators.get('stress_level', 0)
        
        # High stress overrides other indicators
        if stress_level > 0.6:
            return "stressed", "negative"
        
        # Map emotions to mood categories
        if primary_emotion in ['joy', 'trust', 'anticipation']:
            if sentiment_label == 'positive':
                return "very_positive", "positive"
            else:
                return "positive", "positive"
        elif primary_emotion in ['sadness', 'fear', 'disgust']:
            if sentiment_label == 'negative':
                return "very_negative", "negative"
            else:
                return "negative", "negative"
        elif primary_emotion == 'anger':
            return "angry", "negative"
        elif primary_emotion == 'surprise':
            if sentiment_label == 'positive':
                return "excited", "positive"
            else:
                return "surprised", "neutral"
        else:
            # Use sentiment as fallback
            if sentiment_label == 'positive':
                return "positive", "positive"
            elif sentiment_label == 'negative':
                return "negative", "negative"
            else:
                return "neutral", "neutral"
    
    def _calculate_confidence(self, sentiment: Dict, emotions: Dict, indicators: Dict) -> float:
        """Calculate overall confidence in mood analysis."""
        sentiment_conf = sentiment.get('confidence', 0)
        emotion_conf = emotions.get('confidence', 0)
        
        # Weight different components
        weighted_confidence = (
            sentiment_conf * 0.4 +
            emotion_conf * 0.4 +
            min(indicators.get('personal_involvement', 0) / 10, 1.0) * 0.2
        )
        
        return min(weighted_confidence, 1.0)
    
    def _generate_mood_description(self, mood: str, sentiment: Dict, emotions: Dict, indicators: Dict) -> str:
        """Generate a human-readable mood description."""
        descriptions = {
            "very_positive": "You seem to be in an excellent mood with high positivity and joy.",
            "positive": "You appear to be in a good mood with positive emotions.",
            "neutral": "Your mood appears to be balanced and neutral.",
            "negative": "You seem to be experiencing some negative emotions.",
            "very_negative": "You appear to be in a difficult emotional state with strong negative feelings.",
            "angry": "You seem to be feeling angry or frustrated about something.",
            "stressed": "You appear to be experiencing stress or feeling overwhelmed.",
            "excited": "You seem excited or pleasantly surprised about something.",
            "surprised": "You appear to be surprised or taken aback by something."
        }
        
        base_description = descriptions.get(mood, "Your emotional state is unclear from the text.")
        
        # Add stress indicator if relevant
        if indicators.get('stress_level', 0) > 0.4:
            base_description += " There are also signs of stress or pressure."
        
        return base_description
    
    def _get_mood_suggestions(self, mood: str, indicators: Dict) -> List[str]:
        """Get suggestions based on detected mood."""
        suggestions = {
            "very_positive": [
                "Keep up the positive energy!",
                "Share your joy with others.",
                "Use this positive momentum for your goals."
            ],
            "positive": [
                "You're doing well! Keep it up.",
                "Try to maintain this positive outlook.",
                "Consider sharing positivity with others."
            ],
            "neutral": [
                "Consider engaging in activities you enjoy.",
                "Reflect on things you're grateful for.",
                "Maybe try something new today."
            ],
            "negative": [
                "It's okay to feel this way sometimes.",
                "Consider talking to someone you trust.",
                "Try engaging in self-care activities."
            ],
            "very_negative": [
                "Remember that difficult times are temporary.",
                "Consider seeking support from friends or professionals.",
                "Focus on small, achievable goals."
            ],
            "angry": [
                "Take some deep breaths and try to relax.",
                "Consider physical exercise to release tension.",
                "Talk through your feelings with someone."
            ],
            "stressed": [
                "Try some relaxation techniques or meditation.",
                "Break down overwhelming tasks into smaller steps.",
                "Make sure to take breaks and rest."
            ],
            "excited": [
                "Channel this energy into productive activities!",
                "Share your excitement with others.",
                "Use this motivation to pursue your goals."
            ],
            "surprised": [
                "Take time to process what happened.",
                "Reflect on how this might affect your plans.",
                "Consider the positive aspects of unexpected events."
            ]
        }
        
        return suggestions.get(mood, ["Take care of yourself and stay positive."])

# Example usage
if __name__ == "__main__":
    detector = MoodDetector()
    
    sample_texts = [
        "I'm feeling absolutely fantastic today! Everything is going perfectly and I couldn't be happier!",
        "I had a really tough day at work. Everything went wrong and I feel completely overwhelmed.",
        "Just another ordinary day. Nothing special happened, feeling pretty neutral about everything.",
        "I'm so angry right now! This situation is completely unfair and I can't stand it anymore!",
        "I'm a bit worried about the presentation tomorrow. Hope everything goes well."
    ]
    
    for text in sample_texts:
        print(f"\nText: {text}")
        result = detector.comprehensive_mood_analysis(text)
        print(f"Mood: {result['overall_mood']} (confidence: {result['confidence']})")
        print(f"Description: {result['description']}")
        print(f"Suggestions: {result['suggestions'][:2]}")  # Show first 2 suggestions
        print("-" * 80)
