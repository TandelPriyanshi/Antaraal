"""
Motivational Quote Generator
Provides personalized motivational content based on mood analysis.
"""

import random
from typing import Dict, List
import json

class Motivator:
    def __init__(self):
        """Initialize the motivator with categorized motivational content."""
        self.motivational_quotes = self._load_motivational_quotes()
        self.affirmations = self._load_affirmations()
        self.coping_strategies = self._load_coping_strategies()
        self.success_tips = self._load_success_tips()
    
    def _load_motivational_quotes(self) -> Dict[str, List[str]]:
        """Load motivational quotes categorized by mood."""
        return {
            "very_negative": [
                "Every storm runs out of rain. This difficult time will pass.",
                "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
                "The darkest nights produce the brightest stars.",
                "You have been assigned this mountain to show others it can be moved.",
                "It's okay to not be okay. Healing isn't linear, and that's perfectly normal.",
                "Sometimes you need to sit lonely on the floor in a quiet room in order to hear your own voice.",
                "The only way out is through. Keep going.",
                "Your current situation is not your final destination.",
                "Even the darkest night will end and the sun will rise. - Victor Hugo",
                "You are stronger than whatever tried to hurt you."
            ],
            "negative": [
                "Difficult roads often lead to beautiful destinations.",
                "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or frustrated.",
                "Every setback is a setup for a comeback.",
                "You're allowed to feel stuck. Just don't give up.",
                "Tomorrow is the first day of the rest of your life.",
                "The comeback is always stronger than the setback.",
                "You are enough, even when you don't feel like it.",
                "This too shall pass. Everything is temporary.",
                "Be patient with yourself. Self-growth is tender; it's holy ground.",
                "You've survived 100% of your worst days. You're doing great."
            ],
            "stressed": [
                "Breathe. You've got this. One step at a time.",
                "Stress is caused by being 'here' but wanting to be 'there'. - Eckhart Tolle",
                "You don't have to see the whole staircase, just take the first step. - Martin Luther King Jr.",
                "The greatest weapon against stress is our ability to choose one thought over another. - William James",
                "Take it one day at a time. You don't have to figure it all out today.",
                "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.",
                "You are not behind in life. There's no schedule you should be following.",
                "Sometimes the most productive thing you can do is relax.",
                "Slow down and remember this: Most things make no difference. Being busy is a form of mental laziness. - Tim Ferriss",
                "Progress, not perfection, is what we should strive for."
            ],
            "angry": [
                "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured. - Mark Twain",
                "The best fighter is never angry. - Lao Tzu",
                "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson",
                "Don't let yesterday take up too much of today. - Will Rogers",
                "Holding onto anger is like grasping onto a hot coal with the intent of throwing it at someone else; you are the one who gets burned. - Buddha",
                "Take a deep breath and count to ten. Your peace of mind is worth more than any argument.",
                "Channel your anger into action that creates positive change.",
                "Your anger is valid, but how you express it matters.",
                "Sometimes walking away is the strongest thing you can do.",
                "Turn your wounds into wisdom and your anger into action."
            ],
            "neutral": [
                "Every day is a new beginning. Take a deep breath, smile, and start again.",
                "The secret of getting ahead is getting started. - Mark Twain",
                "You are exactly where you need to be. Trust the process.",
                "Small steps in the right direction can turn out to be the biggest step of your life.",
                "The best time to plant a tree was 20 years ago. The second best time is now.",
                "Today is a blank canvas. Paint something beautiful.",
                "Opportunities don't happen. You create them.",
                "Don't wait for inspiration. Be the inspiration.",
                "The only impossible journey is the one you never begin.",
                "Your potential is endless. Go do what you were created to do."
            ],
            "positive": [
                "Keep shining! Your positive energy is contagious.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
                "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
                "Believe you can and you're halfway there. - Theodore Roosevelt",
                "Your positive attitude and hard work are inspiring. Keep it up!",
                "Great things happen to those who don't stop believing, trying, working, and hoping.",
                "You're on the right track. Keep moving forward with confidence.",
                "Your enthusiasm is your greatest asset. Use it to achieve great things.",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                "You are capable of amazing things. Keep pushing forward!"
            ],
            "very_positive": [
                "You're radiating positive energy! Use this momentum to achieve your wildest dreams!",
                "Your joy is infectious! Spread it wherever you go!",
                "This is your time to shine! Make the most of this incredible energy!",
                "You're unstoppable when you're in this mindset. Aim for the stars!",
                "Your happiness is a gift to the world. Keep sharing it!",
                "Life is amazing when you have this kind of positive outlook. Embrace it!",
                "You have the power to make today absolutely incredible!",
                "Your positive mindset is your superpower. Use it to lift others too!",
                "This energy you have is pure magic. Channel it into your goals!",
                "You're living proof that positivity creates miracles. Keep being amazing!"
            ],
            "excited": [
                "Your excitement is your fuel for success. Use it wisely!",
                "Channel this energy into making your dreams a reality!",
                "Excitement is the electricity that lights up the path to achievement!",
                "Your enthusiasm is the key to unlocking unlimited possibilities!",
                "This excitement you feel is the universe saying 'GO FOR IT!'",
                "Use this burst of energy to take the first step toward something amazing!",
                "Your excitement is a sign that you're on the right path. Trust it!",
                "Great things are coming your way. This excitement is just the beginning!",
                "When you're excited, you're unstoppable. Make things happen!",
                "This feeling of excitement is your inner compass pointing toward success!"
            ],
            "surprised": [
                "Life's surprises often lead to the most beautiful adventures.",
                "Embrace the unexpected. It might be exactly what you needed.",
                "Sometimes the best things happen when we least expect them.",
                "Surprises are life's way of keeping things interesting. Roll with it!",
                "The unexpected can be the doorway to new opportunities.",
                "Stay open to surprises. They often bring gifts in disguise.",
                "Life has a funny way of working out exactly as it should.",
                "What surprises us today might be what we're grateful for tomorrow.",
                "Unexpected moments often become our most treasured memories.",
                "Trust that even surprises are part of your perfect journey."
            ]
        }
    
    def _load_affirmations(self) -> Dict[str, List[str]]:
        """Load positive affirmations for different moods."""
        return {
            "very_negative": [
                "I am worthy of love and kindness, especially from myself.",
                "This feeling is temporary, and I will get through this.",
                "I have overcome challenges before, and I can do it again.",
                "I am stronger than I know and braver than I feel.",
                "I choose to be gentle with myself today.",
                "I am healing at my own pace, and that's okay.",
                "My feelings are valid, and I honor them.",
                "I am not alone in this struggle.",
                "I trust in my ability to navigate difficult times.",
                "I am growing through what I'm going through."
            ],
            "negative": [
                "I acknowledge my feelings without letting them control me.",
                "Every day, I am getting stronger and more resilient.",
                "I have the power to create positive change in my life.",
                "I am worthy of happiness and peace.",
                "I choose to focus on what I can control.",
                "I am learning valuable lessons from this experience.",
                "I trust that better days are coming.",
                "I am enough, just as I am.",
                "I give myself permission to feel and heal.",
                "I am capable of finding solutions to my problems."
            ],
            "stressed": [
                "I breathe deeply and release all tension from my body.",
                "I have everything I need to handle this situation.",
                "I choose calm over chaos.",
                "I am in control of my reactions and responses.",
                "I trust in my ability to manage stress effectively.",
                "I give myself permission to take breaks when needed.",
                "I focus on one task at a time.",
                "I am organized, prepared, and capable.",
                "I deserve rest and relaxation.",
                "I handle pressure with grace and composure."
            ],
            "angry": [
                "I acknowledge my anger and choose to respond with wisdom.",
                "I have the power to control my reactions.",
                "I choose peace over conflict.",
                "I release anger and embrace understanding.",
                "I am patient with myself and others.",
                "I use my strong feelings as motivation for positive action.",
                "I communicate my needs clearly and calmly.",
                "I forgive others and myself for past mistakes.",
                "I choose to see the lesson in this situation.",
                "I am in control of my emotions, not the other way around."
            ],
            "neutral": [
                "I am open to the possibilities this day brings.",
                "I trust in the timing of my life.",
                "I am exactly where I need to be right now.",
                "I embrace each moment with curiosity and openness.",
                "I am ready to receive good things in my life.",
                "I create my own opportunities for growth and happiness.",
                "I am balanced and centered in who I am.",
                "I welcome new experiences and adventures.",
                "I am grateful for this moment of peace and clarity.",
                "I trust my inner wisdom to guide me forward."
            ],
            "positive": [
                "I radiate positivity and attract good things into my life.",
                "I am grateful for all the blessings in my life.",
                "I choose joy and happiness in every moment.",
                "I am a beacon of light for others around me.",
                "I celebrate my successes, both big and small.",
                "I am worthy of all the good things coming my way.",
                "I attract positive people and experiences.",
                "I am confident in my abilities and potential.",
                "I spread kindness and love wherever I go.",
                "I am living my best life and inspiring others to do the same."
            ],
            "very_positive": [
                "I am absolutely unstoppable in achieving my dreams!",
                "My positive energy creates miracles in my life!",
                "I am a magnet for incredible opportunities and experiences!",
                "I radiate joy and inspire everyone around me!",
                "My happiness is a gift that keeps on giving!",
                "I am living in perfect alignment with my highest self!",
                "Every cell in my body vibrates with pure joy and excitement!",
                "I am grateful beyond words for this amazing life I'm living!",
                "My positive mindset transforms everything around me!",
                "I am a powerful creator of my own incredible reality!"
            ]
        }
    
    def _load_coping_strategies(self) -> Dict[str, List[str]]:
        """Load coping strategies for different emotional states."""
        return {
            "very_negative": [
                "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
                "Write down your feelings in a journal without judging them.",
                "Reach out to a trusted friend, family member, or professional for support.",
                "Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 6.",
                "Take a warm bath or shower to soothe your mind and body.",
                "Listen to calming music or nature sounds.",
                "Go for a gentle walk outside if possible.",
                "Practice self-compassion by speaking to yourself as you would a dear friend.",
                "Engage in a creative activity like drawing, painting, or crafting.",
                "Remember: It's okay to not be okay. This feeling will pass."
            ],
            "negative": [
                "Practice mindfulness by focusing on the present moment.",
                "Do something small that brings you joy, like watching a funny video.",
                "Call a friend or family member who makes you feel better.",
                "Write down three things you're grateful for today.",
                "Take a short walk or do some light stretching.",
                "Listen to your favorite uplifting music.",
                "Treat yourself with kindness and patience.",
                "Engage in a hobby or activity you enjoy.",
                "Practice positive self-talk and challenge negative thoughts.",
                "Set small, achievable goals for the day."
            ],
            "stressed": [
                "Break large tasks into smaller, manageable steps.",
                "Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.",
                "Practice progressive muscle relaxation starting from your toes to your head.",
                "Try meditation or mindfulness apps like Headspace or Calm.",
                "Make a priority list and focus on one thing at a time.",
                "Take regular breaks throughout your day.",
                "Practice saying 'no' to additional commitments when you're overwhelmed.",
                "Do some light exercise or stretching to release physical tension.",
                "Talk to someone about what's stressing you out.",
                "Remember that it's impossible to be perfect, and that's okay."
            ],
            "angry": [
                "Count to ten (or one hundred) before responding to the situation.",
                "Practice deep breathing exercises to calm your nervous system.",
                "Go for a brisk walk or do some physical exercise to release energy.",
                "Write about your anger in a journal to process your feelings.",
                "Use 'I' statements when communicating your feelings to others.",
                "Take a timeout from the situation if possible.",
                "Practice the 'STOP' technique: Stop, Take a breath, Observe, Proceed mindfully.",
                "Listen to calming music or engage in a relaxing activity.",
                "Consider if this situation will matter in 5 years from now.",
                "Focus on solutions rather than dwelling on the problem."
            ],
            "neutral": [
                "Set an intention for the day or identify one goal to work toward.",
                "Try something new or step out of your comfort zone slightly.",
                "Connect with a friend or family member you haven't talked to recently.",
                "Engage in a mindfulness practice or meditation.",
                "Reflect on your recent accomplishments and celebrate them.",
                "Do something creative or learn a new skill.",
                "Volunteer or help someone in need to boost your mood.",
                "Spend time in nature or get some fresh air.",
                "Practice gratitude by listing things you appreciate in your life.",
                "Set up your environment to support positive energy."
            ],
            "positive": [
                "Use this positive energy to work on important goals or projects.",
                "Share your good mood with others through acts of kindness.",
                "Take time to appreciate and savor this positive feeling.",
                "Write down what's making you feel good to remember for tougher days.",
                "Plan something fun or exciting to look forward to.",
                "Use this momentum to tackle tasks you've been putting off.",
                "Express gratitude to people who have positively impacted your life.",
                "Celebrate your wins, both big and small.",
                "Channel this energy into creative pursuits or hobbies.",
                "Make plans with friends or family to share your positive energy."
            ]
        }
    
    def _load_success_tips(self) -> List[str]:
        """Load general success and productivity tips."""
        return [
            "Start your day with a positive morning routine.",
            "Set clear, specific, and achievable goals.",
            "Celebrate small wins along the way to big victories.",
            "Surround yourself with positive and supportive people.",
            "Invest in continuous learning and personal growth.",
            "Practice self-care regularly - you can't pour from an empty cup.",
            "Take calculated risks and step outside your comfort zone.",
            "Learn from failures and setbacks - they're stepping stones to success.",
            "Practice gratitude daily to maintain a positive mindset.",
            "Focus on progress, not perfection.",
            "Build strong relationships and network genuinely.",
            "Manage your time effectively and prioritize important tasks.",
            "Stay consistent in your efforts, even when motivation is low.",
            "Take care of your physical and mental health.",
            "Help others and give back to your community."
        ]
    
    def get_motivational_content(self, mood: str, mood_category: str = None, personalized: bool = True) -> Dict:
        """
        Get motivational content based on mood analysis.
        
        Args:
            mood (str): Specific mood detected
            mood_category (str): General category (positive, negative, neutral)
            personalized (bool): Whether to personalize the response
            
        Returns:
            Dict: Motivational content package
        """
        # Select appropriate quotes and affirmations
        quotes = self.motivational_quotes.get(mood, self.motivational_quotes.get("neutral", []))
        affirmations = self.affirmations.get(mood, self.affirmations.get("neutral", []))
        strategies = self.coping_strategies.get(mood, self.coping_strategies.get("neutral", []))
        
        # Randomly select content
        selected_quote = random.choice(quotes) if quotes else "You are stronger than you know."
        selected_affirmations = random.sample(affirmations, min(3, len(affirmations))) if affirmations else []
        selected_strategies = random.sample(strategies, min(3, len(strategies))) if strategies else []
        selected_tip = random.choice(self.success_tips)
        
        return {
            "motivational_quote": selected_quote,
            "affirmations": selected_affirmations,
            "coping_strategies": selected_strategies,
            "success_tip": selected_tip,
            "mood_addressed": mood,
            "encouragement": self._get_personalized_encouragement(mood, mood_category)
        }
    
    def _get_personalized_encouragement(self, mood: str, mood_category: str = None) -> str:
        """Generate personalized encouragement based on mood."""
        encouragements = {
            "very_negative": "I know things feel overwhelming right now, but please remember that you've overcome difficult times before. You have an inner strength that's carried you through challenges, and it will carry you through this too. Take things one moment at a time, and be gentle with yourself. You matter, and this difficult period will pass.",
            
            "negative": "It's completely okay to feel down sometimes - it's part of being human. What you're experiencing is valid, and you don't need to rush through it. Allow yourself to feel these emotions, but also remember that they don't define you. You have the strength to work through this, and brighter days are ahead.",
            
            "stressed": "I can sense that you're carrying a lot right now. Stress can feel overwhelming, but remember that you don't have to handle everything at once. Break things down into smaller, manageable pieces. Take deep breaths, and remember that it's okay to ask for help. You're more capable than you realize.",
            
            "angry": "Your anger is telling you that something matters to you - that's actually a sign of your passion and values. It's okay to feel angry, but try to channel that energy into something constructive. Take some time to cool down, and then think about how you can address what's bothering you in a positive way.",
            
            "neutral": "Sometimes the calm moments are exactly what we need. You're in a good place to reflect, plan, or simply be present. This is a perfect time to set intentions, try something new, or appreciate where you are in your journey. Embrace this peaceful energy.",
            
            "positive": "Your positive energy is wonderful! It's clear that you're in a great headspace, and that's something to celebrate. Use this momentum to pursue your goals, spread kindness to others, and remember this feeling for times when you need a boost. You're doing great!",
            
            "very_positive": "Your joy is absolutely contagious! This incredible positive energy you have is a gift - both to yourself and to everyone around you. You're radiating the kind of happiness that makes the world a brighter place. Keep shining and use this amazing energy to create something beautiful!",
            
            "excited": "Your excitement is electric! This burst of enthusiasm is your inner wisdom telling you that you're aligned with something meaningful. Channel this incredible energy into action - this is the perfect time to take that leap, start that project, or pursue that dream you've been thinking about!",
            
            "surprised": "Life has a beautiful way of keeping us on our toes, doesn't it? Sometimes the unexpected turns out to be exactly what we needed, even if we didn't know it at the time. Stay open to where this surprise might lead you - it could be the beginning of something wonderful."
        }
        
        return encouragements.get(mood, "You are unique and valuable, and your feelings matter. Whatever you're going through, remember that you have the strength to handle it. Take care of yourself and be kind to your heart.")
    
    def get_daily_motivation(self) -> Dict:
        """Get general daily motivational content."""
        return {
            "daily_quote": random.choice([
                "Today is a new opportunity to be your best self.",
                "Every sunrise is a reminder that you can start fresh.",
                "You have the power to make today amazing.",
                "Believe in yourself and watch miracles happen.",
                "Today's achievements start with today's decisions.",
                "You are exactly where you need to be to get where you want to go.",
                "Make today so awesome that yesterday becomes jealous.",
                "Your potential is limitless. What will you create today?"
            ]),
            "daily_affirmation": random.choice([
                "I am worthy of love, success, and happiness.",
                "I choose to see opportunities in every challenge.",
                "I am grateful for this new day and its possibilities.",
                "I trust in my ability to handle whatever comes my way.",
                "I radiate positive energy and attract good things.",
                "I am becoming the person I want to be.",
                "I deserve all the good things that are coming to me.",
                "I am strong, capable, and ready for success."
            ]),
            "success_tip": random.choice(self.success_tips)
        }
    
    def get_emergency_support(self) -> Dict:
        """Get crisis support and resources."""
        return {
            "message": "If you're experiencing thoughts of self-harm or suicide, please reach out for immediate help. You are not alone, and there are people who care about you.",
            "crisis_resources": [
                "National Suicide Prevention Lifeline: 988 or 1-800-273-8255",
                "Crisis Text Line: Text HOME to 741741",
                "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/",
                "Emergency Services: 911 (US), 999 (UK), 112 (EU)"
            ],
            "immediate_strategies": [
                "Reach out to a trusted friend, family member, or mental health professional immediately.",
                "Remove any means of self-harm from your environment.",
                "Go to your nearest emergency room or call emergency services.",
                "Use the crisis hotlines above - they're available 24/7.",
                "Practice grounding techniques: focus on your breathing and your immediate surroundings."
            ]
        }

# Example usage
if __name__ == "__main__":
    motivator = Motivator()
    
    # Test different moods
    test_moods = ["very_negative", "negative", "stressed", "angry", "neutral", "positive", "very_positive", "excited"]
    
    for mood in test_moods:
        print(f"\n=== MOOD: {mood.upper()} ===")
        content = motivator.get_motivational_content(mood)
        
        print(f"Quote: {content['motivational_quote']}")
        print(f"Encouragement: {content['encouragement'][:100]}...")
        print(f"Affirmations: {content['affirmations'][:1]}")  # Show first affirmation
        print(f"Strategy: {content['coping_strategies'][0] if content['coping_strategies'] else 'None'}")
        print("-" * 80)
    
    # Test daily motivation
    print("\n=== DAILY MOTIVATION ===")
    daily = motivator.get_daily_motivation()
    print(f"Quote: {daily['daily_quote']}")
    print(f"Affirmation: {daily['daily_affirmation']}")
    print(f"Tip: {daily['success_tip']}")
