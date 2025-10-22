import multer from 'multer';
import { Request } from 'express';
import * as path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Files will be temporarily stored here before being moved to user-specific folders
    const tempDir = path.join(__dirname, '../../uploads/temp');
    cb(null, tempDir);
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${timestamp}_${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer with limits
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

// Error handling middleware for multer
export const handleMulterError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
        timestamp: new Date().toISOString()
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed.',
        timestamp: new Date().toISOString()
      });
    }
  }

  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed.',
      timestamp: new Date().toISOString()
    });
  }

  next(error);
};
