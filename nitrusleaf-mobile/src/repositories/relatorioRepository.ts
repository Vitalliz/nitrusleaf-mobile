import { getDb } from "@/database/db";
import type { Relatorio, CreateRelatorioRequest, UpdateRelatorioRequest } from "@/types/relatorio";

type DbRelatorioRow = {
  id_relatorio: number;
  id_pe: number | null;
  id_foto: number | null;
  deficiencia_cobre: number;
  deficiencia_manganes: number;
  outros: number;
  observacoes: string | null;
  data_analise: string;
  createdAt: string;
  updatedAt: string;
};

function mapRelatorio(row: DbRelatorioRow): Relatorio {
  return {
    id: String(row.id_relatorio),
    peId: row.id_pe ? String(row.id_pe) : undefined,
    fotoId: row.id_foto ? String(row.id_foto) : undefined,
    deficienciaCobre: Boolean(row.deficiencia_cobre),
    deficienciaManganes: Boolean(row.deficiencia_manganes),
    outros: Boolean(row.outros),
    observacoes: row.observacoes ?? undefined,
    dataAnalise: row.data_analise,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createRelatorio(params: CreateRelatorioRequest): Promise<Relatorio> {
  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO relatorios (id_pe, id_foto, deficiencia_cobre, deficiencia_manganes, outros, observacoes, data_analise) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      params.peId ? Number(params.peId) : null,
      params.fotoId ? Number(params.fotoId) : null,
      params.deficienciaCobre ? 1 : 0,
      params.deficienciaManganes ? 1 : 0,
      params.outros ? 1 : 0,
      params.observacoes ?? null,
      params.dataAnalise,
    ]
  );

  const row = await db.getFirstAsync<DbRelatorioRow>(
    `SELECT * FROM relatorios WHERE id_relatorio = ?;`,
    [result.lastInsertRowId]
  );

  if (!row) throw new Error("Falha ao criar relatório.");
  return mapRelatorio(row);
}

export async function getRelatoriosByPe(peId: string): Promise<Relatorio[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbRelatorioRow>(
    `SELECT * FROM relatorios WHERE id_pe = ? ORDER BY createdAt DESC;`,
    [Number(peId)]
  );

  return rows.map(mapRelatorio);
}

export async function getRelatorioById(id: string): Promise<Relatorio | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbRelatorioRow>(
    `SELECT * FROM relatorios WHERE id_relatorio = ?;`,
    [Number(id)]
  );

  return row ? mapRelatorio(row) : null;
}

export async function updateRelatorio(id: string, params: UpdateRelatorioRequest): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.deficienciaCobre !== undefined) {
    updates.push("deficiencia_cobre = ?");
    values.push(params.deficienciaCobre ? 1 : 0);
  }
  if (params.deficienciaManganes !== undefined) {
    updates.push("deficiencia_manganes = ?");
    values.push(params.deficienciaManganes ? 1 : 0);
  }
  if (params.outros !== undefined) {
    updates.push("outros = ?");
    values.push(params.outros ? 1 : 0);
  }
  if (params.observacoes !== undefined) {
    updates.push("observacoes = ?");
    values.push(params.observacoes);
  }
  if (params.dataAnalise !== undefined) {
    updates.push("data_analise = ?");
    values.push(params.dataAnalise);
  }

  if (updates.length === 0) return;

  updates.push("updatedAt = datetime('now')");
  values.push(Number(id));

  await db.runAsync(
    `UPDATE relatorios SET ${updates.join(", ")} WHERE id_relatorio = ?;`,
    values
  );
}

export async function deleteRelatorio(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM relatorios WHERE id_relatorio = ?;`,
    [Number(id)]
  );
}