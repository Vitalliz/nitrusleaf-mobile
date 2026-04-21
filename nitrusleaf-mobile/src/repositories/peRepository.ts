import { getSupabase } from "@/services/supabase";
import type { Pe, CreatePeRequest, UpdatePeRequest, SituacaoPe } from "@/types/pe";
import { readCreatedUpdated } from "@/utils/postgresRow";

const DEFAULT_SITUACAO: SituacaoPe = "Sem-informações";

function validateCreatePeRequest(params: CreatePeRequest): void {
  if (!params.talhaoId || typeof params.talhaoId !== "string") {
    throw new Error("ID do talhão é obrigatório e deve ser uma string");
  }
  if (!params.nome || typeof params.nome !== "string" || params.nome.trim().length === 0) {
    throw new Error("Nome do pé é obrigatório");
  }
  if (
    params.situacao &&
    !["Tratado", "Não-Tratado", "Sem-informações"].includes(params.situacao)
  ) {
    throw new Error("Situação inválida");
  }
  if (params.latitude !== undefined && (typeof params.latitude !== "number" || params.latitude < -90 || params.latitude > 90)) {
    throw new Error("Latitude deve ser um número entre -90 e 90");
  }
  if (params.longitude !== undefined && (typeof params.longitude !== "number" || params.longitude < -180 || params.longitude > 180)) {
    throw new Error("Longitude deve ser um número entre -180 e 180");
  }
}

type DbPeRow = Record<string, unknown> & {
  id_pe: number;
  id_talhao: number;
  nome: string;
  situacao: string;
  deficiencia_cobre: boolean;
  deficiencia_manganes: boolean;
  outros: boolean;
  observacoes: string | null;
  latitude: number | null;
  longitude: number | null;
};

function mapPe(row: DbPeRow): Pe {
  const ts = readCreatedUpdated(row);
  return {
    id: String(row.id_pe),
    talhaoId: String(row.id_talhao),
    nome: row.nome,
    situacao: row.situacao as SituacaoPe,
    deficienciaCobre: Boolean(row.deficiencia_cobre),
    deficienciaManganes: Boolean(row.deficiencia_manganes),
    outros: Boolean(row.outros),
    observacoes: row.observacoes ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createPe(params: CreatePeRequest): Promise<Pe> {
  validateCreatePeRequest(params);

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("pes")
    .insert({
      id_talhao: Number(params.talhaoId),
      nome: params.nome.trim(),
      situacao: params.situacao ?? DEFAULT_SITUACAO,
      deficiencia_cobre: params.deficienciaCobre ?? false,
      deficiencia_manganes: params.deficienciaManganes ?? false,
      outros: params.outros ?? false,
      observacoes: params.observacoes ?? null,
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
    })
    .select("*")
    .single();

  throwIfError(error);
  if (!data) throw new Error("Falha ao criar pé.");
  return mapPe(data as DbPeRow);
}

export async function getPesByTalhao(talhaoId: string): Promise<Pe[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("pes")
    .select("*")
    .eq("id_talhao", Number(talhaoId))
    .order("id_pe", { ascending: false });

  throwIfError(error);
  return (data as DbPeRow[]).map(mapPe);
}

export async function getPeById(id: string): Promise<Pe | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("pes")
    .select("*")
    .eq("id_pe", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapPe(data as DbPeRow) : null;
}

export async function updatePe(id: string, params: UpdatePeRequest): Promise<Pe> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {};

  if (params.nome !== undefined) patch.nome = params.nome;
  if (params.situacao !== undefined) patch.situacao = params.situacao;
  if (params.deficienciaCobre !== undefined) {
    patch.deficiencia_cobre = params.deficienciaCobre;
  }
  if (params.deficienciaManganes !== undefined) {
    patch.deficiencia_manganes = params.deficienciaManganes;
  }
  if (params.outros !== undefined) patch.outros = params.outros;
  if (params.observacoes !== undefined) patch.observacoes = params.observacoes;
  if (params.latitude !== undefined) patch.latitude = params.latitude;
  if (params.longitude !== undefined) patch.longitude = params.longitude;

  if (Object.keys(patch).length === 0) {
    const cur = await getPeById(id);
    if (!cur) throw new Error("Pé não encontrado.");
    return cur;
  }
  patch.updatedat = new Date().toISOString();

  const { error } = await supabase.from("pes").update(patch).eq("id_pe", Number(id));

  throwIfError(error);

  const updated = await getPeById(id);
  if (!updated) throw new Error("Falha ao atualizar pé.");

  return updated;
}

export async function deletePe(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("pes").delete().eq("id_pe", Number(id));

  throwIfError(error);
}
