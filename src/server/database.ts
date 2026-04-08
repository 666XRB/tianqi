import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function initDb() {
  db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS weatherdata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      record_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      weather_condition TEXT,
      temperature REAL,
      apparent_temperature REAL,
      humidity INTEGER,
      wind_scale REAL,
      visibility REAL
    );
  `);
  
  console.log('Database initialized');
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
