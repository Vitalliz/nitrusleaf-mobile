import { getSupabase } from "@/services/supabase";
import type { Relatorio, CreateRelatorioRequest, UpdateRelatorioRequest } from "@/types/relatorio";
import { readCreatedUpdated } from "@/utils/postgresRow";

type DbRelatorioRow = Record<string, unknown> & {
  id_relatorio: number;
  id_pe: number | null;
  id_foto: number | null;
  deficiencia_cobre: number | boolean;
  deficiencia_manganes: number | boolean;
  outros: number | boolean;
  observacoes: string | null;
  data_analise: string;
};

function asBool(v: number | boolean): boolean {
  if (typeof v === "boolean") return v;
  return v === 1;
}

function mapRelatorio(row: DbRelatorioRow): Relatorio {
  const ts = readCreatedUpdated(row);
  return {
    id: String(row.id_relatorio),
    peId: row.id_pe ? String(row.id_pe) : undefined,
    fotoId: row.id_foto ? String(row.id_foto) : undefined,
    deficienciaCobre: asBool(row.deficiencia_cobre),
    deficienciaManganes: asBool(row.deficiencia_manganes),
    outros: asBool(row.outros),
    observacoes: row.observacoes ?? undefined,
    dataAnalise: row.data_analise,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createRelatorio(params: CreateRelatorioRequest): Promise<Relatorio> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("relatorios")
    .insert({
      id_pe: params.peId ? Number(params.peId) : null,
      id_foto: params.fotoId ? Number(params.fotoId) : null,
      deficiencia_cobre: Boolean(params.deficienciaCobre),
      deficiencia_manganes: Boolean(params.deficienciaManganes),
      outros: Boolean(params.outros),
      observacoes: params.observacoes ?? null,
      data_analise: params.dataAnalise,
    })
    .select("*")
    .single();

  throwIfError(error);
  if (!data) throw new Error("Falha ao criar relatório.");
  return mapRelatorio(data as DbRelatorioRow);
}

export async function getRelatoriosByPe(peId: string): Promise<Relatorio[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("relatorios")
    .select("*")
    .eq("id_pe", Number(peId))
    .order("id_relatorio", { ascending: false });

  throwIfError(error);
  return (data as DbRelatorioRow[]).map(mapRelatorio);
}

export async function getRelatorioById(id: string): Promise<Relatorio | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("relatorios")
    .select("*")
    .eq("id_relatorio", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapRelatorio(data as DbRelatorioRow) : null;
}

export async function updateRelatorio(id: string, params: UpdateRelatorioRequest): Promise<void> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {};

  if (params.deficienciaCobre !== undefined) {
    patch.deficiencia_cobre = params.deficienciaCobre;
  }
  if (params.deficienciaManganes !== undefined) {
    patch.deficiencia_manganes = params.deficienciaManganes;
  }
  if (params.outros !== undefined) patch.outros = params.outros;
  if (params.observacoes !== undefined) patch.observacoes = params.observacoes;
  if (params.dataAnalise !== undefined) patch.data_analise = params.dataAnalise;

  if (Object.keys(patch).length === 0) return;
  patch.updatedat = new Date().toISOString();

  const { error } = await supabase
    .from("relatorios")
    .update(patch)
    .eq("id_relatorio", Number(id));

  throwIfError(error);
}

export async function deleteRelatorio(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("relatorios")
    .delete()
    .eq("id_relatorio", Number(id));

  throwIfError(error);
}
