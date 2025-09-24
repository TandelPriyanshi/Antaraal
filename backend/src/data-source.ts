import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';
import { JournalEntry } from './entities/Journal.entity';
import { config } from './config/config';
import logger from './utils/logger';
import { Tags } from './entities/Tags.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database.database, // This will be the SQLite file path
  synchronize: config.server.env === 'development',
  logging: config.server.env === 'development' ? 'all' : ['error'],
  logger: config.server.env === 'development' ? 'advanced-console' : 'file',
  entities: [Users, JournalEntry, Tags],
  migrations: [],
  subscribers: [],
});

// Enhanced connection with better error handling
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established successfully', {
      database: config.database.database
    });
  } catch (error) {
    logger.error('Error during database initialization:', error);
    process.exit(1);
  }
};

