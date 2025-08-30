import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
};

export const BCRYPT_SALT_ROUNDS = 10;
