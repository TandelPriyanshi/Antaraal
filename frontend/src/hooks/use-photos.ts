import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export interface Photo {
  id: number;
  filename: string;
  path: string;
  folder: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
}

export interface PhotoUploadResult {
  id: number;
  filename: string;
  folder: string;
  path: string;
  size: number;
  uploadedAt: string;
}

export const usePhotos = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user folders
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.photos.getUserFolders();

      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else if (response.data !== undefined) {
        // The handleResponse function returns the entire API response as 'data'
        // We need to access the 'data' field from the response object
        const apiResponse = response.data as { data?: string[] } & Record<string, any>;
        const foldersData = apiResponse?.data || [];
        const foldersArray = Array.isArray(foldersData) ? foldersData : [];
        console.log('Setting folders:', foldersArray);
        setFolders(foldersArray);
      } else {
        console.log('No data in response');
        setFolders([]);
      }
    } catch (err) {
      const errorMessage = 'Failed to load folders';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load photos for a specific folder
  const loadPhotos = useCallback(async (folderName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.photos.getPhotosByFolder(folderName);

      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else if (response.data) {
        // The API response has structure: { success, message, data, timestamp }
        // We need to extract the actual photos array from response.data.data
        const apiResponse = response.data as { data?: any[] } & Record<string, any>;
        const photosData = apiResponse?.data || [];
        const photosArray = Array.isArray(photosData) ? photosData : [];
        setPhotos(photosArray);
      }
    } catch (err) {
      const errorMessage = 'Failed to load photos';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Upload a photo
  const uploadPhoto = useCallback(async (file: File, folder: string = 'New Folder'): Promise<PhotoUploadResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('folder', folder);

      const response = await api.photos.uploadPhoto(formData);

      if (response.error) {
        setError(response.error);
        toast({
          title: "Upload Failed",
          description: response.error,
          variant: "destructive",
        });
        return null;
      } else if (response.data) {
        toast({
          title: "Success",
          description: `Photo "${response.data.filename}" uploaded successfully`,
        });

        // Refresh folders and photos
        await loadFolders();
        if (folder !== 'New Folder') {
          await loadPhotos(folder);
        }

        return response.data;
      }

      return null;
    } catch (err) {
      const errorMessage = 'Failed to upload photo';
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, loadFolders, loadPhotos]);

  // Create a new folder
  const createFolder = async (folderName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.photos.createFolder(folderName);

      if (response.error) {
        setError(response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return false;
      } else {
        toast({
          title: "Success",
          description: `Folder "${folderName}" created successfully`,
        });

        // Refresh folders
        await loadFolders();
        return true;
      }
    } catch (err) {
      const errorMessage = 'Failed to create folder';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a photo
  const deletePhoto = useCallback(async (photoId: number, folderName?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.photos.deletePhoto(photoId);

      if (response.error) {
        setError(response.error);
        toast({
          title: "Delete Failed",
          description: response.error,
          variant: "destructive",
        });
        return false;
      } else {
        toast({
          title: "Success",
          description: "Photo deleted successfully",
        });

        // Refresh photos if folder is specified
        if (folderName) {
          await loadPhotos(folderName);
        }
        return true;
      }
    } catch (err) {
      const errorMessage = 'Failed to delete photo';
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, loadPhotos]);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  return {
    folders,
    photos,
    loading,
    error,
    loadFolders,
    loadPhotos,
    uploadPhoto,
    createFolder,
    deletePhoto,
  };
};
