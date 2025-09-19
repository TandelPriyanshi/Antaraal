import { BarChart3, Calendar, TrendingUp, Award, Clock, BookOpen, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StatsPage = () => {
  const stats = {
    totalEntries: 156,
    currentStreak: 12,
    longestStreak: 28,
    totalWords: 45823,
    averageWords: 294,
    journalingDays: 89,
    thisMonth: 18,
    favoriteTime: "Evening",
    topMood: "Grateful"
  };

  const weeklyData = [
    { day: "Mon", entries: 2, words: 450 },
    { day: "Tue", entries: 1, words: 320 },
    { day: "Wed", entries: 3, words: 680 },
    { day: "Thu", entries: 1, words: 240 },
    { day: "Fri", entries: 2, words: 520 },
    { day: "Sat", entries: 1, words: 180 },
    { day: "Sun", entries: 2, words: 410 }
  ];

  const moodData = [
    { mood: "Happy", count: 45, color: "bg-green-500", percentage: 29 },
    { mood: "Grateful", count: 52, color: "bg-blue-500", percentage: 33 },
    { mood: "Peaceful", count: 28, color: "bg-purple-500", percentage: 18 },
    { mood: "Excited", count: 19, color: "bg-yellow-500", percentage: 12 },
    { mood: "Reflective", count: 12, color: "bg-gray-500", percentage: 8 }
  ];

  const achievements = [
    { 
      title: "First Entry", 
      description: "Wrote your first journal entry",
      unlocked: true,
      icon: BookOpen
    },
    { 
      title: "Week Warrior", 
      description: "Journaled for 7 days straight",
      unlocked: true,
      icon: Target
    },
    { 
      title: "Word Master", 
      description: "Wrote over 10,000 words",
      unlocked: true,
      icon: Zap
    },
    { 
      title: "Monthly Champion", 
      description: "Complete 30 entries in one month",
      unlocked: false,
      icon: Award
    }
  ];

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
                <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <span className="text-xs text-muted-foreground">{day.entries} entries</span>
                      <span className="text-xs text-muted-foreground">{day.words} words</span>
                    </div>
                    <Progress 
                      value={(day.words / 800) * 100} 
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
              {moodData.map((mood) => (
                <div key={mood.mood} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{mood.mood}</span>
                    <span className="text-sm text-muted-foreground">{mood.count} entries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${mood.color}`} />
                    <Progress value={mood.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-8">{mood.percentage}%</span>
                  </div>
                </div>
              ))}
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
              <Badge variant="secondary">{stats.longestStreak} days</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Words</span>
              <Badge variant="secondary">{stats.averageWords} words</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Favorite Time</span>
              <Badge variant="secondary">{stats.favoriteTime}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Top Mood</span>
              <Badge variant="secondary">{stats.topMood}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goal */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.thisMonth}/25</p>
                <p className="text-sm text-muted-foreground">entries this month</p>
              </div>
              <Progress value={(stats.thisMonth / 25) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {25 - stats.thisMonth} more entries to reach your goal
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
                  <p className="text-lg font-semibold text-foreground">2h 45m</p>
                  <p className="text-sm text-muted-foreground">Total time spent</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Average session: 12 minutes</p>
                <p>Best day: Sunday (28 min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award size={20} className="text-primary" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.title}
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
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;