import { getDb } from "@/database/db";
import type { Alqueire, CreateAlqueireRequest, UpdateAlqueireRequest } from "@/types/alqueire";

type DbAlqueireRow = {
  id_alqueire: number;
  id_propriedade: number;
  nome: string;
  area_total: number | null;
  latitude: number | null;
  longitude: number | null;
  coordenadas_poligono: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapAlqueire(row: DbAlqueireRow): Alqueire {
  return {
    id: String(row.id_alqueire),
    propertyId: String(row.id_propriedade),
    name: row.nome,
    areaTotal: row.area_total ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    coordenadasPoligono: row.coordenadas_poligono ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createAlqueire(params: CreateAlqueireRequest): Promise<Alqueire> {
  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO alqueires (id_propriedade, nome, area_total, latitude, longitude, coordenadas_poligono) VALUES (?, ?, ?, ?, ?, ?);`,
    [
      Number(params.propertyId),
      params.name,
      params.areaTotal ?? null,
      params.latitude ?? null,
      params.longitude ?? null,
      params.coordenadasPoligono ?? null,
    ]
  );

  const row = await db.getFirstAsync<DbAlqueireRow>(
    `SELECT * FROM alqueires WHERE id_alqueire = ?;`,
    [result.lastInsertRowId]
  );

  if (!row) throw new Error("Falha ao criar alqueire.");
  return mapAlqueire(row);
}

export async function getAlqueiresByProperty(propertyId: string): Promise<Alqueire[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbAlqueireRow>(
    `SELECT * FROM alqueires WHERE id_propriedade = ? ORDER BY createdAt DESC;`,
    [Number(propertyId)]
  );

  return rows.map(mapAlqueire);
}

export async function getAlqueireById(id: string): Promise<Alqueire | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbAlqueireRow>(
    `SELECT * FROM alqueires WHERE id_alqueire = ?;`,
    [Number(id)]
  );

  return row ? mapAlqueire(row) : null;
}

export async function updateAlqueire(id: string, params: UpdateAlqueireRequest): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push("nome = ?");
    values.push(params.name);
  }
  if (params.areaTotal !== undefined) {
    updates.push("area_total = ?");
    values.push(params.areaTotal);
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
    `UPDATE alqueires SET ${updates.join(", ")} WHERE id_alqueire = ?;`,
    values
  );
}

export async function deleteAlqueire(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM alqueires WHERE id_alqueire = ?;`,
    [Number(id)]
  );
}