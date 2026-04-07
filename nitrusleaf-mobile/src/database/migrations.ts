import { getDb } from "./db";

/**
 * Migração inicial em SQLite baseada no `schema.sql` (MySQL/MariaDB).
 * Criamos todas as tabelas necessárias para o sistema.
 */
export async function migrate(): Promise<void> {
  const db = getDb();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      foto_perfil TEXT,
      nome TEXT NOT NULL,
      sobrenome TEXT,
      email TEXT NOT NULL UNIQUE,
      login TEXT,
      senha TEXT NOT NULL,
      telefone TEXT,
      celular TEXT,
      tipo_pessoa TEXT NOT NULL DEFAULT 'fisica' CHECK (tipo_pessoa IN ('fisica', 'juridica')),
      cpf TEXT,
      cep TEXT,
      cnpj TEXT,
      nome_fantasia TEXT,
      logradouro TEXT,
      numero TEXT,
      bairro TEXT,
      cidade TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS propriedades (
      id_propriedade INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER,
      nome TEXT NOT NULL,
      cep TEXT NOT NULL,
      logradouro TEXT NOT NULL,
      numero INTEGER NOT NULL,
      bairro TEXT NOT NULL,
      cidade TEXT NOT NULL,
      talhoes_registrados INTEGER DEFAULT 0,
      total_pes INTEGER DEFAULT 0,
      pes_analisados INTEGER DEFAULT 0,
      pes_diagnosticados INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL,
      regiao TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS alqueires (
      id_alqueire INTEGER PRIMARY KEY AUTOINCREMENT,
      id_propriedade INTEGER NOT NULL,
      nome TEXT NOT NULL,
      area_total REAL,
      latitude REAL,
      longitude REAL,
      coordenadas_poligono TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_propriedade) REFERENCES propriedades (id_propriedade) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS talhoes (
      id_talhao INTEGER PRIMARY KEY AUTOINCREMENT,
      id_propriedade INTEGER,
      id_alqueire INTEGER,
      nome TEXT NOT NULL,
      especie_fruta TEXT NOT NULL,
      total_pes INTEGER DEFAULT 0,
      pes_analisados INTEGER DEFAULT 0,
      pes_diagnosticados INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL,
      coordenadas_poligono TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_propriedade) REFERENCES propriedades (id_propriedade) ON DELETE CASCADE,
      FOREIGN KEY (id_alqueire) REFERENCES alqueires (id_alqueire) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS pes (
      id_pe INTEGER PRIMARY KEY AUTOINCREMENT,
      id_talhao INTEGER,
      nome TEXT NOT NULL,
      situacao TEXT DEFAULT 'Sem-informações' CHECK (situacao IN ('Tratado', 'Não-Tratado', 'Sem-informações')),
      deficiencia_cobre INTEGER DEFAULT 0,
      deficiencia_manganes INTEGER DEFAULT 0,
      outros INTEGER DEFAULT 0,
      observacoes TEXT,
      latitude REAL,
      longitude REAL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_talhao) REFERENCES talhoes (id_talhao) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foto (
      id_foto INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pe INTEGER,
      id_talhao INTEGER,
      url TEXT NOT NULL,
      data_tiragem TEXT,
      resultado_analise TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_pe) REFERENCES pes (id_pe) ON DELETE CASCADE,
      FOREIGN KEY (id_talhao) REFERENCES talhoes (id_talhao) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS relatorios (
      id_relatorio INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pe INTEGER,
      id_foto INTEGER,
      deficiencia_cobre INTEGER DEFAULT 0,
      deficiencia_manganes INTEGER DEFAULT 0,
      outros INTEGER DEFAULT 0,
      observacoes TEXT,
      data_analise TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_pe) REFERENCES pes (id_pe) ON DELETE CASCADE,
      FOREIGN KEY (id_foto) REFERENCES foto (id_foto) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS historico (
      id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
      id_talhao TEXT NOT NULL,
      descricao TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS histal (
      id_pe INTEGER PRIMARY KEY AUTOINCREMENT,
      id_talhao INTEGER,
      nome TEXT NOT NULL,
      situacao TEXT NOT NULL CHECK (situacao IN ('Tratado', 'Não tratado', 'Sem informações')),
      data_criacao TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (id_talhao) REFERENCES talhoes (id_talhao)
    );

    CREATE TABLE IF NOT EXISTS deficiencia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      p TEXT NOT NULL,
      s INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS home (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    CREATE INDEX IF NOT EXISTS idx_propriedades_usuario ON propriedades(id_usuario);
    CREATE INDEX IF NOT EXISTS idx_alqueires_propriedade ON alqueires(id_propriedade);
    CREATE INDEX IF NOT EXISTS idx_talhoes_propriedade ON talhoes(id_propriedade);
    CREATE INDEX IF NOT EXISTS idx_talhoes_alqueire ON talhoes(id_alqueire);
    CREATE INDEX IF NOT EXISTS idx_pes_talhao ON pes(id_talhao);
    CREATE INDEX IF NOT EXISTS idx_foto_pe ON foto(id_pe);
    CREATE INDEX IF NOT EXISTS idx_foto_talhao ON foto(id_talhao);
    CREATE INDEX IF NOT EXISTS idx_relatorios_pe ON relatorios(id_pe);
    CREATE INDEX IF NOT EXISTS idx_relatorios_foto ON relatorios(id_foto);
  `);

  // Adicionar colunas se não existirem (para compatibilidade)
  try {
    await db.execAsync(`ALTER TABLE usuarios ADD COLUMN cpf TEXT;`);
  } catch {
    // ignora
  }
}

