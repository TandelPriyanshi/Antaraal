"""
Test Examples for NLP Text Analysis & Motivation System
Demonstrates how to use each component individually and together.
"""

import sys
import os
import requests
import json
import time

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

from summarizer import TextSummarizer
from mood_detector import MoodDetector
from motivator import Motivator

def test_individual_components():
    """Test each NLP component individually."""
    
    print("=" * 60)
    print("TESTING INDIVIDUAL COMPONENTS")
    print("=" * 60)
    
    # Test data
    sample_texts = [
        {
            "title": "Positive Experience",
            "text": "Today was absolutely amazing! I got promoted at work after months of hard work, and my colleagues threw a surprise celebration for me. I felt so appreciated and valued. The promotion comes with new responsibilities that I'm excited to take on. I can't wait to see what new challenges and opportunities this brings. I'm feeling incredibly grateful for all the support from my team and family."
        },
        {
            "title": "Stressful Situation", 
            "text": "I'm feeling completely overwhelmed right now. There's so much work piling up on my desk, and the deadlines keep getting tighter. I barely have time to eat lunch, let alone take a proper break. My boss keeps adding more tasks to my list, and I'm starting to feel like I can't keep up. I'm stressed about disappointing everyone and worried that I might not be able to handle all these responsibilities."
        },
        {
            "title": "Neutral Daily Update",
            "text": "Had a pretty ordinary day today. Woke up around 7 AM, had breakfast, and went to work. The commute was the usual 30 minutes. At work, I attended a couple of meetings and worked on some reports. Lunch was decent - had a sandwich from the cafeteria. The afternoon was spent reviewing some documents and responding to emails. Left work at 5 PM and came home to watch some TV before dinner."
        },
        {
            "title": "Difficult Emotional State",
            "text": "I've been feeling really down lately. Everything seems to be going wrong, and I can't seem to catch a break. Lost my job last month, and job hunting has been brutal with constant rejections. I feel like I'm not good enough and that I'll never find something better. My savings are running low, and I'm starting to worry about paying rent next month. I feel isolated and like I'm failing at life."
        }
    ]
    
    # Initialize components
    print("Initializing components...")
    summarizer = TextSummarizer()
    mood_detector = MoodDetector()
    motivator = Motivator()
    print("Components initialized successfully!\n")
    
    for i, sample in enumerate(sample_texts, 1):
        print(f"\n--- SAMPLE {i}: {sample['title']} ---")
        text = sample['text']
        
        # 1. Test Summarization
        print("\n📝 SUMMARIZATION:")
        try:
            summary_result = summarizer.smart_summarize(text)
            key_phrases = summarizer.get_key_phrases(text, 3)
            
            print(f"Original length: {summary_result['original_length']} words")
            print(f"Summary ({summary_result['method']}): {summary_result['summary']}")
            print(f"Compression: {summary_result['compression_ratio']}%")
            print(f"Key phrases: {', '.join(key_phrases)}")
            
        except Exception as e:
            print(f"Summarization error: {e}")
        
        # 2. Test Mood Detection
        print("\n🎭 MOOD DETECTION:")
        try:
            mood_result = mood_detector.comprehensive_mood_analysis(text)
            
            print(f"Overall mood: {mood_result['overall_mood']} ({mood_result['mood_category']})")
            print(f"Confidence: {mood_result['confidence']:.2f}")
            print(f"Description: {mood_result['description']}")
            print(f"Primary emotion: {mood_result['emotions'].get('primary_emotion', 'N/A')}")
            print(f"Sentiment: {mood_result['sentiment'].get('sentiment', 'N/A')} " +
                  f"({mood_result['sentiment'].get('confidence', 0):.2f})")
            
        except Exception as e:
            print(f"Mood detection error: {e}")
            mood_result = {"overall_mood": "neutral", "mood_category": "neutral"}
        
        # 3. Test Motivational Content
        print("\n💪 MOTIVATIONAL CONTENT:")
        try:
            motivation_result = motivator.get_motivational_content(
                mood_result['overall_mood'], 
                mood_result.get('mood_category')
            )
            
            print(f"Quote: {motivation_result['motivational_quote']}")
            print(f"Affirmation: {motivation_result['affirmations'][0] if motivation_result['affirmations'] else 'N/A'}")
            print(f"Coping strategy: {motivation_result['coping_strategies'][0] if motivation_result['coping_strategies'] else 'N/A'}")
            print(f"Personal encouragement: {motivation_result['encouragement'][:100]}...")
            
        except Exception as e:
            print(f"Motivation generation error: {e}")
        
        print("\n" + "-" * 80)

def test_api_endpoints():
    """Test the API endpoints (requires server to be running)."""
    
    print("\n" + "=" * 60)
    print("TESTING API ENDPOINTS")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    # Check if API is running
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code != 200:
            print("❌ API is not running. Start the server with: python api/main.py")
            return
    except requests.exceptions.RequestException:
        print("❌ API is not accessible. Make sure the server is running on localhost:8000")
        print("   Start the server with: python api/main.py")
        return
    
    print("✅ API is running and accessible\n")
    
    # Test data
    test_text = "I'm feeling really excited about this new project I'm working on! It's challenging but in a good way, and I can't wait to see the results. However, I'm also a bit nervous about whether I'll be able to deliver on time."
    
    # Test comprehensive analysis
    print("🔍 TESTING COMPREHENSIVE ANALYSIS:")
    try:
        payload = {
            "text": test_text,
            "include_summary": True,
            "include_mood": True,
            "include_motivation": True,
            "summary_type": "auto"
        }
        
        start_time = time.time()
        response = requests.post(f"{base_url}/analyze", json=payload)
        end_time = time.time()
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"✅ Analysis completed in {end_time - start_time:.2f} seconds")
            print(f"Processing time (server): {result.get('processing_time', 'N/A')} seconds")
            
            if result.get('summary'):
                print(f"\n📝 Summary: {result['summary']['summary']}")
                print(f"   Method: {result['summary']['method']}")
                print(f"   Key phrases: {', '.join(result['summary']['key_phrases'][:3])}")
            
            if result.get('mood'):
                print(f"\n🎭 Mood: {result['mood']['overall_mood']}")
                print(f"   Confidence: {result['mood']['confidence']:.2f}")
                print(f"   Description: {result['mood']['description']}")
            
            if result.get('motivation'):
                print(f"\n💪 Motivation: {result['motivation']['motivational_quote']}")
                print(f"   Encouragement: {result['motivation']['encouragement'][:100]}...")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")
    
    # Test individual endpoints
    print("\n📝 TESTING SUMMARIZATION ENDPOINT:")
    try:
        payload = {"text": test_text, "summary_type": "auto"}
        response = requests.post(f"{base_url}/summarize", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Summary: {result['summary']}")
            print(f"   Compression: {result['compression_ratio']}%")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")
    
    print("\n🎭 TESTING MOOD DETECTION ENDPOINT:")
    try:
        payload = {"text": test_text}
        response = requests.post(f"{base_url}/mood", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Mood: {result['overall_mood']} (confidence: {result['confidence']:.2f})")
            print(f"   Suggestions: {', '.join(result['suggestions'][:2])}")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")
    
    print("\n🌅 TESTING DAILY MOTIVATION ENDPOINT:")
    try:
        response = requests.get(f"{base_url}/daily-motivation")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Daily quote: {result['daily_quote']}")
            print(f"   Affirmation: {result['daily_affirmation']}")
            print(f"   Success tip: {result['success_tip']}")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

def performance_test():
    """Test the performance of the system with various text lengths."""
    
    print("\n" + "=" * 60)
    print("PERFORMANCE TESTING")
    print("=" * 60)
    
    # Initialize components
    summarizer = TextSummarizer()
    mood_detector = MoodDetector()
    motivator = Motivator()
    
    test_texts = [
        {
            "name": "Short text (10 words)",
            "text": "I'm feeling great today and very excited about new opportunities!"
        },
        {
            "name": "Medium text (50 words)", 
            "text": "Today was a really challenging day at work. I had to deal with multiple difficult clients and a system outage that lasted for hours. My team worked hard to resolve the issues, but I felt stressed throughout the process. However, we managed to fix everything by the end of the day and I feel accomplished."
        },
        {
            "name": "Long text (200+ words)",
            "text": """
            The concept of artificial intelligence has fascinated humanity for decades, evolving from science fiction 
            fantasies to practical applications that now permeate our daily lives. From the early dreams of creating 
            machines that could think and reason like humans, we have progressed to developing sophisticated algorithms 
            that can process vast amounts of data, recognize patterns, and make decisions with remarkable accuracy.
            
            Today's AI systems excel in numerous domains, from natural language processing and computer vision to 
            autonomous vehicles and medical diagnosis. Machine learning techniques, particularly deep learning, have 
            revolutionized how we approach complex problems that were previously thought to be exclusively human 
            territories. These systems can now understand speech, translate languages, generate creative content, 
            and even compose music or create art.
            
            However, this rapid advancement also brings significant challenges and ethical considerations. Questions 
            about job displacement, privacy, algorithmic bias, and the long-term implications of artificial general 
            intelligence continue to spark debates among researchers, policymakers, and society at large. As we 
            stand on the brink of even more transformative AI developments, it becomes crucial to ensure that these 
            technologies are developed and deployed responsibly, with human welfare and societal benefit as primary 
            considerations.
            """
        }
    ]
    
    for test in test_texts:
        print(f"\n--- {test['name']} ---")
        text = test['text'].strip()
        
        # Summarization performance
        start_time = time.time()
        summary = summarizer.smart_summarize(text)
        summarization_time = time.time() - start_time
        
        # Mood detection performance
        start_time = time.time()
        mood = mood_detector.comprehensive_mood_analysis(text)
        mood_time = time.time() - start_time
        
        # Motivation generation performance
        start_time = time.time()
        motivation = motivator.get_motivational_content(mood['overall_mood'])
        motivation_time = time.time() - start_time
        
        print(f"📝 Summarization: {summarization_time:.3f}s ({len(text.split())} → {summary['summary_length']} words)")
        print(f"🎭 Mood detection: {mood_time:.3f}s (confidence: {mood['confidence']:.2f})")
        print(f"💪 Motivation: {motivation_time:.3f}s")
        print(f"⏱️  Total time: {summarization_time + mood_time + motivation_time:.3f}s")

def demo_use_cases():
    """Demonstrate practical use cases for the NLP system."""
    
    print("\n" + "=" * 60)
    print("PRACTICAL USE CASE DEMONSTRATIONS")
    print("=" * 60)
    
    use_cases = [
        {
            "title": "📧 Email Analysis",
            "description": "Analyzing customer feedback emails",
            "text": "Hi team, I wanted to share some feedback about our recent product update. While I appreciate the new features, I've been experiencing some frustrating bugs that are affecting my daily workflow. The app crashes randomly, and sometimes my data doesn't save properly. I'm feeling quite disappointed because I was really excited about this update. Could you please look into these issues? I'd love to continue using your product, but these problems are making it difficult."
        },
        {
            "title": "📝 Journal Entry Analysis", 
            "description": "Personal journal entry for mood tracking",
            "text": "What an incredible day! Started with my morning run in the park - the weather was perfect and I felt so energized. Had a breakthrough at work on the project I've been struggling with for weeks. My team was so supportive and we celebrated with lunch together. Then got a call from my sister who's finally doing better after her surgery. Feeling grateful for all the positive things happening in my life right now."
        },
        {
            "title": "🎓 Student Stress Assessment",
            "description": "University student expressing academic concerns", 
            "text": "Finals week is approaching and I'm completely overwhelmed. I have four exams scheduled within three days, two major papers due, and I'm behind on my research project. I've been staying up late trying to catch up but I'm exhausted and can't concentrate properly. My parents keep asking about my grades and adding more pressure. I'm starting to doubt if I'm smart enough for this program and wondering if I made the right choice with my major."
        },
        {
            "title": "💼 Work Performance Review",
            "description": "Employee self-assessment for performance review",
            "text": "This quarter has been a mix of challenges and achievements. I successfully led the client presentation that secured our biggest deal this year, which I'm really proud of. However, I struggled with time management on the Peterson project and missed a deadline, which was disappointing. I've been working on improving my organizational skills and have started using project management tools. Overall, I feel like I'm growing professionally, but there's still room for improvement in balancing multiple priorities."
        }
    ]
    
    # Initialize components
    summarizer = TextSummarizer()
    mood_detector = MoodDetector()
    motivator = Motivator()
    
    for use_case in use_cases:
        print(f"\n{use_case['title']}")
        print(f"Scenario: {use_case['description']}")
        print(f"Text: {use_case['text'][:100]}...")
        print("\nAnalysis Results:")
        
        # Get summary
        summary = summarizer.smart_summarize(use_case['text'])
        print(f"📋 Key Points: {summary['summary']}")
        
        # Get mood analysis
        mood = mood_detector.comprehensive_mood_analysis(use_case['text'])
        print(f"😊 Emotional State: {mood['overall_mood']} (confidence: {mood['confidence']:.2f})")
        print(f"📊 Sentiment: {mood['sentiment'].get('sentiment', 'N/A')}")
        
        # Get personalized motivation
        motivation = motivator.get_motivational_content(mood['overall_mood'])
        print(f"💡 Recommendation: {motivation['coping_strategies'][0] if motivation['coping_strategies'] else 'Stay positive!'}")
        print(f"✨ Encouragement: {motivation['encouragement'][:150]}...")
        
        print("\n" + "-" * 80)

if __name__ == "__main__":
    print("🚀 Starting NLP Text Analysis & Motivation System Tests")
    print("This will test all components and demonstrate various use cases.\n")
    
    try:
        # Test individual components
        test_individual_components()
        
        # Test API endpoints (if server is running)
        test_api_endpoints()
        
        # Performance testing
        performance_test()
        
        # Practical use case demonstrations
        demo_use_cases()
        
        print("\n🎉 All tests completed successfully!")
        print("\nTo start the API server, run: python api/main.py")
        print("Then visit: http://localhost:8000/docs for interactive API documentation")
        
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
