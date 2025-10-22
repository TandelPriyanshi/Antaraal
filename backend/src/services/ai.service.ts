import http from 'http';
import https from 'https';

const NLP_SERVER_URL = process.env.NLP_SERVER_URL || 'http://localhost:8000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

interface NLPAnalysisResponse {
  summary?: {
    summary: string;
    key_phrases: string[];
  };
  mood?: any;
  motivation?: any;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private conversationMemory: Map<number, OpenAIMessage[]> = new Map();

  // OpenAI API Integration
  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback');
      return this.generateIntelligentFallback(messages[messages.length - 1].content);
    }

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            if (parsedData.error) {
              reject(new Error(parsedData.error.message));
            } else {
              const content = parsedData.choices?.[0]?.message?.content || '';
              resolve(content);
            }
          } catch (error) {
            reject(new Error('Failed to parse OpenAI response'));
          }
        });
      });

      req.on('error', (error) => {
        console.error('OpenAI API error:', error);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  // NLP Server Integration
  private async callNLPServer(endpoint: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, NLP_SERVER_URL);
      const postData = JSON.stringify(data);

      const options = {
        hostname: url.hostname,
        port: url.port || 8000,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (error) {
            reject(new Error('Failed to parse NLP server response'));
          }
        });
      });

      req.on('error', (error) => {
        console.error('NLP Server connection error:', error);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  // Web Search (Simple implementation - you can integrate Google Custom Search API)
  private async searchWeb(query: string): Promise<string> {
    // This is a placeholder - integrate with Google Custom Search API or similar
    return `🔎 Searching web for: "${query}"\n\nNote: To enable real-time web search, please configure Google Custom Search API or similar service.\n\nFor now, I can help you with: journaling insights, mood analysis, motivational content, creative writing, goal setting, and personal reflection.`;
  }

  // Main AI Response Method
  async analyzeText(text: string, userId?: number): Promise<NLPAnalysisResponse> {
    try {
      // Detect intent
      const intent = this.detectIntent(text);

      // Build conversation context
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are Antaraal, an intelligent journaling assistant with the following capabilities:
          
1. **General Intelligence & Language**: Write, improve, translate, simplify, explain concepts
2. **Journaling Support**: Help with mood analysis, gratitude practice, self-reflection
3. **Creative Writing**: Generate prompts, stories, poems
4. **Learning & Education**: Explain concepts step-by-step (math, programming, science)
5. **Personal Growth**: Goal setting, habit building, motivation
6. **Productivity**: Summarize text, create notes, organize information

You are empathetic, insightful, and supportive. Provide detailed, helpful responses tailored to journaling and personal growth.`
        }
      ];

      // Add conversation history if userId provided
      if (userId && this.conversationMemory.has(userId)) {
        const history = this.conversationMemory.get(userId) || [];
        messages.push(...history.slice(-6)); // Keep last 3 exchanges
      }

      // Add current message
      messages.push({
        role: 'user',
        content: text
      });

      let response = '';

      // Handle different intents
      switch (intent) {
        case 'web_search':
          response = await this.searchWeb(text);
          break;

        case 'code':
          response = await this.handleCodeRequest(text, messages);
          break;

        case 'image_analysis':
          response = this.handleImageRequest(text);
          break;

        case 'translation':
          response = await this.handleTranslation(text, messages);
          break;

        case 'summary':
          response = await this.generateSummaryWithAI(text, messages);
          break;

        case 'learning':
          response = await this.handleLearningRequest(text, messages);
          break;

        default:
          response = await this.handleGeneralRequest(text, messages);
      }

      // Update conversation memory
      if (userId) {
        const history = this.conversationMemory.get(userId) || [];
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: response });
        this.conversationMemory.set(userId, history);
      }

      return {
        summary: {
          summary: response,
          key_phrases: this.extractKeyPhrases(text),
        },
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.generateFallbackResponse(text);
    }
  }

  // Intent Detection
  private detectIntent(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('search') || lowerText.includes('latest') || lowerText.includes('news') || lowerText.includes('current')) {
      return 'web_search';
    }
    if (lowerText.includes('code') || lowerText.includes('programming') || lowerText.includes('function') || lowerText.includes('debug')) {
      return 'code';
    }
    if (lowerText.includes('image') || lowerText.includes('photo') || lowerText.includes('picture') || lowerText.includes('visual')) {
      return 'image_analysis';
    }
    if (lowerText.includes('translate') || lowerText.includes('translation')) {
      return 'translation';
    }
    if (lowerText.includes('summarize') || lowerText.includes('summary') || lowerText.includes('tldr')) {
      return 'summary';
    }
    if (lowerText.includes('explain') || lowerText.includes('how') || lowerText.includes('what is') || lowerText.includes('teach')) {
      return 'learning';
    }

    return 'general';
  }

  // Handle Code Requests
  private async handleCodeRequest(text: string, messages: OpenAIMessage[]): Promise<string> {
    try {
      messages[0].content += '\n\nYou are also an expert programmer. Provide clean, well-commented code with explanations.';
      return await this.callOpenAI(messages);
    } catch (error) {
      return this.generateCodeFallback(text);
    }
  }

  // Handle Image Requests
  private handleImageRequest(text: string): string {
    return `📷 **Image Analysis Feature**

I can help you with images in several ways:

1. **Describe Images**: Upload an image and I'll describe what I see
2. **Extract Text**: I can read text from images (OCR)
3. **Generate Images**: Describe what you want and I'll help create it
4. **Edit Images**: Modify existing images (add/remove elements, change colors)

To use image features, please describe what you need or describe the image you're working with.

Example requests:
- "Describe this sunset photo"
- "Extract text from this document"
- "Generate an image of a peaceful mountain landscape"
- "Edit this photo to remove the background"`;
  }

  // Handle Translation
  private async handleTranslation(text: string, messages: OpenAIMessage[]): Promise<string> {
    try {
      messages[0].content = 'You are an expert translator. Provide accurate translations with cultural context when relevant.';
      return await this.callOpenAI(messages);
    } catch (error) {
      return 'Translation service temporarily unavailable. Please try again.';
    }
  }

  // Handle Summary Generation
  private async generateSummaryWithAI(text: string, messages: OpenAIMessage[]): Promise<string> {
    try {
      // Try NLP server first for summaries
      const nlpResponse = await this.callNLPServer('/summarize', {
        text: text,
        summary_type: 'auto',
      });
      return nlpResponse.summary || await this.callOpenAI(messages);
    } catch (error) {
      return await this.callOpenAI(messages);
    }
  }

  // Handle Learning Requests
  private async handleLearningRequest(text: string, messages: OpenAIMessage[]): Promise<string> {
    try {
      messages[0].content += '\n\nYou are a patient, encouraging tutor. Break down complex concepts into simple steps. Use examples and analogies.';
      return await this.callOpenAI(messages);
    } catch (error) {
      return this.generateLearningFallback(text);
    }
  }

  // Handle General Requests
  private async handleGeneralRequest(text: string, messages: OpenAIMessage[]): Promise<string> {
    try {
      return await this.callOpenAI(messages);
    } catch (error) {
      return this.generateIntelligentFallback(text);
    }
  }

  // Extract Key Phrases
  private extractKeyPhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were']);
    return words
      .filter(word => word.length > 4 && !stopWords.has(word))
      .slice(0, 5);
  }

  // Fallback Responses
  private generateIntelligentFallback(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('code') || lowerText.includes('programming')) {
      return this.generateCodeFallback(text);
    }
    if (lowerText.includes('learn') || lowerText.includes('explain')) {
      return this.generateLearningFallback(text);
    }

    return this.generateJournalingResponse(text);
  }

  private generateCodeFallback(text: string): string {
    return `💻 **Programming Assistant**

I can help you with:
- Writing code in multiple languages (JavaScript, Python, TypeScript, etc.)
- Debugging and fixing errors
- Explaining algorithms and data structures
- Code reviews and optimization
- API integration and database queries

Please provide more details about what you'd like help with, and I'll generate code examples with explanations.`;
  }

  private generateLearningFallback(text: string): string {
    return `📚 **Learning Assistant**

I can help you learn and understand:
- Step-by-step explanations of complex topics
- Math, science, and programming concepts
- Study materials and notes
- Practice problems and solutions
- Interview preparation

What would you like to learn about? I'll break it down into easy-to-understand steps.`;
  }

  private generateJournalingResponse(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('gratitude')) {
      return `🙏 **Gratitude Practice**

Practicing gratitude is wonderful! Here's a guided reflection:

1. **Three Good Things**: List 3 things you're grateful for today
2. **Why They Matter**: For each, explain why it's meaningful
3. **Savoring**: Take a moment to truly feel the appreciation

Studies show that regular gratitude practice:
- Increases happiness and life satisfaction
- Improves relationships
- Enhances physical and mental health
- Builds resilience

What are you grateful for today?`;
    }

    if (lowerText.includes('goal')) {
      return `🎯 **Goal Setting Guide**

Let's work on your goals using the SMART framework:

**S**pecific - What exactly do you want to achieve?
**M**easurable - How will you track progress?
**A**chievable - Is it realistic with your resources?
**R**elevant - Does it align with your values?
**T**ime-bound - What's your deadline?

**Action Steps**:
1. Break your goal into smaller milestones
2. Identify potential obstacles
3. Plan your first step
4. Schedule regular check-ins

What goal would you like to work on?`;
    }

    return `✨ **Your Journaling Companion**

I'm here to help you with:
- 💭 Personal reflection and self-discovery
- 📝 Creative writing prompts and exercises
- 🎯 Goal setting and achievement planning
- 💪 Motivation and encouragement
- 📊 Summarizing and organizing your thoughts
- 🧠 Learning and explaining concepts
- 💻 Coding and technical help

How can I assist you today?`;
  }

  private generateFallbackResponse(text: string): NLPAnalysisResponse {
    return {
      summary: {
        summary: this.generateIntelligentFallback(text),
        key_phrases: this.extractKeyPhrases(text),
      },
    };
  }

  // Memory Management
  clearMemory(userId: number): void {
    this.conversationMemory.delete(userId);
  }

  // Journal Prompt Generation
  generateJournalPrompt(type: string): string {
    const prompts = {
      gratitude: [
        "What are three things you're grateful for today?",
        "Who made your day better and how?",
        "What small moment brought you joy today?",
        "What challenges are you grateful to have overcome?",
      ],
      reflection: [
        "What did you learn about yourself today?",
        "How did you grow or change today?",
        "What challenged you and how did you respond?",
        "What would you do differently if you could?",
      ],
      goals: [
        "What's one step you can take toward your biggest goal?",
        "What does success look like for you this week?",
        "What habits do you want to build or break?",
        "What's holding you back and how can you overcome it?",
      ],
      creative: [
        "If today were a color, what would it be and why?",
        "Write about a moment that took your breath away",
        "Describe your perfect day in vivid detail",
        "What story is your life telling right now?",
      ],
    };

    const typePrompts = prompts[type as keyof typeof prompts] || prompts.reflection;
    return typePrompts[Math.floor(Math.random() * typePrompts.length)];
  }
}