import { openDatabaseSync, type SQLiteDatabase, deleteDatabaseSync } from "expo-sqlite";

let _db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (_db) return _db;
  _db = openDatabaseSync("Nitrusleaf_PI.db");
  return _db;
}

export function resetDb(): void {
  if (_db) {
    _db.closeSync();
    _db = null;
  }
  try {
    deleteDatabaseSync("Nitrusleaf_PI.db");
  } catch (error) {
    console.log('Banco não existia ou erro ao deletar:', error);
  }
  // Força recriação
  _db = openDatabaseSync("Nitrusleaf_PI.db");
}

