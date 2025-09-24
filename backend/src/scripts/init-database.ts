import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/config';

const DATABASE_DIR = path.dirname(config.database.database);

try {
  // Create database directory if it doesn't exist
  if (!fs.existsSync(DATABASE_DIR)) {
    fs.mkdirSync(DATABASE_DIR, { recursive: true });
    console.log(`Created database directory: ${DATABASE_DIR}`);
  } else {
    console.log(`Database directory already exists: ${DATABASE_DIR}`);
  }

  // Create empty SQLite database file if it doesn't exist
  const dbPath = config.database.database;
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log(`Created SQLite database file: ${dbPath}`);
  } else {
    console.log(`SQLite database file already exists: ${dbPath}`);
  }

  console.log('Database initialization completed successfully');
} catch (error) {
  console.error('Error during database initialization:', error);
  process.exit(1);
}
