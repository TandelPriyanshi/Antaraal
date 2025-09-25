"""
NLP Text Analysis & Motivation System - Main Interface
Easy-to-use interface for all NLP functionality.
"""

import sys
import os
import argparse
import json
from typing import Dict, Any

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

try:
    from summarizer import TextSummarizer
    from mood_detector import MoodDetector
    from motivator import Motivator
except ImportError as e:
    print(f"❌ Error importing models: {e}")
    print("Please run 'python setup.py' first to set up the system.")
    sys.exit(1)

class NLPAnalyzer:
    """Main class for NLP text analysis and motivation."""
    
    def __init__(self):
        """Initialize all NLP components."""
        print("🔄 Initializing NLP components...")
        try:
            self.summarizer = TextSummarizer()
            self.mood_detector = MoodDetector()
            self.motivator = Motivator()
            print("✅ All components initialized successfully!")
        except Exception as e:
            print(f"❌ Error initializing components: {e}")
            raise
    
    def analyze_text(self, text: str, include_summary: bool = True, 
                    include_mood: bool = True, include_motivation: bool = True) -> Dict[str, Any]:
        """
        Perform comprehensive text analysis.
        
        Args:
            text (str): Text to analyze
            include_summary (bool): Include text summarization
            include_mood (bool): Include mood detection
            include_motivation (bool): Include motivational content
            
        Returns:
            Dict: Complete analysis results
        """
        results = {
            "original_text": text,
            "analysis_timestamp": self._get_timestamp()
        }
        
        # Text Summarization
        if include_summary:
            try:
                summary_result = self.summarizer.smart_summarize(text)
                key_phrases = self.summarizer.get_key_phrases(text, 5)
                
                results["summary"] = {
                    "text": summary_result["summary"],
                    "method": summary_result["method"],
                    "original_length": summary_result["original_length"],
                    "summary_length": summary_result["summary_length"],
                    "compression_ratio": summary_result["compression_ratio"],
                    "key_phrases": key_phrases
                }
            except Exception as e:
                results["summary"] = {"error": f"Summarization failed: {e}"}
        
        # Mood Detection
        if include_mood:
            try:
                mood_result = self.mood_detector.comprehensive_mood_analysis(text)
                
                results["mood"] = {
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
                results["mood"] = {"error": f"Mood detection failed: {e}"}
        
        # Motivational Content
        if include_motivation and "mood" in results and "error" not in results["mood"]:
            try:
                motivation_result = self.motivator.get_motivational_content(
                    results["mood"]["overall_mood"],
                    results["mood"]["mood_category"]
                )
                
                results["motivation"] = {
                    "quote": motivation_result["motivational_quote"],
                    "affirmations": motivation_result["affirmations"],
                    "coping_strategies": motivation_result["coping_strategies"],
                    "success_tip": motivation_result["success_tip"],
                    "encouragement": motivation_result["encouragement"],
                    "mood_addressed": motivation_result["mood_addressed"]
                }
            except Exception as e:
                results["motivation"] = {"error": f"Motivation generation failed: {e}"}
        
        return results
    
    def quick_analysis(self, text: str) -> str:
        """
        Perform a quick analysis and return a formatted summary.
        
        Args:
            text (str): Text to analyze
            
        Returns:
            str: Formatted analysis summary
        """
        try:
            results = self.analyze_text(text)
            
            output = []
            output.append("=" * 60)
            output.append("📊 QUICK NLP ANALYSIS")
            output.append("=" * 60)
            
            # Summary
            if "summary" in results and "error" not in results["summary"]:
                output.append(f"\n📝 SUMMARY:")
                output.append(f"   {results['summary']['text']}")
                output.append(f"   Method: {results['summary']['method']}")
                output.append(f"   Compression: {results['summary']['compression_ratio']}%")
                if results['summary']['key_phrases']:
                    output.append(f"   Key phrases: {', '.join(results['summary']['key_phrases'][:3])}")
            
            # Mood
            if "mood" in results and "error" not in results["mood"]:
                output.append(f"\n🎭 MOOD ANALYSIS:")
                output.append(f"   Mood: {results['mood']['overall_mood']} ({results['mood']['mood_category']})")
                output.append(f"   Confidence: {results['mood']['confidence']:.2f}")
                output.append(f"   {results['mood']['description']}")
                
                if results['mood']['suggestions']:
                    output.append(f"\n💡 SUGGESTIONS:")
                    for i, suggestion in enumerate(results['mood']['suggestions'][:2], 1):
                        output.append(f"   {i}. {suggestion}")
            
            # Motivation
            if "motivation" in results and "error" not in results["motivation"]:
                output.append(f"\n💪 MOTIVATION:")
                output.append(f"   Quote: {results['motivation']['quote']}")
                output.append(f"\n✨ ENCOURAGEMENT:")
                output.append(f"   {results['motivation']['encouragement'][:200]}...")
                
                if results['motivation']['coping_strategies']:
                    output.append(f"\n🛠️  COPING STRATEGY:")
                    output.append(f"   {results['motivation']['coping_strategies'][0]}")
            
            output.append("\n" + "=" * 60)
            
            return "\n".join(output)
            
        except Exception as e:
            return f"❌ Error during quick analysis: {e}"
    
    def get_daily_motivation(self) -> str:
        """Get daily motivational content."""
        try:
            daily = self.motivator.get_daily_motivation()
            
            output = []
            output.append("🌅 DAILY MOTIVATION")
            output.append("=" * 40)
            output.append(f"\n💫 Quote of the Day:")
            output.append(f"   {daily['daily_quote']}")
            output.append(f"\n✨ Daily Affirmation:")
            output.append(f"   {daily['daily_affirmation']}")
            output.append(f"\n🎯 Success Tip:")
            output.append(f"   {daily['success_tip']}")
            output.append("\n" + "=" * 40)
            
            return "\n".join(output)
            
        except Exception as e:
            return f"❌ Error getting daily motivation: {e}"
    
    def save_analysis(self, results: Dict[str, Any], filename: str = None) -> str:
        """
        Save analysis results to a JSON file.
        
        Args:
            results (Dict): Analysis results
            filename (str): Output filename (optional)
            
        Returns:
            str: Saved filename
        """
        if filename is None:
            timestamp = self._get_timestamp().replace(":", "-").replace(" ", "_")
            filename = f"nlp_analysis_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            
            return filename
            
        except Exception as e:
            raise Exception(f"Error saving analysis: {e}")
    
    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description="NLP Text Analysis & Motivation System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python nlp_analyzer.py "I'm feeling great today!"
  python nlp_analyzer.py --file input.txt --save output.json
  python nlp_analyzer.py --daily
  python nlp_analyzer.py "Stressed about work" --no-summary
        """
    )
    
    parser.add_argument("text", nargs="?", help="Text to analyze")
    parser.add_argument("--file", "-f", help="Input text file")
    parser.add_argument("--save", "-s", help="Save results to JSON file")
    parser.add_argument("--daily", "-d", action="store_true", help="Get daily motivation")
    parser.add_argument("--no-summary", action="store_true", help="Skip text summarization")
    parser.add_argument("--no-mood", action="store_true", help="Skip mood detection")
    parser.add_argument("--no-motivation", action="store_true", help="Skip motivation generation")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    
    args = parser.parse_args()
    
    # Handle daily motivation
    if args.daily:
        try:
            analyzer = NLPAnalyzer()
            print(analyzer.get_daily_motivation())
        except Exception as e:
            print(f"❌ Error: {e}")
        return
    
    # Get input text
    if args.file:
        try:
            with open(args.file, 'r', encoding='utf-8') as f:
                text = f.read().strip()
        except Exception as e:
            print(f"❌ Error reading file: {e}")
            return
    elif args.text:
        text = args.text
    else:
        # Interactive mode
        print("📝 Enter your text (press Enter twice to finish):")
        lines = []
        while True:
            line = input()
            if line == "" and lines:
                break
            lines.append(line)
        text = "\n".join(lines).strip()
    
    if not text:
        print("❌ No text provided for analysis.")
        return
    
    try:
        # Initialize analyzer
        analyzer = NLPAnalyzer()
        
        # Perform analysis
        results = analyzer.analyze_text(
            text,
            include_summary=not args.no_summary,
            include_mood=not args.no_mood,
            include_motivation=not args.no_motivation
        )
        
        # Output results
        if args.json:
            print(json.dumps(results, indent=2, ensure_ascii=False))
        else:
            print(analyzer.quick_analysis(text))
        
        # Save results if requested
        if args.save:
            saved_file = analyzer.save_analysis(results, args.save)
            print(f"\n💾 Results saved to: {saved_file}")
    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
