/**
 * SQLite Database Layer (via sql.js WebAssembly engine)
 * Persists data to ./data/cyberbullying.sqlite
 * Manages users, posts, comments, moderation_logs, and notifications.
 */

import fs from 'fs';
import path from 'path';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cyberbullying.sqlite');

let db: SqlJsDatabase | null = null;

// Helper to save sqlite database to disk
function saveDatabase() {
  if (!db) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to save SQLite database to disk:', err);
  }
}

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  initSchema(db);
  seedInitialData(db);
  saveDatabase();

  return db;
}

function initSchema(database: SqlJsDatabase) {
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      bio TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      likes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      prediction TEXT NOT NULL,
      confidence REAL NOT NULL,
      moderation_status TEXT NOT NULL,
      language TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS moderation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      prediction TEXT NOT NULL,
      confidence REAL NOT NULL,
      moderation_action TEXT NOT NULL,
      language TEXT NOT NULL,
      detected_categories TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

function seedInitialData(database: SqlJsDatabase) {
  // Check if users already seeded
  const userCheck = database.exec("SELECT COUNT(*) as count FROM users");
  const count = userCheck[0]?.values[0]?.[0] as number || 0;
  if (count > 0) return;

  const adminHash = bcrypt.hashSync('Admin@1234', 10);
  const userHash = bcrypt.hashSync('User@1234', 10);

  // 1. Seed Users
  database.run(`
    INSERT INTO users (full_name, username, email, password_hash, avatar_url, bio, role) VALUES
    ('Dr. S. Ramanathan', 'admin_ramanathan', 'admin@cyberdefense.ai', '${adminHash}', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Professor & AI Ethics Lead | B.Sc AI & DS Project Mentor', 'admin'),
    ('Ananya Sharma', 'ananya_ai', 'ananya@student.college.edu', '${userHash}', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Final Year B.Sc. AI & DS | NLP Researcher & Tech Enthusiast', 'user'),
    ('Karthik Kumar', 'karthik_tn', 'karthik@student.college.edu', '${userHash}', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Tamil NLP Enthusiast | Code & Cyber Ethics', 'user'),
    ('Priya Sundaram', 'priya_dev', 'priya@student.college.edu', '${userHash}', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Full Stack Developer | AI Safety Advocate', 'user')
  `);

  // 2. Seed Posts
  database.run(`
    INSERT INTO posts (user_id, content, image_url, likes_count, created_at) VALUES
    (2, 'Thrilled to present our final year project on "Intelligent Cyber Bullying Detection"! We designed a multilingual NLP engine supporting English, Tamil script, and Tanglish. Here is our research setup.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', 28, '2026-10-06 09:30:00'),
    (3, 'Tamil and Tanglish social media text poses unique challenges for machine learning due to phonetic variations and code-mixing. Proud to share our curated dataset of 2,400+ balanced annotations!', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', 19, '2026-10-06 14:15:00'),
    (1, 'Safe digital spaces are not a luxury—they are a necessity. Our students are pioneering ethical AI pipelines with transparent confidence scoring and human-in-the-loop audit trails.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', 42, '2026-10-07 01:20:00')
  `);

  // 3. Seed Comments
  database.run(`
    INSERT INTO comments (post_id, user_id, content, prediction, confidence, moderation_status, language, created_at) VALUES
    (1, 3, 'semma project bro, all the best for the final review!', 'safe', 0.94, 'approved', 'Tanglish', '2026-10-06 10:12:00'),
    (1, 4, 'Congratulations Ananya! The architecture diagram looks super crisp.', 'safe', 0.96, 'approved', 'English', '2026-10-06 10:45:00'),
    (2, 2, 'இந்த ஆய்வு மிகவும் பயனுள்ளதாக இருக்கும், அருமையான முயற்சி கார்த்திக்!', 'safe', 0.95, 'approved', 'Tamil', '2026-10-06 15:00:00')
  `);

  // 4. Seed Moderation Logs (realistic mix for Admin Dashboard)
  database.run(`
    INSERT INTO moderation_logs (comment_id, user_id, content, prediction, confidence, moderation_action, language, detected_categories, created_at) VALUES
    (1, 3, 'semma project bro, all the best for the final review!', 'safe', 0.94, 'allow', 'Tanglish', '[]', '2026-10-06 10:12:00'),
    (2, 4, 'Congratulations Ananya! The architecture diagram looks super crisp.', 'safe', 0.96, 'allow', 'English', '[]', '2026-10-06 10:45:00'),
    (3, 2, 'இந்த ஆய்வு மிகவும் பயனுள்ளதாக இருக்கும், அருமையான முயற்சி கார்த்திக்!', 'safe', 0.95, 'allow', 'Tamil', '[]', '2026-10-06 15:00:00'),
    (NULL, 3, 'You are an absolute idiot, delete your useless project right now.', 'bullying', 0.89, 'warning', 'English', '["insult","harassment"]', '2026-10-06 17:22:00'),
    (NULL, 4, 'un moonjiya mirror la paathurukkiya, dummy piece.', 'bullying', 0.88, 'warning', 'Tanglish', '["body_shaming","insult"]', '2026-10-06 18:05:00'),
    (NULL, 2, 'I will find where you live and beat you to death.', 'severe_bullying', 0.98, 'block', 'English', '["threat"]', '2026-10-06 19:40:00'),
    (NULL, 3, 'உன்னை கொன்று புதைத்து விடுவேன், எச்சரிக்கையாக இரு.', 'severe_bullying', 0.97, 'block', 'Tamil', '["threat"]', '2026-10-06 20:15:00'),
    (NULL, 4, 'Super work team, very inspiring writeup!', 'safe', 0.96, 'allow', 'English', '[]', '2026-10-07 02:10:00')
  `);

  // 5. Seed Notifications
  database.run(`
    INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
    (2, 'Comment Moderation Approved', 'Your comment on Post #2 passed real-time AI safety checks (Confidence: 95%).', 'safe', 0, '2026-10-06 15:00:00'),
    (2, 'Moderation Alert', 'A comment directed at your post was blocked for community guidelines violation.', 'blocked', 0, '2026-10-06 19:40:00'),
    (1, 'System Health Check', 'ML Model latency average: 18ms. Multilingual NLP pipeline operational.', 'info', 1, '2026-10-07 00:00:00')
  `);
}

export function commitDb() {
  saveDatabase();
}
