import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  getAllJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getTagsForJournalEntry,
  addTagToJournalEntry,
  removeTagFromJournalEntry,
} from '../controllers/journalEntry.controller';

const router = Router();

// All routes in this file are protected by JWT authentication
router.use(auth);

// Get all journal entries
router.get('/', getAllJournalEntries);

// Get specific journal entry
router.get('/:id', getJournalEntryById);

// Create a new journal entry
router.post('/', createJournalEntry);

// Update a journal entry
router.put('/:id', updateJournalEntry);

// Delete a journal entry
router.delete('/:id', deleteJournalEntry);

// Tag management routes
// Get all tags for a journal entry
router.get('/:id/tags', getTagsForJournalEntry);

// Add a tag to a journal entry
router.post('/:id/tags', addTagToJournalEntry);

// Remove a tag from a journal entry
router.delete('/:id/tags/:tagId', removeTagFromJournalEntry);

export default router;
