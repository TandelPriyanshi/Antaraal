import dotenv from 'dotenv';

dotenv.config();

interface Config {
  database: {
    type: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
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
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'antaraal',
    ssl: process.env.DB_SSL === 'true',
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
