import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';
import { JournalEntry } from './entities/Journal.entity';
import { config } from './config/config';
import logger from './utils/logger';
import { Tags } from './entities/Tags.entity';
import { Conversation } from './entities/Conversation.entity';
import { Photo } from './entities/photo.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: config.database.ssl,
  synchronize: config.server.env === 'development',
  logging: config.server.env === 'development' ? 'all' : ['error'],
  logger: config.server.env === 'development' ? 'advanced-console' : 'file',
  entities: [Users, JournalEntry, Tags, Conversation, Photo],
  migrations: ['migrations/*.ts'],
  migrationsRun: true,
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info('PostgreSQL database connection established successfully', {
      database: config.database.database
    });
  } catch (error) {
    logger.error('Error during PostgreSQL database initialization:', error);
    process.exit(1);
  }
};