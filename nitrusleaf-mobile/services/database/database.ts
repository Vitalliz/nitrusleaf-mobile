import * as SQLite from 'expo-sqlite';

// Conexão
export const db = SQLite.openDatabaseSync('Nitrusleaf_PI');

// Criação das tabelas
export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        user_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });
}

// Query de exemplo
export function getUsers(callback: (rows: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM users",
      [],
      (_: any, result: { rows: { _array: any[]; }; }) => callback(result.rows._array),
      (_: any, error: any) => { console.log(error); return false; }
    );
  });
}
