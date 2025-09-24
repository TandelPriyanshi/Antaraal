import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/user.entity';
import { ProfileService } from '../services/profile.service';
import { authMiddleware } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        [key: string]: any;
      };
    }
  }
}

interface MulterFile extends Express.Multer.File {
  buffer: Buffer;
}

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Update profile picture
router.post(
  '/upload-picture',
  authMiddleware,
  upload.single('profilePicture'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const userId = req.user.id;

      const filePath = await ProfileService.updateProfilePicture(userId, req.file as MulterFile);
      
      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        filePath,
      });
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to upload profile picture',
      });
    }
  }
);

// Get user profile
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;

    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'profilePic', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

export default router;
