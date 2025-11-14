import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Abre ou cria o banco de dados.
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("nitrusleaf.db");
  return db;
};

/**
 * Cria uma tabela com SQL fornecido.
 */
export const createTable = async (sql: string): Promise<void> => {
  const database = await openDatabase();

  try {
    await database.execAsync(sql);
  } catch (error) {
    console.error("Erro ao criar tabela:", error);
    throw new Error("Falha ao criar tabela");
  }
};

/**
 * Remove tabela se existir.
 */
export const dropTable = async (tableName: string): Promise<void> => {
  const database = await openDatabase();

  try {
    await database.execAsync(`DROP TABLE IF EXISTS ${tableName}`);
  } catch (error) {
    console.error("Erro ao excluir tabela:", error);
    throw new Error("Falha ao excluir tabela");
  }
};
