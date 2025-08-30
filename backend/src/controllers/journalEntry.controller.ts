import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { JournalEntry } from '../entities/Journal.entity';
import { Users } from '../entities/user.entity';

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const { date, title, content, summary } = req.body;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
    
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
    });

    await journalEntryRepository.save(newEntry);
    
    res.status(201).json({
      message: 'Journal entry created successfully',
      data: newEntry,
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Error creating journal entry' });
  }
};

export const updateJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, title, content, summary } = req.body;
    const journalEntryRepository = AppDataSource.getRepository(JournalEntry);
    
    const entry = await journalEntryRepository.findOne({
      where: { id: Number(id), user: { id: req.user?.id } },
    });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    entry.date = date || entry.date;
    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.summary = summary !== undefined ? summary : entry.summary;

    await journalEntryRepository.save(entry);
    
    res.json({
      message: 'Journal entry updated successfully',
      data: entry,
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
