import { useState } from "react";
import { Search, Filter, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntries } from "@/contexts/EntriesContext";
import { useNavigate } from "react-router-dom";

const EntriesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { entries, deleteEntry } = useEntries();
  const navigate = useNavigate();

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const moodColors: Record<string, string> = {
    "Happy": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Grateful": "bg-green-100 text-green-800 border-green-200",
    "Peaceful": "bg-blue-100 text-blue-800 border-blue-200",
    "Excited": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Reflective": "bg-purple-100 text-purple-800 border-purple-200",
    "Determined": "bg-orange-100 text-orange-800 border-orange-200",
    "Anxious": "bg-red-100 text-red-800 border-red-200",
    "Hopeful": "bg-teal-100 text-teal-800 border-teal-200",
    "Nostalgic": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Content": "bg-green-100 text-green-800 border-green-200"
  };

  const handleViewEntry = (entryId: string) => {
    navigate(`/dashboard/entries/${entryId}`);
  };

  const handleEditEntry = (entryId: string) => {
    navigate(`/dashboard/entries/${entryId}/edit`);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your Entries</h1>
          <p className="text-muted-foreground mt-1">Browse and manage your journal entries</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" className="sm:w-auto">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{entries.length}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Edit size={20} className="text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {entries.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Search size={20} className="text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {entries.reduce((total, entry) => total + entry.wordCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Words Written</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto">
                  <Edit size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No entries found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? 'Try adjusting your search terms' : 'Start writing your first journal entry'}
                  </p>
                </div>
                {!searchQuery && (
                  <Button 
                    onClick={() => navigate('/dashboard/new-entry')}
                    className="bg-gradient-hero text-primary-foreground"
                  >
                    Create First Entry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handleViewEntry(entry.id)}>
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                      <span>{entry.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="p-2" onClick={() => handleViewEntry(entry.id)}>
                      <Eye size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2" onClick={() => handleEditEntry(entry.id)}>
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-2 hover:text-destructive" 
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {entry.content.substring(0, 150)}...
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${moodColors[entry.mood] || 'bg-gray-100 text-gray-800 border-gray-200'} border`}
                    >
                      {entry.mood}
                    </Badge>
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{entry.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {entry.wordCount} words
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredEntries.length > 10 && (
        <div className="text-center">
          <Button variant="outline" className="w-full sm:w-auto">
            Load More Entries
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntriesList;