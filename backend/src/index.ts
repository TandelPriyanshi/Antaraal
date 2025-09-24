import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/config';
import * as path from 'path';
import { initializeDatabase } from './data-source';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import journalEntryRoutes from './routes/journalentry.routes';
import profileRoutes from './routes/profile.routes';
import { protectAllRoutes } from './middleware/protectAllRoutes.middleware';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug route to check file access (add this before auth middleware)
app.use('/debug', (req, res, next) => {
  console.log('Debug request:', req.path);
  next();
});

// Serve static files from uploads directory (before auth middleware)
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Serving static files from:', uploadsPath);

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  console.log('Uploads directory does not exist, creating it...');
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Add middleware to log static file requests
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', req.path);
  next();
});

// Serve static files
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, path) => {
    console.log('Serving file:', path);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'no-cache');
  },
  fallthrough: false
}));

// Handle 404 for static files
app.use('/uploads', (req, res) => {
  const fullPath = path.join(uploadsPath, req.path);
  console.error('Static file not found:', {
    requestedPath: req.path,
    fullPath,
    exists: fs.existsSync(fullPath),
    isDirectory: fs.existsSync(fullPath) ? fs.lstatSync(fullPath).isDirectory() : false
  });
  res.status(404).json({
    error: 'File not found',
    path: req.path,
    fullPath
  });
});

// Test route to verify file access
app.get('/debug/uploads/:filename', (req: Request, res: Response) => {
  const fs = require('fs');
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, 'profile', filename);
  
  console.log('Looking for file at:', filePath);
  
  try {
    if (fs.existsSync(filePath)) {
      console.log('File found, sending...');
      return res.sendFile(filePath);
    }
    
    // If file not found, check directory
    const dirPath = path.join(uploadsPath, 'profile');
    const dirExists = fs.existsSync(dirPath);
    const files = dirExists ? fs.readdirSync(dirPath) : [];
    
    console.log('Directory exists:', dirExists);
    if (dirExists) {
      console.log('Files in directory:', files);
    }
    
    res.status(404).json({
      error: 'File not found',
      path: filePath,
      dirExists,
      files
    });
  } catch (error) {
    console.error('Error accessing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
});

// Apply protectAllRoutes middleware to all routes (after static files)
app.use(protectAllRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal-entries', journalEntryRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('✅ Connected to database');
    
    // Use the configured port (5002)
    const port = config.server.port;
    
    // Start HTTP server
    const server = app.listen(port, () => {
      logger.info(`🚀 Server is running on port ${port}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.server.port} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

