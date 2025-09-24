import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = path.join(__dirname, '../../uploads/profile');

try {
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`Created directory: ${UPLOADS_DIR}`);
  } else {
    console.log(`Directory already exists: ${UPLOADS_DIR}`);
  }
} catch (error) {
  console.error('Error setting up uploads directory:', error);
  process.exit(1);
}
