import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Conversation } from '../entities/Conversation.entity';
import { Users } from '../entities/user.entity';
import { AIService } from '../services/ai.service';

const conversationRepository = AppDataSource.getRepository(Conversation);
const aiService = new AIService();

export const sendPrompt = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = (req as any).user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get AI response with user context for memory
    const analysis = await aiService.analyzeText(message, userId);
    
    let aiResponse = '';
    if (analysis.summary?.summary) {
      aiResponse = analysis.summary.summary;
    }

    // Add motivational content if available
    if (analysis.motivation) {
      aiResponse += `\n\n**Motivational Insight:**\n${analysis.motivation.encouragement}`;
    }

    // Store conversation
    const conversation = new Conversation();
    conversation.user = { id: userId } as Users;
    conversation.userMessage = message;
    conversation.aiResponse = aiResponse;
    conversation.metadata = {
      mood: analysis.mood,
      keyPhrases: analysis.summary?.key_phrases || [],
    };

    await conversationRepository.save(conversation);

    return res.status(200).json({
      id: conversation.id,
      message: aiResponse,
      metadata: conversation.metadata,
      createdAt: conversation.createdAt,
    });
  } catch (error) {
    console.error('Error in sendPrompt:', error);
    return res.status(500).json({ message: 'Failed to process prompt' });
  }
};

export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 50;

    const conversations = await conversationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return res.status(200).json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        userMessage: conv.userMessage,
        aiResponse: conv.aiResponse,
        metadata: conv.metadata,
        createdAt: conv.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return res.status(500).json({ message: 'Failed to fetch history' });
  }
};

export const generatePrompt = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    const prompt = aiService.generateJournalPrompt(type || 'reflection');
    
    return res.status(200).json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return res.status(500).json({ message: 'Failed to generate prompt' });
  }
};

export const clearMemory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    aiService.clearMemory(userId);
    
    return res.status(200).json({ message: 'Conversation memory cleared' });
  } catch (error) {
    console.error('Error clearing memory:', error);
    return res.status(500).json({ message: 'Failed to clear memory' });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const conversation = await conversationRepository.findOne({
      where: { id: parseInt(id), user: { id: userId } },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    await conversationRepository.remove(conversation);
    return res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ message: 'Failed to delete conversation' });
  }
};