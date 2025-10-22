import { Router } from 'express';
import {
  sendPrompt,
  getConversationHistory,
  generatePrompt,
  deleteConversation,
} from '../controllers/ai.controller';

const router = Router();

router.post('/prompt', sendPrompt);
router.get('/history', getConversationHistory);
router.post('/generate-prompt', generatePrompt);
router.delete('/conversation/:id', deleteConversation);

export default router;