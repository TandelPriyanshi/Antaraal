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

// Function to delete journal entry by ID
function deleteJournalEntry(journalId) {
  console.log(`\nAttempting to delete journal entry with ID: ${journalId}`);

  // Delete the journal entry directly (tags will be cascade deleted due to foreign key)
  db.run('DELETE FROM journal_entries WHERE id = ?', [journalId], function(err) {
    if (err) {
      console.error('Error deleting journal entry:', err.message);
    } else {
      console.log(`Journal entry ${journalId} has been successfully deleted.`);
      console.log(`Deleted ${this.changes} journal entry(s).`);
    }
  });
}

// Function to delete tag by ID
function deleteTag(tagId) {
  console.log(`\nAttempting to delete tag with ID: ${tagId}`);

  // Delete the tag directly
  db.run('DELETE FROM tags WHERE id = ?', [tagId], function(err) {
    if (err) {
      console.error('Error deleting tag:', err.message);
    } else {
      console.log(`Tag ${tagId} has been successfully deleted.`);
      console.log(`Deleted ${this.changes} tag(s).`);
    }
  });
}

// Function to list all journal entries
function listJournalEntries() {
  db.all('SELECT id, title, content, created_at FROM journal_entries ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error querying journal entries:', err.message);
      return;
    }

    if (rows.length === 0) {
      console.log('No journal entries found.');
      return;
    }

    console.log('\nExisting journal entries:');
    console.log('ID | Title | Content Preview | Created Date');
    console.log('-'.repeat(80));
    rows.forEach(row => {
      const contentPreview = row.content ? row.content.substring(0, 50) + '...' : 'No content';
      console.log(`${row.id} | ${row.title || 'Untitled'} | ${contentPreview} | ${row.created_at ? row.created_at.split('T')[0] : 'N/A'}`);
    });
  });
}

// Function to list all tags
function listTags() {
  db.all('SELECT id, tag_text, journal_id FROM tags ORDER BY tag_text', [], (err, rows) => {
    if (err) {
      console.error('Error querying tags:', err.message);
      return;
    }

    if (rows.length === 0) {
      console.log('No tags found.');
      return;
    }

    console.log('\nExisting tags:');
    console.log('ID | Tag Text | Journal ID');
    console.log('-'.repeat(35));
    rows.forEach(row => {
      console.log(`${row.id} | ${row.tag_text} | ${row.journal_id || 'N/A'}`);
    });
  });
}

// Main execution
db.serialize(() => {
  // First, let's see what tables exist
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err.message);
      db.close();
      return;
    }

    console.log('Tables in database:', tables.map(t => t.name));

    // Check if required tables exist
    const tableNames = tables.map(t => t.name);
    if (!tableNames.includes('journal_entries')) {
      console.error('journal_entries table not found!');
      db.close();
      return;
    }
    if (!tableNames.includes('tags')) {
      console.error('tags table not found!');
      db.close();
      return;
    }

    console.log('\nDatabase Schema:');
    console.log('- journal_entries: id, user_id, date, title, content, feeling, summary, created_at, updated_at');
    console.log('- tags: id, journal_id, tag_text');
    console.log('- Foreign Key: tags.journal_id -> journal_entries.id (CASCADE DELETE)');

    // List existing data
    listJournalEntries();
    listTags();

    // Get command line arguments
    const operation = process.argv[2];
    const id = parseInt(process.argv[3]);

    if (!operation || isNaN(id)) {
      console.log('\nUsage:');
      console.log('  node database/delete-journal-tag.js journal <journal_id>');
      console.log('  node database/delete-journal-tag.js tag <tag_id>');
      console.log('\nExamples:');
      console.log('  node database/delete-journal-tag.js journal 1');
      console.log('  node database/delete-journal-tag.js tag 2');
      db.close();
      return;
    }

    if (operation === 'journal') {
      // Verify journal entry exists
      db.get('SELECT id, title FROM journal_entries WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error checking journal entry:', err.message);
          db.close();
          return;
        }

        if (!row) {
          console.log(`\nJournal entry with ID ${id} not found.`);
          db.close();
          return;
        }

        console.log(`\nFound journal entry: "${row.title || 'Untitled'}"`);
        console.log('Note: Associated tags will be automatically deleted due to CASCADE DELETE.');
        deleteJournalEntry(id);
      });
    } else if (operation === 'tag') {
      // Verify tag exists
      db.get('SELECT id, tag_text FROM tags WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error checking tag:', err.message);
          db.close();
          return;
        }

        if (!row) {
          console.log(`\nTag with ID ${id} not found.`);
          db.close();
          return;
        }

        console.log(`\nFound tag: "${row.tag_text}"`);
        deleteTag(id);
      });
    } else {
      console.log('\nInvalid operation. Use "journal" or "tag"');
      console.log('\nUsage:');
      console.log('  node database/delete-journal-tag.js journal <journal_id>');
      console.log('  node database/delete-journal-tag.js tag <tag_id>');
      db.close();
      return;
    }

    // Close database after a delay to allow other operations to complete
    setTimeout(() => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('\nDatabase connection closed.');
        }
      });
    }, 1000);
  });
})});
