import { getDb } from "@/database/db";
import type { Pe, CreatePeRequest, UpdatePeRequest, SituacaoPe } from "@/types/pe";

function validateCreatePeRequest(params: CreatePeRequest): void {
  if (!params.talhaoId || typeof params.talhaoId !== 'string') {
    throw new Error('ID do talhão é obrigatório e deve ser uma string');
  }
  if (!params.identificacao || typeof params.identificacao !== 'string' || params.identificacao.trim().length === 0) {
    throw new Error('Identificação é obrigatória e deve ser uma string não vazia');
  }
  if (typeof params.linha !== 'number' || params.linha <= 0) {
    throw new Error('Linha deve ser um número positivo');
  }
  if (typeof params.coluna !== 'number' || params.coluna <= 0) {
    throw new Error('Coluna deve ser um número positivo');
  }
  if (params.situacao && !['Saudável', 'Doente', 'Morto'].includes(params.situacao)) {
    throw new Error('Situação deve ser uma das opções válidas');
  }
  if (params.dataPlantio && typeof params.dataPlantio !== 'string') {
    throw new Error('Data de plantio deve ser uma string');
  }
  if (params.latitude !== undefined && (typeof params.latitude !== 'number' || params.latitude < -90 || params.latitude > 90)) {
    throw new Error('Latitude deve ser um número entre -90 e 90');
  }
  if (params.longitude !== undefined && (typeof params.longitude !== 'number' || params.longitude < -180 || params.longitude > 180)) {
    throw new Error('Longitude deve ser um número entre -180 e 180');
  }
}

type DbPeRow = {
  id_pe: number;
  id_talhao: number;
  identificacao: string;
  linha: number;
  coluna: number;
  situacao: string;
  deficiencia_cobre: number;
  deficiencia_manganes: number;
  outros: number;
  observacoes: string | null;
  data_plantio: string;
  data_cadastro: string;
  data_ultima_analise: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
};

function mapPe(row: DbPeRow): Pe {
  return {
    id: String(row.id_pe),
    talhaoId: String(row.id_talhao),
    identificacao: row.identificacao,
    linha: row.linha,
    coluna: row.coluna,
    situacao: row.situacao as SituacaoPe,
    deficienciaCobre: row.deficiencia_cobre === 1,
    deficienciaManganes: row.deficiencia_manganes === 1,
    outros: row.outros === 1,
    observacoes: row.observacoes ?? undefined,
    dataPlantio: row.data_plantio,
    dataCadastro: row.data_cadastro,
    dataUltimaAnalise: row.data_ultima_analise ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createPe(params: CreatePeRequest): Promise<Pe> {
  validateCreatePeRequest(params);

  const db = getDb();

  const result = await db.runAsync(
    `INSERT INTO pes (id_talhao, identificacao, linha, coluna, situacao, deficiencia_cobre, deficiencia_manganes, outros, observacoes, data_plantio, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      Number(params.talhaoId),
      params.identificacao,
      params.linha,
      params.coluna,
      params.situacao ?? 'Saudável',
      params.deficienciaCobre ? 1 : 0,
      params.deficienciaManganes ? 1 : 0,
      params.outros ? 1 : 0,
      params.observacoes ?? null,
      params.dataPlantio,
      params.latitude ?? null,
      params.longitude ?? null,
    ]
  );

  const lastId = result.lastInsertRowId;
  const rows = await db.getAllAsync<DbPeRow>(
    'SELECT * FROM pes WHERE id_pe = ?;',
    [lastId]
  );

  if (rows.length === 0) {
    throw new Error('Failed to create pe');
  }

  return mapPe(rows[0] as DbPeRow);
}

export async function getPesByTalhao(talhaoId: string): Promise<Pe[]> {
  const db = getDb();

  const rows = await db.getAllAsync<DbPeRow>(
    `SELECT * FROM pes WHERE id_talhao = ? ORDER BY createdAt DESC;`,
    [Number(talhaoId)]
  );

  return rows.map(mapPe);
}

export async function getPeById(id: string): Promise<Pe | null> {
  const db = getDb();

  const row = await db.getFirstAsync<DbPeRow>(
    `SELECT * FROM pes WHERE id_pe = ?;`,
    [Number(id)]
  );

  return row ? mapPe(row) : null;
}

export async function updatePe(id: string, params: UpdatePeRequest): Promise<Pe> {
  const db = getDb();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.identificacao !== undefined) {
    updates.push('identificacao = ?');
    values.push(params.identificacao);
  }
  if (params.linha !== undefined) {
    updates.push('linha = ?');
    values.push(params.linha);
  }
  if (params.coluna !== undefined) {
    updates.push('coluna = ?');
    values.push(params.coluna);
  }
  if (params.situacao !== undefined) {
    updates.push('situacao = ?');
    values.push(params.situacao);
  }
  if (params.deficienciaCobre !== undefined) {
    updates.push('deficiencia_cobre = ?');
    values.push(params.deficienciaCobre ? 1 : 0);
  }
  if (params.deficienciaManganes !== undefined) {
    updates.push('deficiencia_manganes = ?');
    values.push(params.deficienciaManganes ? 1 : 0);
  }
  if (params.outros !== undefined) {
    updates.push('outros = ?');
    values.push(params.outros ? 1 : 0);
  }
  if (params.observacoes !== undefined) {
    updates.push('observacoes = ?');
    values.push(params.observacoes);
  }
  if (params.dataPlantio !== undefined) {
    updates.push('data_plantio = ?');
    values.push(params.dataPlantio);
  }
  if (params.latitude !== undefined) {
    updates.push('latitude = ?');
    values.push(params.latitude);
  }
  if (params.longitude !== undefined) {
    updates.push('longitude = ?');
    values.push(params.longitude);
  }

  updates.push('updatedAt = CURRENT_TIMESTAMP');

  const sql = `UPDATE pes SET ${updates.join(', ')} WHERE id_pe = ?;`;
  values.push(Number(id));

  await db.runAsync(sql, values);

  const updated = await getPeById(id);
  if (!updated) throw new Error('Failed to update pe');

  return updated;
}

export async function deletePe(id: string): Promise<void> {
  const db = getDb();

  await db.runAsync(
    `DELETE FROM pes WHERE id_pe = ?;`,
    [Number(id)]
  );
}