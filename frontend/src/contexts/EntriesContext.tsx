import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

export interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  mood: string;
  tags: string[];
  wordCount: number;
  readTime: string;
  createdAt: Date;
}

interface EntriesContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => Promise<void> | void;
  getEntry: (id: string) => Entry | undefined;
  updateEntry: (id: string, entry: Partial<Entry>) => Promise<void> | void;
  deleteEntry: (id: string) => Promise<void> | void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const useEntries = () => {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
};

// Map backend JournalEntry -> UI Entry
type ApiEntry = {
  id: number;
  date: string; // ISO date or YYYY-MM-DD
  title: string;
  content: string;
  summary?: string | null;
  mood?: string | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
};

const mapApiToEntry = (e: ApiEntry): Entry => {
  const created = new Date(e.createdAt ?? e.date);
  const wc = e.content?.split(/\s+/).filter(Boolean).length || 0;
  const dateStr = created.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = created.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return {
    id: String(e.id),
    title: e.title,
    content: e.content,
    date: dateStr,
    time: timeStr,
    mood: e.mood ?? 'Reflective',
    tags: e.tags ?? [],
    wordCount: wc,
    readTime: `${Math.max(1, Math.ceil(wc / 200))} min read`,
    createdAt: created,
  };
};

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load current user's entries from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: ApiEntry[] }>(`/journal-entries`);
        if (res.data?.data) {
          setEntries(res.data.data.map(mapApiToEntry));
        } else if (res.error) {
          console.error('Failed to load entries:', res.error);
        }
      } catch (err) {
        console.error('Entries load error:', err);
      }
    };
    load();
  }, []);

  const addEntry = async (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
    try {
      // Persist to backend using minimal required fields
      const payload = {
        title: entryData.title,
        content: entryData.content,
        date: new Date().toISOString(),
        summary: null,
        mood: entryData.mood,
        tags: entryData.tags,
      };
      const res = await api.post<{ data: ApiEntry }>(`/journal-entries`, payload);
      if (res.data?.data) {
        const mapped = mapApiToEntry(res.data.data);
        setEntries(prev => [mapped, ...prev]);
      } else {
        // Fallback: optimistic add if API not available
        const now = new Date();
        const wc = entryData.content.split(/\s+/).filter(Boolean).length;
        const optimistic: Entry = {
          id: String(Date.now()),
          title: entryData.title,
          content: entryData.content,
          date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          mood: entryData.mood || 'Reflective',
          tags: entryData.tags || [],
          wordCount: wc,
          readTime: `${Math.max(1, Math.ceil(wc / 200))} min read`,
          createdAt: now,
        };
        setEntries(prev => [optimistic, ...prev]);
      }
    } catch (err) {
      console.error('Add entry error:', err);
    }
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const updateEntry = async (id: string, updatedData: Partial<Entry>) => {
    try {
      const payload: any = {};
      if (updatedData.title !== undefined) payload.title = updatedData.title;
      if (updatedData.content !== undefined) payload.content = updatedData.content;
      if (updatedData.date !== undefined) payload.date = new Date(updatedData.date).toISOString();
      if (updatedData.mood !== undefined) payload.mood = updatedData.mood;
      if (updatedData.tags !== undefined) payload.tags = updatedData.tags;
      await api.put(`/journal-entries/${id}`, payload);
    } catch (err) {
      console.error('Update entry error:', err);
    } finally {
      setEntries(prev => prev.map(e => (e.id === id ? { ...e, ...updatedData } : e)));
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.delete(`/journal-entries/${id}`);
    } catch (err) {
      console.error('Delete entry error:', err);
    } finally {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  return (
    <EntriesContext.Provider value={{
      entries,
      addEntry,
      getEntry,
      updateEntry,
      deleteEntry
    }}>
      {children}
    </EntriesContext.Provider>
  );
};