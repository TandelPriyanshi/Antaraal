import { Router } from 'express';
import {
  uploadPhoto,
  getPhotosByFolder,
  getUserFolders,
  createFolder,
  deletePhoto
} from '../controllers/photo.controller';
import { upload, handleMulterError } from '../middleware/multer.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All photo routes require authentication
router.use(authMiddleware);

// Upload photo to a specific folder
router.post(
  '/upload',
  (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  uploadPhoto
);

// Get photos by folder
router.get('/folder/:folder', getPhotosByFolder);

// Get all folders for user
router.get('/folders', getUserFolders);

// Create new folder
router.post('/folders', createFolder);

// Delete photo
router.delete('/:photoId', deletePhoto);

export default router;
