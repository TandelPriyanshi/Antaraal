import dotenv from 'dotenv';

dotenv.config();

interface Config {
  database: {
    database: string; // SQLite database file path
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  server: {
    port: number;
    env: string;
  };
  upload: {
    dir: string;
    maxSize: number;
  };
}

export const config: Config = {
  // Database Configuration
  database: {
    database: process.env.DB_DATABASE || './database/antaraal.sqlite',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5002'),
    env: process.env.NODE_ENV || 'development',
  },

  // File Upload Configuration
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
};
