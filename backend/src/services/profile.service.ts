import { AppDataSource } from '../data-source';
import { Users } from '../entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export class ProfileService {
  private static readonly UPLOAD_DIR = path.join(__dirname, '../../uploads/profile');
  private static readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  static async updateProfilePicture(userId: number, file: Express.Multer.File & { buffer: Buffer }): Promise<string> {
    // Validate file
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds the maximum limit of 5MB');
    }

    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomBytes(8).toString('hex')}${fileExt}`;
    const filePath = path.join(this.UPLOAD_DIR, filename);

    // Save file
    await fs.promises.writeFile(filePath, file.buffer);

    // Update user's profile picture in database
    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old profile picture if exists
    if (user.profilePic) {
      const oldFilePath = path.join(this.UPLOAD_DIR, path.basename(user.profilePic));
      if (fs.existsSync(oldFilePath)) {
        try {
          await fs.promises.unlink(oldFilePath);
        } catch (error) {
          console.error('Failed to delete old profile picture:', error);
        }
      }
    }

    // Save relative path in database
    const relativePath = `/uploads/profile/${filename}`;
    user.profilePic = relativePath;
    await userRepo.save(user);

    return relativePath;
  }

  static async getProfilePicture(userId: number): Promise<string | null> {
    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOneBy({ id: userId });
    return user?.profilePic || null;
  }
}
