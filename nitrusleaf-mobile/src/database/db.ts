import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

let _db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (_db) return _db;
  _db = openDatabaseSync("Nitrusleaf_PI.db");
  return _db;
}

