import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Photo } from '../entities/photo.entity';
import { Users } from '../entities/user.entity';
import { ApiResponse } from '../utils/response';
import * as fs from 'fs';
import * as path from 'path';

const photoRepository = AppDataSource.getRepository(Photo);
const userRepository = AppDataSource.getRepository(Users);

// Ensure upload directories exist
const ensureUserDirectory = (userId: number): string => {
  const userDir = path.join(__dirname, '../../uploads', userId.toString());
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
};

const ensureFolderDirectory = (userId: number, folderName: string): string => {
  const userDir = ensureUserDirectory(userId);
  const folderDir = path.join(userDir, folderName);
  if (!fs.existsSync(folderDir)) {
    fs.mkdirSync(folderDir, { recursive: true });
  }
  return folderDir;
};

const ensureDefaultFolder = (userId: number): void => {
  ensureFolderDirectory(userId, 'New Folder');
};

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }

    const { folder = 'New Folder' } = req.body;
    const file = (req as any).file;

    if (!file) {
      return ApiResponse.badRequest(res, 'No file uploaded');
    }

    // Ensure user directory and folder exist
    ensureUserDirectory(userId);
    ensureDefaultFolder(userId);
    const folderDir = ensureFolderDirectory(userId, folder);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${timestamp}`;
    const filePath = path.join(folderDir, uniqueFilename);

    // Move file from temp location to final location
    fs.renameSync(file.path, filePath);

    // Save photo metadata to database
    const photo = new Photo();
    photo.filename = file.originalname;
    photo.path = path.relative(path.join(__dirname, '../../uploads'), filePath);
    photo.folder = folder;
    photo.userId = userId;
    photo.size = file.size;
    photo.mimetype = file.mimetype;

    const savedPhoto = await photoRepository.save(photo);

    ApiResponse.success(res, 'Photo uploaded successfully', {
      id: savedPhoto.id,
      filename: savedPhoto.filename,
      folder: savedPhoto.folder,
      path: savedPhoto.path,
      size: savedPhoto.size,
      uploadedAt: savedPhoto.uploadedAt
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    ApiResponse.internalError(res, 'Error uploading photo');
  }
};

export const getPhotosByFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }

    const { folder = 'New Folder' } = req.params;

    // Decode URL-encoded folder name
    const decodedFolder = decodeURIComponent(folder);

    const photos = await photoRepository.find({
      where: { userId, folder: decodedFolder },
      order: { uploadedAt: 'DESC' }
    });

    ApiResponse.success(res, 'Photos retrieved successfully', photos);

  } catch (error) {
    console.error('Get photos error:', error);
    ApiResponse.internalError(res, 'Error retrieving photos');
  }
};

export const getUserFolders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }

    // Get folders from database (photos)
    const photos = await photoRepository.find({
      where: { userId },
      select: ['folder']
    });

    const dbFolders = [...new Set(photos.map(photo => photo.folder))];

    // Get folders from filesystem
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    let fsFolders: string[] = [];

    if (fs.existsSync(userDir)) {
      const items = fs.readdirSync(userDir);
      fsFolders = items.filter(item => {
        const itemPath = path.join(userDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
    }

    // Combine folders from database and filesystem
    const allFolders = [...new Set([...dbFolders, ...fsFolders])].sort();

    // Ensure "New Folder" exists
    if (!allFolders.includes('New Folder')) {
      allFolders.unshift('New Folder');
    }

    ApiResponse.success(res, 'Folders retrieved successfully', allFolders);

  } catch (error) {
    console.error('Get folders error:', error);
    ApiResponse.internalError(res, 'Error retrieving folders');
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }

    const { folderName } = req.body;

    if (!folderName || folderName.trim() === '') {
      return ApiResponse.badRequest(res, 'Folder name is required');
    }

    const trimmedFolderName = folderName.trim();

    // Check if folder already exists in database
    const existingPhoto = await photoRepository.findOne({
      where: { userId, folder: trimmedFolderName }
    });

    // Check if folder already exists in filesystem
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    const folderExistsInFS = fs.existsSync(path.join(userDir, trimmedFolderName));

    if (existingPhoto || folderExistsInFS) {
      return ApiResponse.conflict(res, 'Folder already exists');
    }

    // Ensure the folder directory exists
    ensureUserDirectory(userId);
    ensureFolderDirectory(userId, trimmedFolderName);

    ApiResponse.success(res, 'Folder created successfully', { folderName: trimmedFolderName });

  } catch (error) {
    console.error('Create folder error:', error);
    ApiResponse.internalError(res, 'Error creating folder');
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }

    const { photoId } = req.params;

    const photo = await photoRepository.findOne({
      where: { id: parseInt(photoId), userId }
    });

    if (!photo) {
      return ApiResponse.notFound(res, 'Photo not found');
    }

    // Delete file from filesystem
    const fullPath = path.join(__dirname, '../../uploads', photo.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from database
    await photoRepository.remove(photo);

    ApiResponse.success(res, 'Photo deleted successfully');

  } catch (error) {
    console.error('Delete photo error:', error);
    ApiResponse.internalError(res, 'Error deleting photo');
  }
};
