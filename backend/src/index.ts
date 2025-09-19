import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/config';
import { initializeDatabase } from './data-source';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import journalEntryRoutes from './routes/journalentry.routes';
import { protectAllRoutes } from './middleware/protectAllRoutes.middleware';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply protectAllRoutes middleware to all routes
app.use(protectAllRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal-entries', journalEntryRoutes);

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

