"""
Text Summarization Model
Provides extractive and abstractive summarization capabilities.
"""

import re
from typing import Dict, List, Optional
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

class TextSummarizer:
    def __init__(self):
        """Initialize the summarizer with pre-trained models."""
        self.abstractive_model = None
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self._download_nltk_data()
        self._initialize_models()
    
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
        """Initialize the pre-trained summarization models."""
        try:
            # Use a lightweight model for better performance
            self.abstractive_model = pipeline(
                "summarization", 
                model="facebook/bart-large-cnn",
                tokenizer="facebook/bart-large-cnn"
            )
        except Exception as e:
            print(f"Warning: Could not load BART model: {e}")
            # Fallback to a smaller model
            try:
                self.abstractive_model = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
            except Exception as e2:
                print(f"Warning: Could not load fallback model: {e2}")
                self.abstractive_model = None
    
    def extractive_summarize(self, text: str, num_sentences: int = 3) -> str:
        """
        Create extractive summary by selecting top sentences based on TF-IDF scores.
        
        Args:
            text (str): Input text to summarize
            num_sentences (int): Number of sentences in summary
            
        Returns:
            str: Extractive summary
        """
        if not text or len(text.strip()) == 0:
            return "No content to summarize."
        
        # Clean and tokenize text
        sentences = sent_tokenize(text)
        
        if len(sentences) <= num_sentences:
            return text
        
        # Calculate TF-IDF scores for sentences
        try:
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(sentences)
            sentence_scores = np.array(tfidf_matrix.sum(axis=1)).flatten()
            
            # Get top sentences
            top_indices = sentence_scores.argsort()[-num_sentences:][::-1]
            top_indices.sort()  # Maintain original order
            
            summary_sentences = [sentences[i] for i in top_indices]
            return ' '.join(summary_sentences)
            
        except Exception as e:
            # Fallback to first few sentences if TF-IDF fails
            return ' '.join(sentences[:num_sentences])
    
    def abstractive_summarize(self, text: str, max_length: int = 150, min_length: int = 30) -> str:
        """
        Create abstractive summary using transformer model.
        
        Args:
            text (str): Input text to summarize
            max_length (int): Maximum length of summary
            min_length (int): Minimum length of summary
            
        Returns:
            str: Abstractive summary
        """
        if not self.abstractive_model:
            return self.extractive_summarize(text)
        
        if not text or len(text.strip()) == 0:
            return "No content to summarize."
        
        try:
            # Truncate text if too long for model
            max_input_length = 1024
            if len(text.split()) > max_input_length:
                words = text.split()
                text = ' '.join(words[:max_input_length])
            
            # Generate summary
            summary = self.abstractive_model(
                text, 
                max_length=max_length, 
                min_length=min_length,
                do_sample=False
            )
            
            return summary[0]['summary_text']
            
        except Exception as e:
            print(f"Abstractive summarization failed: {e}")
            # Fallback to extractive summarization
            return self.extractive_summarize(text)
    
    def smart_summarize(self, text: str, summary_type: str = "auto") -> Dict:
        """
        Intelligent summarization that chooses the best method based on text characteristics.
        
        Args:
            text (str): Input text to summarize
            summary_type (str): Type of summary ("extractive", "abstractive", "auto")
            
        Returns:
            Dict: Summary results with metadata
        """
        if not text or len(text.strip()) == 0:
            return {
                "summary": "No content to summarize.",
                "method": "none",
                "original_length": 0,
                "summary_length": 0,
                "compression_ratio": 0
            }
        
        original_length = len(text.split())
        
        # Choose summarization method
        if summary_type == "auto":
            # Use abstractive for longer texts, extractive for shorter ones
            if original_length > 200 and self.abstractive_model:
                method = "abstractive"
                summary = self.abstractive_summarize(text)
            else:
                method = "extractive"
                summary = self.extractive_summarize(text)
        elif summary_type == "abstractive":
            method = "abstractive"
            summary = self.abstractive_summarize(text)
        else:
            method = "extractive"
            summary = self.extractive_summarize(text)
        
        summary_length = len(summary.split())
        compression_ratio = round((1 - summary_length / original_length) * 100, 2) if original_length > 0 else 0
        
        return {
            "summary": summary,
            "method": method,
            "original_length": original_length,
            "summary_length": summary_length,
            "compression_ratio": compression_ratio
        }
    
    def get_key_phrases(self, text: str, num_phrases: int = 5) -> List[str]:
        """
        Extract key phrases from text.
        
        Args:
            text (str): Input text
            num_phrases (int): Number of key phrases to extract
            
        Returns:
            List[str]: List of key phrases
        """
        if not text:
            return []
        
        try:
            # Simple key phrase extraction using TF-IDF
            sentences = sent_tokenize(text)
            if not sentences:
                return []
            
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(sentences)
            feature_names = self.tfidf_vectorizer.get_feature_names_out()
            
            # Get average TF-IDF scores for each word
            mean_scores = np.array(tfidf_matrix.mean(axis=0)).flatten()
            
            # Get top scoring words
            top_indices = mean_scores.argsort()[-num_phrases * 2:][::-1]
            key_words = [feature_names[i] for i in top_indices]
            
            # Filter out single characters and very short words
            key_phrases = [word for word in key_words if len(word) > 2][:num_phrases]
            
            return key_phrases
            
        except Exception as e:
            print(f"Key phrase extraction failed: {e}")
            return []

# Example usage
if __name__ == "__main__":
    summarizer = TextSummarizer()
    
    sample_text = """
    Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural 
    intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of 
    "intelligent agents": any device that perceives its environment and takes actions that maximize its 
    chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often 
    used to describe machines that mimic "cognitive" functions that humans associate with the human mind, 
    such as "learning" and "problem solving". As machines become increasingly capable, tasks considered 
    to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI 
    effect. A quip in Tesler's Theorem says "AI is whatever hasn't been done yet." For instance, optical 
    character recognition is frequently excluded from things considered to be AI, having become a routine 
    technology. Modern machine learning techniques are a core part of AI. Machine learning algorithms 
    build a model based on training data in order to make predictions or decisions without being 
    explicitly programmed to do so.
    """
    
    result = summarizer.smart_summarize(sample_text)
    print("Summary:", result["summary"])
    print("Method:", result["method"])
    print("Compression:", result["compression_ratio"], "%")
    
    key_phrases = summarizer.get_key_phrases(sample_text)
    print("Key phrases:", key_phrases)
