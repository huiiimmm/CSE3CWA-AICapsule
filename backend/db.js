const Database = require('better-sqlite3');
const dbPath = process.env.DB_PATH || './database.db';
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS capsules (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id           TEXT NOT NULL,
    project_name      TEXT NOT NULL,
    prompt_title      TEXT NOT NULL,
    prompt_version    TEXT,
    prompt_text       TEXT NOT NULL,
    response_summary  TEXT,
    category          TEXT,
    usefulness        TEXT,
    reviewed          INTEGER DEFAULT 0,
    improved          INTEGER DEFAULT 0,
    screenshot_url    TEXT,
    notes             TEXT,
    created_at        TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const seedCount = db.prepare('SELECT COUNT(*) AS count FROM capsules').get().count;

if (seedCount === 0) {
  const insert = db.prepare(`
    INSERT INTO capsules
      (user_id, project_name, prompt_title, prompt_version, prompt_text, response_summary, category, usefulness, reviewed, improved, screenshot_url, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('123456', 'SmartFarm Irrigation', 'Debug cloud deployment', 'v1',
    'Why does my Node server fail to start on Render?',
    'Check your start command and PORT env var.',
    'Coding', 'Good', 1, 1, 'https://example.com/screenshot1.png', 'Tested and worked');

  insert.run('123456', 'AI Capsule', 'Generate JWT middleware', 'v2',
    'Write an Express middleware that verifies a JWT from a cookie.',
    'Provided jwt.verify example with error handling.',
    'Coding', 'Good', 1, 0, null, 'Needs error message cleanup');

  insert.run('123456', 'CSE3CWA Essay', 'Improve intro paragraph', 'v1',
    'Rewrite this introduction to sound more academic.',
    'Suggested restructuring for clarity.',
    'Writing', 'Needs Improvement', 0, 0, null, 'Still reviewing suggestion');

  console.log('Seeded initial capsule records.');
}

console.log(`SQLite Database successfully connected at: ${dbPath}`);

module.exports = db;
