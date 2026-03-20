const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'sql_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      hashed_password TEXT,
      google_id TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      }
    });
  }
});

module.exports = db;
