import { openDatabaseSync } from "expo-sqlite";

export const db = openDatabaseSync("NitrusLeaf_PI.db");

// Criando tabelas adaptadas do MySQL para SQLite
await db.execAsync(`

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  foto_perfil TEXT,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  telefone TEXT,
  celular TEXT,
  tipo_pessoa TEXT CHECK(tipo_pessoa IN ('fisica','juridica')),
  cpf TEXT,
  cep TEXT,
  cnpj TEXT,
  nome_fantasia TEXT,
  logradouro TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT
);

CREATE TABLE IF NOT EXISTS propriedades (
  id_propriedade INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER,
  nome TEXT NOT NULL,
  talhoes_registrados INTEGER DEFAULT 0,
  total_pes INTEGER DEFAULT 0,
  pes_analisados INTEGER DEFAULT 0,
  pes_diagnosticados INTEGER DEFAULT 0,
  FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS talhoes (
  id_talhao INTEGER PRIMARY KEY AUTOINCREMENT,
  id_propriedade INTEGER,
  nome TEXT NOT NULL,
  especie_fruta TEXT NOT NULL,
  FOREIGN KEY(id_propriedade) REFERENCES propriedades(id_propriedade)
);

CREATE TABLE IF NOT EXISTS pes (
  id_pe INTEGER PRIMARY KEY AUTOINCREMENT,
  id_talhao INTEGER,
  nome TEXT NOT NULL,
  situacao TEXT CHECK(situacao IN ('tratado','nao tratado','sem informacoes')),
  FOREIGN KEY(id_talhao) REFERENCES talhoes(id_talhao)
);

CREATE TABLE IF NOT EXISTS foto (
  id_foto INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pe INTEGER,
  id_talhao INTEGER,
  url TEXT NOT NULL,
  data_tiragem TEXT,
  resultado_analise TEXT,
  FOREIGN KEY(id_pe) REFERENCES pes(id_pe),
  FOREIGN KEY(id_talhao) REFERENCES talhoes(id_talhao)
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
  FOREIGN KEY(id_pe) REFERENCES pes(id_pe),
  FOREIGN KEY(id_foto) REFERENCES foto(id_foto)
);

`);
