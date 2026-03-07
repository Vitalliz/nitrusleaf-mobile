import * as Crypto from "expo-crypto";
import { migrate } from "@/database/migrations";
import { getDb } from "@/database/db";
import type { User } from "@/types/auth";

type DbUserRow = {
  id_usuario: number;
  nome: string;
  sobrenome: string | null;
  email: string;
  telefone: string | null;
  celular: string | null;
  cpf: string | null;
};

async function sha256(input: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
}

function mapUser(row: DbUserRow): User {
  const last = row.sobrenome ? ` ${row.sobrenome}` : "";
  return {
    id: String(row.id_usuario),
    name: `${row.nome}${last}`.trim(),
    email: row.email,
    phone: row.telefone ?? row.celular ?? undefined,
    cpf: row.cpf ?? undefined,
  };
}

let didMigrate = false;
async function ensureMigrated() {
  if (didMigrate) return;
  await migrate();
  didMigrate = true;
}

export async function registerLocal(params: {
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  password: string;
}): Promise<User> {
  await ensureMigrated();
  const db = getDb();

  const [nome, ...rest] = params.name.trim().split(/\s+/);
  const sobrenome = rest.length ? rest.join(" ") : null;

  const senha_hash = await sha256(params.password);

  await db.runAsync(
    `INSERT INTO usuarios (nome, sobrenome, email, senha_hash, telefone, celular, cpf) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      nome || params.name.trim(),
      sobrenome,
      params.email.trim().toLowerCase(),
      senha_hash,
      params.phone ?? null,
      null,
      params.cpf.trim(),
    ]
  );

  const row = await db.getFirstAsync<DbUserRow>(
    `SELECT id_usuario, nome, sobrenome, email, telefone, celular FROM usuarios WHERE email = ?;`,
    [params.email.trim().toLowerCase()]
  );

  if (!row) throw new Error("Falha ao criar usuário.");
  return mapUser(row);
}

export async function loginLocal(email: string, password: string): Promise<User> {
  await ensureMigrated();
  const db = getDb();

  const emailNorm = email.trim().toLowerCase();
  const senha_hash = await sha256(password);

  const row = await db.getFirstAsync<
    DbUserRow & { senha_hash: string }
  >(
    `SELECT id_usuario, nome, sobrenome, email, telefone, celular, senha_hash FROM usuarios WHERE email = ?;`,
    [emailNorm]
  );

  if (!row) throw new Error("Usuário não encontrado.");
  if (row.senha_hash !== senha_hash) throw new Error("Senha incorreta.");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { senha_hash: _ignored, ...safe } = row;
  return mapUser(safe);
}

export async function getUserByIdLocal(id_usuario: string): Promise<User | null> {
  await ensureMigrated();
  const db = getDb();

  const row = await db.getFirstAsync<DbUserRow>(
    `SELECT id_usuario, nome, sobrenome, email, telefone, celular FROM usuarios WHERE id_usuario = ?;`,
    [Number(id_usuario)]
  );

  return row ? mapUser(row) : null;
}

