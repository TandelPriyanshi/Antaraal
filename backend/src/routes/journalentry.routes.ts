import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journalEntry.controller';

const router = Router();

// All routes in this file are protected by JWT authentication
router.use(auth);

// Create a new journal entry
router.post('/', createJournalEntry);

// Update a journal entry
router.put('/:id', updateJournalEntry);

// Delete a journal entry
router.delete('/:id', deleteJournalEntry);

export default router;
