import { getDb } from "@/database/db";
import type { Property, CreatePropertyRequest, UpdatePropertyRequest } from "@/types/property";

type DbPropertyRow = {
  id_propriedade: number;
  id_usuario: number;
  nome: string;
  cep: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  talhoes_registrados: number;
  total_pes: number;
  pes_analisados: number;
  pes_diagnosticados: number;
  latitude: number | null;
  longitude: number | null;
  regiao: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapProperty(row: DbPropertyRow): Property {
  return {
    id: String(row.id_propriedade),
    userId: String(row.id_usuario),
    name: row.nome,
    cep: row.cep,
    logradouro: row.logradouro,
    numero: row.numero,
    bairro: row.bairro,
    cidade: row.cidade,
    talhoesRegistrados: row.talhoes_registrados,
    totalPes: row.total_pes,
    pesAnalisados: row.pes_analisados,
    pesDiagnosticados: row.pes_diagnosticados,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    regiao: row.regiao ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createProperty(params: CreatePropertyRequest): Promise<Property> {
  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO propriedades (id_usuario, nome, cep, logradouro, numero, bairro, cidade, latitude, longitude, regiao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      Number(params.userId),
      params.name,
      params.cep,
      params.logradouro,
      params.numero,
      params.bairro,
      params.cidade,
      params.latitude ?? null,
      params.longitude ?? null,
      params.regiao ?? null,
    ]
  );

  const row = await db.getFirstAsync<DbPropertyRow>(
    `SELECT * FROM propriedades WHERE id_propriedade = ?;`,
    [result.lastInsertRowId]
  );

  if (!row) throw new Error("Falha ao criar propriedade.");
  return mapProperty(row);
}

export async function getPropertiesByUser(userId: string): Promise<Property[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbPropertyRow>(
    `SELECT * FROM propriedades WHERE id_usuario = ? ORDER BY createdAt DESC;`,
    [Number(userId)]
  );

  return rows.map(mapProperty);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbPropertyRow>(
    `SELECT * FROM propriedades WHERE id_propriedade = ?;`,
    [Number(id)]
  );

  return row ? mapProperty(row) : null;
}

export async function updateProperty(id: string, params: UpdatePropertyRequest): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push("nome = ?");
    values.push(params.name);
  }
  if (params.cep !== undefined) {
    updates.push("cep = ?");
    values.push(params.cep);
  }
  if (params.logradouro !== undefined) {
    updates.push("logradouro = ?");
    values.push(params.logradouro);
  }
  if (params.numero !== undefined) {
    updates.push("numero = ?");
    values.push(params.numero);
  }
  if (params.bairro !== undefined) {
    updates.push("bairro = ?");
    values.push(params.bairro);
  }
  if (params.cidade !== undefined) {
    updates.push("cidade = ?");
    values.push(params.cidade);
  }
  if (params.latitude !== undefined) {
    updates.push("latitude = ?");
    values.push(params.latitude);
  }
  if (params.longitude !== undefined) {
    updates.push("longitude = ?");
    values.push(params.longitude);
  }
  if (params.regiao !== undefined) {
    updates.push("regiao = ?");
    values.push(params.regiao);
  }

  if (updates.length === 0) return;

  updates.push("updatedAt = datetime('now')");
  values.push(Number(id));

  await db.runAsync(
    `UPDATE propriedades SET ${updates.join(", ")} WHERE id_propriedade = ?;`,
    values
  );
}

export async function deleteProperty(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM propriedades WHERE id_propriedade = ?;`,
    [Number(id)]
  );
}

export async function updatePropertyStats(id: string, stats: {
  talhoesRegistrados?: number;
  totalPes?: number;
  pesAnalisados?: number;
  pesDiagnosticados?: number;
}): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (stats.talhoesRegistrados !== undefined) {
    updates.push("talhoes_registrados = ?");
    values.push(stats.talhoesRegistrados);
  }
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
    `UPDATE propriedades SET ${updates.join(", ")} WHERE id_propriedade = ?;`,
    values
  );
}