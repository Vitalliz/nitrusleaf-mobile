import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("Nitrusleaf_PI.db");

export async function testDatabaseConnection() {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);

    await db.runAsync(`INSERT INTO test (name) VALUES (?)`, ["Conexao OK"]);

    const rows = await db.getAllAsync(`SELECT * FROM test`);

    if (rows.length > 0) {
      return "Conexão com SQLite funcionando!";
    }

    return "Tabela criada, mas sem dados.";
  } catch (e: any) {
    return "Erro: " + e.message;
  }
}
