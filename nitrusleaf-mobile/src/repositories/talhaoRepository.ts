import { getDb } from "@/database/db";
import type { Talhao, CreateTalhaoRequest, UpdateTalhaoRequest } from "@/types/talhao";

type DbTalhaoRow = {
  id_talhao: number;
  id_propriedade: number;
  id_alqueire: number | null;
  nome: string;
  especie_fruta: string;
  total_pes: number;
  pes_analisados: number;
  pes_diagnosticados: number;
  latitude: number | null;
  longitude: number | null;
  coordenadas_poligono: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapTalhao(row: DbTalhaoRow): Talhao {
  return {
    id: String(row.id_talhao),
    propertyId: String(row.id_propriedade),
    alqueireId: row.id_alqueire ? String(row.id_alqueire) : undefined,
    name: row.nome,
    especieFruta: row.especie_fruta,
    totalPes: row.total_pes,
    pesAnalisados: row.pes_analisados,
    pesDiagnosticados: row.pes_diagnosticados,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    coordenadasPoligono: row.coordenadas_poligono ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createTalhao(params: CreateTalhaoRequest): Promise<Talhao> {
  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO talhoes (id_propriedade, id_alqueire, nome, especie_fruta, latitude, longitude, coordenadas_poligono) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      Number(params.propertyId),
      params.alqueireId ? Number(params.alqueireId) : null,
      params.name,
      params.especieFruta,
      params.latitude ?? null,
      params.longitude ?? null,
      params.coordenadasPoligono ?? null,
    ]
  );

  const row = await db.getFirstAsync<DbTalhaoRow>(
    `SELECT * FROM talhoes WHERE id_talhao = ?;`,
    [result.lastInsertRowId]
  );

  if (!row) throw new Error("Falha ao criar talhão.");
  return mapTalhao(row);
}

export async function getTalhoesByProperty(propertyId: string): Promise<Talhao[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbTalhaoRow>(
    `SELECT * FROM talhoes WHERE id_propriedade = ? ORDER BY createdAt DESC;`,
    [Number(propertyId)]
  );

  return rows.map(mapTalhao);
}

export async function getTalhaoById(id: string): Promise<Talhao | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbTalhaoRow>(
    `SELECT * FROM talhoes WHERE id_talhao = ?;`,
    [Number(id)]
  );

  return row ? mapTalhao(row) : null;
}

export async function updateTalhao(id: string, params: UpdateTalhaoRequest): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.alqueireId !== undefined) {
    updates.push("id_alqueire = ?");
    values.push(params.alqueireId ? Number(params.alqueireId) : null);
  }
  if (params.name !== undefined) {
    updates.push("nome = ?");
    values.push(params.name);
  }
  if (params.especieFruta !== undefined) {
    updates.push("especie_fruta = ?");
    values.push(params.especieFruta);
  }
  if (params.latitude !== undefined) {
    updates.push("latitude = ?");
    values.push(params.latitude);
  }
  if (params.longitude !== undefined) {
    updates.push("longitude = ?");
    values.push(params.longitude);
  }
  if (params.coordenadasPoligono !== undefined) {
    updates.push("coordenadas_poligono = ?");
    values.push(params.coordenadasPoligono);
  }

  if (updates.length === 0) return;

  updates.push("updatedAt = datetime('now')");
  values.push(Number(id));

  await db.runAsync(
    `UPDATE talhoes SET ${updates.join(", ")} WHERE id_talhao = ?;`,
    values
  );
}

export async function deleteTalhao(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM talhoes WHERE id_talhao = ?;`,
    [Number(id)]
  );
}

export async function updateTalhaoStats(id: string, stats: {
  totalPes?: number;
  pesAnalisados?: number;
  pesDiagnosticados?: number;
}): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (stats.totalPes !== undefined) {
    updates.push("total_pes = ?");
    values.push(stats.totalPes);
  }
  if (stats.pesAnalisados !== undefined) {
    updates.push("pes_analisados = ?");
    values.push(stats.pesAnalisados);
  }
  if (stats.pesDiagnosticados !== undefined) {
    updates.push("pes_diagnosticados = ?");
    values.push(stats.pesDiagnosticados);
  }

  if (updates.length === 0) return;

  updates.push("updatedAt = datetime('now')");
  values.push(Number(id));

  await db.runAsync(
    `UPDATE talhoes SET ${updates.join(", ")} WHERE id_talhao = ?;`,
    values
  );
}