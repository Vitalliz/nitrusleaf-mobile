import { getDb } from "./db";

/**
 * Migração inicial em SQLite baseada no `schema.sql` (MySQL/MariaDB).
 * Aqui criamos apenas o subconjunto necessário para autenticação (usuarios).
 * As demais tabelas do dump ficam em `src/db/schema.sql` para próximos passos.
 */
export async function migrate(): Promise<void> {
  const db = getDb();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sobrenome TEXT,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      telefone TEXT,
      celular TEXT,
      cpf TEXT,
      data_nascimento TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
  `);

  // Se a tabela já existia sem a coluna cpf, tenta adicioná-la
  try {
    await db.execAsync(`ALTER TABLE usuarios ADD COLUMN cpf TEXT;`);
  } catch {
    // ignora erro de coluna já existente
  }

  // E, se já existir sem data_nascimento, tenta adicionar também
  try {
    await db.execAsync(`ALTER TABLE usuarios ADD COLUMN data_nascimento TEXT;`);
  } catch {
    // ignora erro de coluna já existente
  }
}

