import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('nitrusleaf.db');

export function initDB() {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field TEXT NOT NULL,
        nitrogen REAL,
        potassium REAL,
        calcium REAL,
        created_at TEXT
      );`
    );
  });
}

export default db;
