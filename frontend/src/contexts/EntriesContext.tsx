import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

export interface Entry {
  id: string;
  title: string;
  content: string;
  date: string | Date; // Can be either string or Date object
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
  getEntry: (id: string) => Promise<Entry | undefined>;
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
type ApiTag = {
  id: number;
  tag_text: string;
};

type ApiEntry = {
  id: number;
  date: string; // ISO date or YYYY-MM-DD
  title: string;
  content: string;
  summary?: string | null;
  feeling?: string | null; // Backend returns 'feeling', not 'mood'
  tags?: ApiTag[] | null; // Add tags property
  createdAt: string;
  updatedAt: string;
};

const mapApiToEntry = (e: ApiEntry): Entry => {
  let created: Date;

  if (e.date) {
    // User selected date - parse YYYY-MM-DD format without timezone conversion
    created = new Date(e.date + 'T12:00:00'); // Use noon to avoid timezone shifts
  } else if (e.createdAt) {
    // Fallback to createdAt timestamp if no selected date
    created = new Date(e.createdAt);
  } else {
    created = new Date();
  }

  // Format the date without timezone conversion - just use the date as-is
  const dateStr = created.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = created.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const wc = e.content?.split(/\s+/).filter(Boolean).length || 0;
  return {
    id: String(e.id),
    title: e.title,
    content: e.content,
    date: dateStr,
    time: timeStr,
    mood: e.feeling ?? 'Reflective',
    tags: e.tags?.map(tag => tag.tag_text) ?? [],
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
          const mappedEntries = res.data.data.map(mapApiToEntry);
          setEntries(mappedEntries);
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
      // Convert Date object to YYYY-MM-DD format to preserve the selected date
      const dateObj = entryData.date instanceof Date ? entryData.date : new Date();
      const formattedDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format

      const payload = {
        title: entryData.title,
        content: entryData.content,
        date: formattedDate, // Use YYYY-MM-DD format instead of ISO string
        summary: null,
        feeling: entryData.mood,
        tags: entryData.tags,
      };

      const res = await api.post<{ data: ApiEntry }>(`/journal-entries`, payload);
      if (res.data?.data) {
        const mapped = mapApiToEntry(res.data.data);
        setEntries(prev => [mapped, ...prev]);
      } else {
        // Fallback: optimistic add if API not available
        const now = new Date();
        const selectedDate = entryData.date instanceof Date ? entryData.date : now;
        const wc = entryData.content.split(/\s+/).filter(Boolean).length;
        const optimistic: Entry = {
          id: String(Date.now()),
          title: entryData.title,
          content: entryData.content,
          date: selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
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

  const getEntry = async (id: string): Promise<Entry | undefined> => {
    // First check if we have it in local state
    let entry = entries.find(entry => entry.id === id);

    // If not found locally, try to fetch from API
    if (!entry) {
      try {
        const res = await api.get<{ data: ApiEntry }>(`/journal-entries/${id}`);
        if (res.data?.data) {
          entry = mapApiToEntry(res.data.data);
          // Add to local state
          setEntries(prev => [entry!, ...prev]);
        }
      } catch (err) {
        console.error('Get entry error:', err);
      }
    }

    return entry;
  };

  const updateEntry = async (id: string, updatedData: Partial<Entry>) => {
    try {
      const payload: any = {};
      if (updatedData.title !== undefined) payload.title = updatedData.title;
      if (updatedData.content !== undefined) payload.content = updatedData.content;
      if (updatedData.date !== undefined) {
        // Convert Date object to YYYY-MM-DD format to preserve the selected date
        const dateObj = updatedData.date instanceof Date ? updatedData.date : new Date(updatedData.date);
        payload.date = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      }
      if (updatedData.mood !== undefined) payload.feeling = updatedData.mood; // Backend expects 'feeling'
      if (updatedData.tags !== undefined) payload.tags = updatedData.tags;

      const res = await api.put<{ data: ApiEntry }>(`/journal-entries/${id}`, payload);
      if (res.data?.data) {
        // Update with the response from the server
        const mapped = mapApiToEntry(res.data.data);
        setEntries(prev => prev.map(e => (e.id === id ? mapped : e)));
      } else {
        // Optimistic update if API call fails
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, ...updatedData } : e)));
      }
    } catch (err) {
      console.error('Update entry error:', err);
      // Still update locally for better UX
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