import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as { id: number; email: string };
    
    // Get user from token
    const userRepository = Users.getRepository(AppDataSource);
    const user = await userRepository.findOne({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
