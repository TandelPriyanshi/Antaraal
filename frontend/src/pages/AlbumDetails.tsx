import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Upload, Calendar, RefreshCw } from "lucide-react";
import { usePhotos, Photo } from "@/hooks/use-photos";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://localhost:5002';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState<string>(`Album #${id}`);
  const [description, setDescription] = useState<string>("Photos, details, and actions for this album.");

  const { photos, loading, loadPhotos, uploadPhoto, deletePhoto } = usePhotos();
  const { toast } = useToast();

  const albumName = id ? decodeURIComponent(id) : 'New Folder';

  useEffect(() => {
    if (albumName) {
      loadPhotos(albumName);
      setTitle(albumName);
    }
  }, [albumName]); // Removed loadPhotos dependency

  const onUploadClick = () => fileInputRef.current?.click();

  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    let uploadCount = 0;
    let hasError = false;

    for (const file of files) {
      try {
        const result = await uploadPhoto(file, albumName);
        if (result) {
          uploadCount++;
        }
      } catch (error) {
        console.error('Upload failed for:', file.name, error);
        hasError = true;
        // Continue with next file instead of stopping
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show feedback to user
    if (uploadCount > 0) {
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${uploadCount} of ${files.length} photos${hasError ? '. Some uploads failed.' : '.'}`,
        variant: hasError ? "destructive" : "default",
      });
    } else {
      toast({
        title: "Upload Failed",
        description: "No photos were uploaded successfully",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (confirm("Delete this photo?")) {
      await deletePhoto(photoId, albumName);
    }
  };

  const getPhotoUrl = (photo: Photo) => {
    // Assuming the backend serves static files from /uploads
    return `${API_BASE_URL}/uploads/${photo.path}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => loadPhotos(albumName)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1">{Array.isArray(photos) ? photos.length : 0} Photos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFilesSelected}
              />
              <Button size="sm" variant="default" onClick={onUploadClick} disabled={loading}>
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Uploading..." : "Upload Photos"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>Edit Album</Button>
            </div>
          </div>

          {/* Grid of photos */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading photos...</div>
            </div>
          ) : !Array.isArray(photos) || photos.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">No photos in this album yet</div>
                <Button onClick={onUploadClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload your first photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <Card
                  key={photo.id}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={getPhotoUrl(photo)}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2">
                      <h3 className="text-white font-semibold text-lg px-4 text-center">
                        {photo.filename}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {new Date(photo.uploadedAt || new Date()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;