import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlbumCard, { AlbumCardProps } from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePhotos } from "@/hooks/use-photos";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const AlbumsList = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("New Folder");

  const { folders, loading, uploadPhoto, createFolder, error } = usePhotos();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for photo counts per folder
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({});

  // Debug logging
  console.log('AlbumsList - folders:', folders, 'loading:', loading, 'error:', error);

  // Fetch photo counts for all folders
  const fetchPhotoCounts = async (folderList: string[]) => {
    if (!Array.isArray(folderList) || folderList.length === 0) {
      setPhotoCounts({});
      return;
    }

    try {
      const counts: Record<string, number> = {};

      // Fetch photo count for each folder
      await Promise.all(
        folderList.map(async (folder) => {
          try {
            const response = await api.photos.getPhotosByFolder(folder);
            if (response.data) {
              const apiResponse = response.data as { data?: any[] };
              const photosData = apiResponse?.data || [];
              const photosArray = Array.isArray(photosData) ? photosData : [];
              counts[folder] = photosArray.length;
            } else {
              counts[folder] = 0;
            }
          } catch (error) {
            console.error(`Failed to fetch photos for folder ${folder}:`, error);
            counts[folder] = 0;
          }
        })
      );

      setPhotoCounts(counts);
    } catch (error) {
      console.error('Failed to fetch photo counts:', error);
      setPhotoCounts({});
    }
  };

  // Set selected folder when folders load
  useEffect(() => {
    if (Array.isArray(folders) && folders.length > 0 && !folders.includes(selectedFolder)) {
      setSelectedFolder(folders[0]);
    }
  }, [folders, selectedFolder]);

  // Refresh photo counts when folders change
  useEffect(() => {
    if (Array.isArray(folders) && folders.length > 0) {
      fetchPhotoCounts(folders);
    } else {
      setPhotoCounts({});
    }
  }, [folders, fetchPhotoCounts]);

  const onUploadClick = () => fileInputRef.current?.click();

  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    for (const file of files) {
      await uploadPhoto(file, selectedFolder);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Refresh photo counts after upload
    if (Array.isArray(folders) && folders.length > 0) {
      fetchPhotoCounts(folders);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const success = await createFolder(newFolderName.trim());
    if (success) {
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      // Refresh photo counts after creating new folder
      if (Array.isArray(folders) && folders.length > 0) {
        fetchPhotoCounts(folders);
      }
    }
  };

  // Convert folders to AlbumCardProps format with actual photo counts
  const albums: AlbumCardProps[] = Array.isArray(folders) ? folders.map((folder) => ({
    id: folder,
    title: folder,
    photoCount: photoCounts[folder] || 0,
    updatedAt: new Date().toISOString(),
    visibility: "private"
  })) : [];

  // Debug logging
  console.log('AlbumsList - albums:', albums, 'albums.length:', albums.length);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Albums</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">New Album</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Album name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateFolder} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateFolderOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading albums...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">Failed to load albums</div>
            <div className="text-sm text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      ) : albums.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">No albums yet</div>
            <Button onClick={() => setIsCreateFolderOpen(true)}>
              Create your first album
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/dashboard/albums/${encodeURIComponent(album.id)}`)}
              className="cursor-pointer"
            >
              <AlbumCard {...album} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;