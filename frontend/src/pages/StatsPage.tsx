import { BarChart3, Calendar, TrendingUp, Award, Clock, BookOpen, Target, Zap, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useStats from "@/hooks/use-stats";

// Helper function to get color for mood
const getMoodColor = (mood: string): string => {
  const colors: Record<string, string> = {
    happy: "bg-green-500",
    grateful: "bg-blue-500",
    peaceful: "bg-purple-500",
    excited: "bg-yellow-500",
    reflective: "bg-indigo-500",
    sad: "bg-gray-500",
    angry: "bg-red-500",
    anxious: "bg-amber-500",
    default: "bg-gray-300",
  };
  return colors[mood.toLowerCase()] || colors.default;
};

// Helper to format time in minutes to hours and minutes
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const StatsPage = () => {
  const { stats, loading, error } = useStats();

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your statistics...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>Failed to load statistics. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Process mood data for the chart
  const moodData = Object.entries(stats.moodDistribution)
    .map(([mood, count]) => ({
      mood,
      count,
      color: getMoodColor(mood),
      percentage: Math.round((count / stats.totalEntries) * 100) || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Map weekdays to match the backend response
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyData = weekDays.map((day) => {
    const dayData = stats.weeklyActivity.find(d => d.day === day) || { day, entries: 0, words: 0 };
    return {
      day: day.substring(0, 3),
      entries: dayData.entries,
      words: dayData.words,
    };
  });

  // Find the maximum words for the progress bars
  const maxWords = Math.max(...weeklyData.map(d => d.words), 1); // Ensure we don't divide by zero

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Statistics & Insights</h1>
        <p className="text-muted-foreground mt-1">Track your journaling journey and celebrate your progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-subtle rounded-lg">
                <BookOpen size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-subtle rounded-lg">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-foreground">{stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-subtle rounded-lg">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Words</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalWords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-subtle rounded-lg">
                <Calendar size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">{stats.entriesThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.entriesThisMonth}/{stats.monthlyGoal.target}
              </p>
              <p className="text-sm text-muted-foreground">entries this month</p>
            </div>
            <Progress 
              value={(stats.entriesThisMonth / stats.monthlyGoal.target) * 100} 
              className="h-3" 
            />
            <p className="text-xs text-muted-foreground text-center">
              {stats.monthlyGoal.remaining} more to reach your goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Writing Time */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Writing Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {formatTime(stats.writingTime.totalMinutes)}
                </p>
                <p className="text-sm text-muted-foreground">Total time spent</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Average session: {formatTime(stats.writingTime.avgSessionMinutes)}</p>
              <p>Best session: {formatTime(stats.writingTime.bestSessionMinutes)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-primary" />
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-muted-foreground w-8">{day.day}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {day.entries} {day.entries === 1 ? 'entry' : 'entries'}
                      </span>
                      <span className="text-xs text-muted-foreground">{day.words} words</span>
                    </div>
                    <Progress 
                      value={maxWords > 0 ? (day.words / maxWords) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-primary" />
              <span>Mood Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodData.length > 0 ? (
                moodData.map((mood) => (
                  <div key={mood.mood} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {mood.mood.toLowerCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {mood.count} {mood.count === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${mood.color}`} />
                      <Progress value={mood.percentage} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8">{mood.percentage}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No mood data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Records */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Personal Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Streak</span>
              <Badge variant="secondary">
                {stats.personalRecords.longestStreak} {stats.personalRecords.longestStreak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Words/Entry</span>
              <Badge variant="secondary">{Math.round(stats.personalRecords.avgWordsPerEntry)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Favorite Time</span>
              <Badge variant="secondary">{stats.personalRecords.favoriteWritingTime}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Top Mood</span>
              <Badge variant="secondary" className="capitalize">
                {stats.personalRecords.topMood?.toLowerCase() || 'N/A'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-0 shadow-soft md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award size={20} className="text-primary" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.achievements && stats.achievements.length > 0 ? (
                stats.achievements.map((achievement) => {
                  let Icon = Award;
                  if (achievement.id === 'first_entry') Icon = BookOpen;
                  if (achievement.id === 'weekly_streak') Icon = Target;
                  if (achievement.id === 'word_master') Icon = Zap;

                  return (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        achievement.unlocked 
                          ? 'bg-gradient-subtle border-primary/20' 
                          : 'bg-muted/50 border-muted opacity-60'
                      }`}
                    >
                      <div className={`inline-flex p-3 rounded-full mb-3 ${
                        achievement.unlocked 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                      
                      {!achievement.unlocked && achievement.totalRequired > 1 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.totalRequired}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.totalRequired) * 100} 
                            className="h-1.5" 
                          />
                        </div>
                      )}
                      
                      {achievement.unlocked && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Unlocked
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No achievements yet. Keep journaling to unlock achievements!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;