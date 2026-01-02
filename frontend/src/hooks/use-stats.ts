import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface StatsData {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  entriesThisMonth: number;
  weeklyActivity: Array<{
    day: string;
    entries: number;
    words: number;
  }>;
  moodDistribution: Record<string, number>;
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

const useStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5002/api/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Please log in to view statistics');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const refetch = () => {
    setError(null);
    fetchStats();
  };

  return { stats, loading, error, refetch };
};

export default useStats;
