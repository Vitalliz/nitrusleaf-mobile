import { getDb } from "@/database/db";

type UsuarioRow = {
  id_usuario: number;
  nome: string;
  sobrenome: string | null;
  email: string;
  telefone: string | null;
  celular: string | null;
  cpf: string | null;
  data_nascimento: string | null;
};

export type UsuarioDetails = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
};

function mapRow(row: UsuarioRow): UsuarioDetails {
  const last = row.sobrenome ? ` ${row.sobrenome}` : "";
  return {
    id: String(row.id_usuario),
    fullName: `${row.nome}${last}`.trim(),
    email: row.email,
    phone: row.telefone ?? row.celular ?? undefined,
    cpf: row.cpf ?? undefined,
    birthDate: row.data_nascimento ?? undefined,
  };
}

export async function getUsuarioDetails(
  id_usuario: string
): Promise<UsuarioDetails | null> {
  const db = getDb();
  const row = await db.getFirstAsync<UsuarioRow>(
    `
      SELECT
        id_usuario,
        nome,
        sobrenome,
        email,
        telefone,
        celular,
        cpf,
        data_nascimento
      FROM usuarios
      WHERE id_usuario = ?;
    `,
    [Number(id_usuario)]
  );

  if (!row) return null;
  return mapRow(row);
}

export async function updateUsuarioDetails(
  id_usuario: string,
  payload: {
    fullName: string;
    email: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
  }
): Promise<void> {
  const db = getDb();

  const trimmedName = payload.fullName.trim();
  const [nome, ...rest] = trimmedName.split(/\s+/);
  const sobrenome = rest.length ? rest.join(" ") : null;

  await db.runAsync(
    `
      UPDATE usuarios
      SET
        nome = ?,
        sobrenome = ?,
        email = ?,
        telefone = ?,
        cpf = ?,
        data_nascimento = ?,
        updatedAt = datetime('now')
      WHERE id_usuario = ?;
    `,
    [
      nome || trimmedName,
      sobrenome,
      payload.email.trim().toLowerCase(),
      payload.phone ?? null,
      payload.cpf ?? null,
      payload.birthDate ?? null,
      Number(id_usuario),
    ]
  );
}

