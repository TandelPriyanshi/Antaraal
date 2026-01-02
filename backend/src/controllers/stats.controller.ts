import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { JournalEntry } from '../entities/Journal.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';

interface MoodDistribution {
  [key: string]: number;
}

interface WeeklyActivity {
  day: string;
  entries: number;
  words: number;
}

interface StatsResponse {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  entriesThisMonth: number;
  weeklyActivity: WeeklyActivity[];
  moodDistribution: MoodDistribution;
  personalRecords: {
    longestStreak: number;
    avgWordsPerEntry: number;
    favoriteWritingTime: string;
    topMood: string;
  };
  monthlyGoal: {
    current: number;
    target: number;
    remaining: number;
  };
  writingTime: {
    totalMinutes: number;
    avgSessionMinutes: number;
    bestSessionMinutes: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    progress: number;
    totalRequired: number;
  }>;
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const journalRepo = AppDataSource.getRepository(JournalEntry);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all user's journal entries
    const allEntries = await journalRepo.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
    });

    if (allEntries.length === 0) {
      return res.json(getEmptyStatsResponse());
    }

    // Calculate basic stats
    const totalEntries = allEntries.length;
    const totalWords = allEntries.reduce((sum, entry) => {
      const words = entry.content ? entry.content.split(/\s+/).filter(Boolean).length : 0;
      return sum + words;
    }, 0);

    // Calculate current streak
    const sortedEntries = allEntries
      .map(entry => {
        // Create a new Date object from the entry date
        const entryDate = new Date(entry.date);
        // Normalize the time to start of day
        entryDate.setHours(0, 0, 0, 0);
        return {
          ...entry,
          date: entryDate
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    let currentStreak = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(lastDate.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) break; // Streak broken
      
      if (diffDays === 1 || currentStreak === 0) {
        currentStreak++;
        lastDate = entryDate;
      }
    }

    // Entries this month
    const entriesThisMonth = allEntries.filter(entry => 
      entry.date >= startOfMonth && entry.date <= endOfMonth
    ).length;

    // Weekly activity (last 7 days)
    const weeklyActivity = getWeeklyActivity(allEntries);
    
    // Mood distribution
    const moodDistribution = allEntries.reduce<MoodDistribution>((acc, entry) => {
      if (entry.feeling) {
        acc[entry.feeling] = (acc[entry.feeling] || 0) + 1;
      }
      return acc;
    }, {});

    // Personal records
    const longestStreak = calculateLongestStreak(allEntries);
    const avgWordsPerEntry = totalWords / totalEntries;
    const { favoriteTime, topMood } = analyzeHabits(allEntries);

    // Monthly goal (example: 20 entries per month)
    const monthlyTarget = 20;
    const remaining = Math.max(0, monthlyTarget - entriesThisMonth);

    // Writing time (simplified - assuming 1 minute per 10 words as an estimate)
    const totalMinutes = Math.ceil(totalWords / 10);
    const avgSessionMinutes = Math.ceil(totalMinutes / totalEntries);
    const bestSessionMinutes = Math.ceil(
      Math.max(...allEntries.map(e => (e.content?.split(/\s+/).filter(Boolean).length || 0) / 10))
    );

    // Achievements (simplified example)
    const achievements = [
      {
        id: 'first_entry',
        title: 'First Entry',
        description: 'Write your first journal entry',
        unlocked: totalEntries > 0,
        progress: Math.min(1, totalEntries),
        totalRequired: 1,
      },
      {
        id: 'weekly_streak',
        title: 'Weekly Streak',
        description: 'Write for 7 days in a row',
        unlocked: currentStreak >= 7,
        progress: Math.min(7, currentStreak),
        totalRequired: 7,
      },
      // Add more achievements as needed
    ];

    const response: StatsResponse = {
      totalEntries,
      currentStreak,
      totalWords,
      entriesThisMonth,
      weeklyActivity,
      moodDistribution,
      personalRecords: {
        longestStreak,
        avgWordsPerEntry: Math.round(avgWordsPerEntry * 10) / 10,
        favoriteWritingTime: favoriteTime,
        topMood: topMood || 'No mood data',
      },
      monthlyGoal: {
        current: entriesThisMonth,
        target: monthlyTarget,
        remaining,
      },
      writingTime: {
        totalMinutes,
        avgSessionMinutes,
        bestSessionMinutes,
      },
      achievements,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

// Helper functions
function getEmptyStatsResponse(): StatsResponse {
  return {
    totalEntries: 0,
    currentStreak: 0,
    totalWords: 0,
    entriesThisMonth: 0,
    weeklyActivity: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday'
    ].map(day => ({
      day,
      entries: 0,
      words: 0,
    })),
    moodDistribution: {},
    personalRecords: {
      longestStreak: 0,
      avgWordsPerEntry: 0,
      favoriteWritingTime: 'Not enough data',
      topMood: 'No mood data',
    },
    monthlyGoal: {
      current: 0,
      target: 20,
      remaining: 20,
    },
    writingTime: {
      totalMinutes: 0,
      avgSessionMinutes: 0,
      bestSessionMinutes: 0,
    },
    achievements: [],
  };
}

function getWeeklyActivity(entries: JournalEntry[]): WeeklyActivity[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyData = days.map(day => ({
    day,
    entries: 0,
    words: 0,
  }));

  entries.forEach(entry => {
    const dayOfWeek = new Date(entry.date).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const wordCount = entry.content ? entry.content.split(/\s+/).filter(Boolean).length : 0;
    
    weeklyData[dayOfWeek].entries++;
    weeklyData[dayOfWeek].words += wordCount;
  });

  // Reorder to start with Monday
  return [
    ...weeklyData.slice(1),
    weeklyData[0]
  ];
}

function calculateLongestStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  // Create a new array with Date objects and sort by date
  const sortedEntries = entries
    .map(entry => {
      const date = new Date(entry.date);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1]);
    const currDate = new Date(sortedEntries[i]);
    
    // Calculate difference in days
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive days
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (diffDays > 1) {
      // Streak broken
      currentStreak = 1;
    }
  }

  return longestStreak;
}

function analyzeHabits(entries: JournalEntry[]): { favoriteTime: string; topMood: string | null } {
  if (entries.length === 0) {
    return { favoriteTime: 'Not enough data', topMood: null };
  }

  const timeSlots = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };

  const moodCounts: Record<string, number> = {};

  entries.forEach(entry => {
    // Convert entry date to Date object
    const entryDate = new Date(entry.date);
    const hour = entryDate.getHours();

    // Categorize by time of day
    if (hour >= 5 && hour < 12) {
      timeSlots.morning++;
    } else if (hour >= 12 && hour < 17) {
      timeSlots.afternoon++;
    } else if (hour >= 17 && hour < 22) {
      timeSlots.evening++;
    } else {
      timeSlots.night++;
    }

    // Count moods
    if (entry.feeling) {
      moodCounts[entry.feeling] = (moodCounts[entry.feeling] || 0) + 1;
    }
  });

  // Find most common time slot
  const favoriteTime = Object.entries(timeSlots)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Find most common mood
  let topMood = null;
  const moodEntries = Object.entries(moodCounts);
  if (moodEntries.length > 0) {
    topMood = moodEntries.sort((a, b) => b[1] - a[1])[0][0];
  }

  return {
    favoriteTime: favoriteTime.charAt(0).toUpperCase() + favoriteTime.slice(1),
    topMood
  };
}