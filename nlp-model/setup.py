"""
Setup Script for NLP Text Analysis & Motivation System
Downloads required models and initializes the system.
"""

import os
import sys
import subprocess
import nltk
import warnings
warnings.filterwarnings("ignore")

def install_requirements():
    """Install required Python packages."""
    print("📦 Installing required packages...")
    
    try:
        # Check if requirements.txt exists
        if not os.path.exists("requirements.txt"):
            print("❌ requirements.txt not found!")
            return False
        
        # Install packages
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Packages installed successfully!")
            return True
        else:
            print(f"❌ Error installing packages: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error during package installation: {e}")
        return False

def download_nltk_data():
    """Download required NLTK data."""
    print("📚 Downloading NLTK data...")
    
    try:
        # Download required NLTK packages
        nltk_packages = [
            'punkt',
            'stopwords',
            'vader_lexicon',
            'wordnet',
            'averaged_perceptron_tagger'
        ]
        
        for package in nltk_packages:
            try:
                print(f"   Downloading {package}...")
                nltk.download(package, quiet=True)
            except Exception as e:
                print(f"   ⚠️  Warning: Could not download {package}: {e}")
        
        print("✅ NLTK data downloaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading NLTK data: {e}")
        return False

def test_model_loading():
    """Test if models can be loaded successfully."""
    print("🧪 Testing model loading...")
    
    try:
        sys.path.append('models')
        
        # Test TextSummarizer
        print("   Testing TextSummarizer...")
        from models.summarizer import TextSummarizer
        summarizer = TextSummarizer()
        test_result = summarizer.extractive_summarize("This is a test sentence for the summarizer.")
        print(f"   ✅ TextSummarizer: {test_result[:50]}...")
        
        # Test MoodDetector
        print("   Testing MoodDetector...")
        from models.mood_detector import MoodDetector
        mood_detector = MoodDetector()
        mood_result = mood_detector.analyze_sentiment_basic("I am feeling great today!")
        print(f"   ✅ MoodDetector: {mood_result['sentiment']} sentiment")
        
        # Test Motivator
        print("   Testing Motivator...")
        from models.motivator import Motivator
        motivator = Motivator()
        motivation = motivator.get_daily_motivation()
        print(f"   ✅ Motivator: {motivation['daily_quote'][:50]}...")
        
        print("✅ All models loaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during model testing: {e}")
        print(f"   This is likely due to missing transformer models.")
        print(f"   The system will work with fallback models.")
        return False

def create_sample_files():
    """Create sample usage files."""
    print("📝 Creating sample files...")
    
    try:
        # Create simple usage example
        sample_usage = '''"""
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
    
    print("\\nAnalyzing text...")
    print("Original text:", text.strip()[:100] + "...")
    
    # Get summary
    summary = summarizer.smart_summarize(text)
    print(f"\\n📝 Summary: {summary['summary']}")
    
    # Get mood analysis
    mood = mood_detector.comprehensive_mood_analysis(text)
    print(f"🎭 Mood: {mood['overall_mood']} (confidence: {mood['confidence']:.2f})")
    print(f"💭 Description: {mood['description']}")
    
    # Get motivation
    motivation = motivator.get_motivational_content(mood['overall_mood'])
    print(f"\\n💪 Motivational Quote: {motivation['motivational_quote']}")
    print(f"✨ Encouragement: {motivation['encouragement'][:200]}...")
    print(f"💡 Coping Strategy: {motivation['coping_strategies'][0] if motivation['coping_strategies'] else 'Stay positive!'}")
    
    print("\\n🎉 Analysis complete!")

if __name__ == "__main__":
    main()
'''
        
        with open("example_usage.py", "w", encoding="utf-8") as f:
            f.write(sample_usage)
        
        print("✅ Sample files created!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample files: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Setting up NLP Text Analysis & Motivation System")
    print("=" * 60)
    
    success_count = 0
    total_steps = 4
    
    # Step 1: Install requirements
    if install_requirements():
        success_count += 1
    
    # Step 2: Download NLTK data
    if download_nltk_data():
        success_count += 1
    
    # Step 3: Test model loading
    if test_model_loading():
        success_count += 1
    
    # Step 4: Create sample files
    if create_sample_files():
        success_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("SETUP SUMMARY")
    print("=" * 60)
    print(f"✅ Completed {success_count}/{total_steps} setup steps")
    
    if success_count == total_steps:
        print("\n🎉 Setup completed successfully!")
        print("\n📋 Next Steps:")
        print("1. Run the test examples: python tests/test_examples.py")
        print("2. Start the API server: python api/main.py")
        print("3. Try the sample usage: python example_usage.py")
        print("4. Visit API docs: http://localhost:8000/docs")
        
    elif success_count >= 2:
        print("\n⚠️  Setup partially completed. The system should work with basic functionality.")
        print("   Some advanced features may not be available due to model loading issues.")
        print("\n📋 You can still:")
        print("1. Run basic tests: python tests/test_examples.py")
        print("2. Start the API server: python api/main.py")
        
    else:
        print("\n❌ Setup failed. Please check the errors above and try again.")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure you have Python 3.8+ installed")
        print("2. Check your internet connection for downloading models")
        print("3. Try running: pip install --upgrade pip")
        print("4. Install packages manually: pip install transformers torch nltk textblob scikit-learn")
    
    print("\n📚 For more information, check README.md")

if __name__ == "__main__":
    main()
