"""
Simple usage example for NLP Text Analysis & Motivation System
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

from summarizer import TextSummarizer
from mood_detector import MoodDetector
from motivator import Motivator

def main():
    # Initialize components
    print("Initializing NLP components...")
    summarizer = TextSummarizer()
    mood_detector = MoodDetector()
    motivator = Motivator()
    
    # Sample text
    text = """
    I had a really challenging day at work today. The presentation I've been preparing 
    for weeks didn't go as well as I hoped, and I received some tough feedback from 
    my manager. I'm feeling a bit discouraged and wondering if I'm on the right track 
    with my career. However, I know that setbacks are part of growth, and I'm 
    determined to learn from this experience and come back stronger.
    """
    
    print("\nAnalyzing text...")
    print("Original text:", text.strip()[:100] + "...")
    
    # Get summary
    summary = summarizer.smart_summarize(text)
    print(f"\n📝 Summary: {summary['summary']}")
    
    # Get mood analysis
    mood = mood_detector.comprehensive_mood_analysis(text)
    print(f"🎭 Mood: {mood['overall_mood']} (confidence: {mood['confidence']:.2f})")
    print(f"💭 Description: {mood['description']}")
    
    # Get motivation
    motivation = motivator.get_motivational_content(mood['overall_mood'])
    print(f"\n💪 Motivational Quote: {motivation['motivational_quote']}")
    print(f"✨ Encouragement: {motivation['encouragement'][:200]}...")
    print(f"💡 Coping Strategy: {motivation['coping_strategies'][0] if motivation['coping_strategies'] else 'Stay positive!'}")
    
    print("\n🎉 Analysis complete!")

if __name__ == "__main__":
    main()
