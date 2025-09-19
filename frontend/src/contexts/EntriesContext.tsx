import { createContext, useContext, useState, ReactNode } from 'react';

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
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  getEntry: (id: string) => Entry | undefined;
  updateEntry: (id: string, entry: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const useEntries = () => {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
};

const initialEntries: Entry[] = [
  {
    id: '1',
    title: 'A Day of Gratitude and Growth',
    content: `Today was one of those days that reminded me why I started this journey. I woke up early, around 6:30 AM, feeling refreshed after a good night's sleep. The morning sunlight streaming through my window immediately lifted my spirits.

I spent the first hour of my day in reflection and meditation. There's something magical about those quiet moments before the world wakes up. I felt grateful for this peaceful start and set my intentions for the day.

Work was productive today. I finally completed the project I've been working on for weeks. The sense of accomplishment was overwhelming. I realized that persistence and small daily actions really do compound over time.

During lunch, I called my parents. Hearing their voices always grounds me and reminds me of what's truly important. My mother shared some wisdom about patience that I'll carry with me.

The evening was spent reading and preparing for tomorrow. I'm learning to appreciate these simple pleasures more and more. There's beauty in the ordinary moments that make up our lives.

Tomorrow, I want to focus on being more present in my conversations and continuing to build on the momentum from today's accomplishments.`,
    date: 'January 15, 2024',
    time: '9:30 PM',
    mood: 'Grateful',
    tags: ['gratitude', 'productivity', 'family', 'meditation', 'reflection'],
    wordCount: 234,
    readTime: '2 min read',
    createdAt: new Date('2024-01-15T21:30:00')
  },
  {
    id: '2',
    title: 'Weekend Adventures',
    content: `Spent time with family and explored the local park. The weather was perfect and I felt grateful for these moments of connection and peace. We walked the trails, had a picnic, and just enjoyed being present together.`,
    date: 'January 14, 2024',
    time: '6:15 PM',
    mood: 'Peaceful',
    tags: ['family', 'nature', 'gratitude', 'weekend'],
    wordCount: 45,
    readTime: '1 min read',
    createdAt: new Date('2024-01-14T18:15:00')
  }
];

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);

  const addEntry = (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
    const newEntry: Entry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const updateEntry = (id: string, updatedData: Partial<Entry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedData } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
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