const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path - now in the same directory as the script
const dbPath = path.join(__dirname, 'antaraal.sqlite');

console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// First, let's see what tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err.message);
    db.close();
    return;
  }

  console.log('Tables in database:', tables.map(t => t.name));

  // Get schema for users table
  db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
      console.error('Error getting user table schema:', err.message);
      db.close();
      return;
    }

    console.log('\nUsers table schema:');
    columns.forEach(col => {
      console.log(`- ${col.name} (${col.type}) ${col.pk ? 'PRIMARY KEY' : ''} ${col.notnull ? 'NOT NULL' : ''}`);
    });

    // Query to get all users with available columns
    const availableColumns = columns.map(col => col.name);
    const selectColumns = availableColumns.filter(col => !['password', 'emailVerificationToken', 'emailVerificationExpires'].includes(col));

    db.all(`SELECT ${selectColumns.join(', ')} FROM users`, [], (err, rows) => {
      if (err) {
        console.error('Error querying users:', err.message);
        db.close();
        return;
      }

      if (rows.length === 0) {
        console.log('No users found in the database.');
        db.close();
        return;
      }

      console.log('\nExisting users:');
      console.log('ID | Email | Username | Created | Profile Pic | Verified');
      console.log('-'.repeat(60));
      rows.forEach(row => {
        console.log(`${row.id} | ${row.email} | ${row.username} | ${row.createdAt ? row.createdAt.split('T')[0] : 'N/A'} | ${row.profilePic || 'None'} | ${row.isEmailVerified ? 'Yes' : 'No'}`);
      });

      // Get user ID to delete from command line argument
      const userId = parseInt(process.argv[2]);

      if (isNaN(userId)) {
        console.log('\nUsage: node database/delete-user-simple.js <user_id>');
        console.log('Example: node database/delete-user-simple.js 1');
        db.close();
        return;
      }

      const userToDelete = rows.find(row => row.id === userId);

      if (!userToDelete) {
        console.log(`\nUser with ID ${userId} not found.`);
        db.close();
        return;
      }

      console.log(`\nAttempting to delete user: ${userToDelete.username} (${userToDelete.email})`);

      // Delete the user
      db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
          console.error('Error deleting user:', err.message);
        } else {
          console.log(`User "${userToDelete.username}" has been successfully deleted.`);
          console.log(`Deleted ${this.changes} user(s).`);
        }

        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed.');
          }
        });
      });
    });
  });
});
