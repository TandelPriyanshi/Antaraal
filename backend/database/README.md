# Database User Management

This directory contains the SQLite database and user management scripts for the Antaraal application.

## Files:
- `antaraal.sqlite` - Main database file
- `delete-user-simple.js` - Script to delete users from the database

## Usage:

### Delete a User:
```bash
node database/delete-user-simple.js <user_id>
```

Example:
```bash
node database/delete-user-simple.js 1
```

This will:
1. Display all current users in the database
2. Delete the user with the specified ID
3. Confirm the deletion

## Current Users:
- ID 2: Priyanshi Tandel (tpiyu97@gmail.com)
- ID 4: Smruti (smruti300704@gmail.com)

## Database Schema:
- `users` table with columns: id, email, username, password, createdAt, profile_pic, is_email_verified, email_verification_token, email_verification_expires
- `journal_entries` table for user journal entries
- `tags` table for journal entry tags
