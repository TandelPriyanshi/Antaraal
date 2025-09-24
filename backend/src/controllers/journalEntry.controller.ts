import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { JournalEntry } from '../entities/Journal.entity';
import { Users } from '../entities/user.entity';
import { Tags } from '../entities/Tags.entity';

export const getAllJournalEntries = async (req: Request, res: Response) => {
  try {
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);

    const entries = await journalEntryRepository.find({
      where: { user: { id: req.user?.id } },
      relations: ['tags', 'user'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });

    res.json({
      message: 'Journal entries retrieved successfully',
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Error fetching journal entries' });
  }
};

export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);

    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id) },
      relations: ['tags', 'user'],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.user.id !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Journal entry retrieved successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Error fetching journal entry' });
  }
};

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const { date, title, content, summary, feeling, tags } = req.body;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
    const tagsRepository = AppDataSource.getRepository(Tags);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await AppDataSource.getRepository(Users).findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newEntry = journalEntryRepository.create({
      user,
      date: new Date(date),
      title,
      content,
      summary,
      feeling,
    });

    await journalEntryRepository.save(newEntry);

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagEntities = tags.map((tagText: string) => 
        tagsRepository.create({
          journal: newEntry,
          tag_text: tagText,
        })
      );
      await tagsRepository.save(tagEntities);
    }

    // Fetch the created entry with tags to return complete data
    const completeEntry = await journalEntryRepository.findOne({
      where: { id: newEntry.id },
      relations: ['tags', 'user'],
    });

    res.status(201).json({
      message: 'Journal entry created successfully',
      data: completeEntry,
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Error creating journal entry' });
  }
};

export const updateJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, title, content, summary, feeling, tags } = req.body;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
    const tagsRepository = AppDataSource.getRepository(Tags);

    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id) },
      relations: ['tags', 'user'],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.user.id !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update basic fields
    entry.date = date ? new Date(date) : entry.date;
    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.summary = summary !== undefined ? summary : entry.summary;
    entry.feeling = feeling !== undefined ? feeling : entry.feeling;

    await journalEntryRepository.save(entry);

    // Handle tags update if provided
    if (tags !== undefined) {
      // Delete existing tags
      await tagsRepository.delete({ journal: { id: Number(id) } });

      // Create new tags if provided
      if (Array.isArray(tags) && tags.length > 0) {
        const tagEntities = tags.map((tagText: string) =>
          tagsRepository.create({
            journal: entry,
            tag_text: tagText,
          })
        );
        await tagsRepository.save(tagEntities);
      }
    }

    // Fetch updated entry with new tags
    const updatedEntry = await journalEntryRepository.findOne({
      where: { id: Number(id) },
      relations: ['tags', 'user'],
    });

    res.json({
      message: 'Journal entry updated successfully',
      data: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Error updating journal entry' });
  }
};

export const deleteJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);

    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id), user: { id: req.user?.id } },
      relations: ['tags'],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    await journalEntryRepository.remove(entry);

    res.json({
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Error deleting journal entry' });
  }
};

// Tag management functions
export const getTagsForJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);

    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id) },
      relations: ['tags', 'user'],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.user.id !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Tags retrieved successfully',
      data: entry.tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

export const addTagToJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tag_text } = req.body;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
    const tagsRepository = AppDataSource.getRepository(Tags);

    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.user.id !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newTag = tagsRepository.create({
      journal: entry,
      tag_text,
    });

    await tagsRepository.save(newTag);

    res.status(201).json({
      message: 'Tag added successfully',
      data: newTag,
    });
  } catch (error) {
    console.error('Error adding tag:', error);
    res.status(500).json({ message: 'Error adding tag' });
  }
};

export const removeTagFromJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id, tagId } = req.params;
    const tagsRepository = AppDataSource.getRepository(Tags);

    const tag = await tagsRepository.findOne({
      where: { id: Number(tagId), journal: { id: Number(id) } },
      relations: ['journal', 'journal.user'],
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if user owns this entry
    if (tag.journal.user.id !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await tagsRepository.remove(tag);

    res.json({
      message: 'Tag removed successfully',
    });
  } catch (error) {
    console.error('Error removing tag:', error);
    res.status(500).json({ message: 'Error removing tag' });
  }
};
