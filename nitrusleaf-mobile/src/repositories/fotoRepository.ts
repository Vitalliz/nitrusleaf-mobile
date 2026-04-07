import { getDb } from "@/database/db";
import type { Foto, CreateFotoRequest, UpdateFotoRequest } from "@/types/foto";

type DbFotoRow = {
  id_foto: number;
  id_pe: number;
  caminho_foto: string;
  data_foto: string;
  tipo: string;
  createdAt: string;
  updatedAt: string;
};

function mapFoto(row: DbFotoRow): Foto {
  return {
    id: String(row.id_foto),
    peId: String(row.id_pe),
    caminhoFoto: row.caminho_foto,
    dataFoto: row.data_foto,
    tipo: row.tipo,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createFoto(params: CreateFotoRequest): Promise<Foto> {
  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO foto (id_pe, caminho_foto, data_foto, tipo) VALUES (?, ?, ?, ?);`,
    [
      Number(params.peId),
      params.caminhoFoto,
      params.dataFoto,
      params.tipo,
    ]
  );

  const lastId = result.lastInsertRowId;
  const rows = await db.getAllAsync<DbFotoRow>(
    'SELECT * FROM foto WHERE id_foto = ?;',
    [lastId]
  );

  if (rows.length === 0) {
    throw new Error('Failed to create foto');
  }

  return mapFoto(rows[0] as DbFotoRow);
}

export async function getFotosByPe(peId: string): Promise<Foto[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbFotoRow>(
    `SELECT * FROM foto WHERE id_pe = ? ORDER BY createdAt DESC;`,
    [Number(peId)]
  );

  return rows.map(mapFoto);
}

export async function getFotoById(id: string): Promise<Foto | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbFotoRow>(
    `SELECT * FROM foto WHERE id_foto = ?;`,
    [Number(id)]
  );

  return row ? mapFoto(row) : null;
}

export async function updateFoto(id: string, params: UpdateFotoRequest): Promise<Foto> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.caminhoFoto !== undefined) {
    updates.push('caminho_foto = ?');
    values.push(params.caminhoFoto);
  }
  if (params.dataFoto !== undefined) {
    updates.push('data_foto = ?');
    values.push(params.dataFoto);
  }
  if (params.tipo !== undefined) {
    updates.push('tipo = ?');
    values.push(params.tipo);
  }

  updates.push('updatedAt = CURRENT_TIMESTAMP');

  const sql = `UPDATE foto SET ${updates.join(', ')} WHERE id_foto = ?;`;
  values.push(Number(id));

  await db.runAsync(sql, values);

  const updated = await getFotoById(id);
  if (!updated) throw new Error('Failed to update foto');

  return updated;
}

export async function deleteFoto(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM foto WHERE id_foto = ?;`,
    [Number(id)]
  );
}