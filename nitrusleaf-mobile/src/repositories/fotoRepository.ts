import { getSupabase } from "@/services/supabase";
import type { Foto, CreateFotoRequest, UpdateFotoRequest } from "@/types/foto";
import { readCreatedUpdated } from "@/utils/postgresRow";

/**
 * Compatível com schema MySQL (`url`, `data_tiragem`, `resultado_analise`) e
 * com colunas alternativas (`caminho_foto`, `data_foto`, `tipo`) se existirem no Supabase.
 */
type DbFotoRow = Record<string, unknown> & {
  id_foto: number;
  id_pe: number;
  caminho_foto?: string | null;
  url?: string | null;
  data_foto?: string | null;
  data_tiragem?: string | null;
  tipo?: string | null;
  resultado_analise?: string | null;
};

function mapFoto(row: DbFotoRow): Foto {
  const ts = readCreatedUpdated(row);
  const caminho =
    row.caminho_foto ?? row.url ?? "";
  const data =
    row.data_foto ?? row.data_tiragem ?? "";
  const tipo =
    row.tipo ?? row.resultado_analise ?? "";
  return {
    id: String(row.id_foto),
    peId: String(row.id_pe),
    caminhoFoto: caminho,
    dataFoto: data,
    tipo,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createFoto(params: CreateFotoRequest): Promise<Foto> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("foto")
    .insert({
      id_pe: Number(params.peId),
      url: params.caminhoFoto,
      data_tiragem: params.dataFoto,
      resultado_analise: params.tipo,
    })
    .select("*")
    .single();

  throwIfError(error);
  if (!data) throw new Error("Failed to create foto");
  return mapFoto(data as DbFotoRow);
}

export async function getFotosByPe(peId: string): Promise<Foto[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("foto")
    .select("*")
    .eq("id_pe", Number(peId))
    .order("id_foto", { ascending: false });

  throwIfError(error);
  return (data as DbFotoRow[]).map(mapFoto);
}

export async function getFotoById(id: string): Promise<Foto | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("foto")
    .select("*")
    .eq("id_foto", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapFoto(data as DbFotoRow) : null;
}

export async function updateFoto(id: string, params: UpdateFotoRequest): Promise<Foto> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {
    updatedat: new Date().toISOString(),
  };

  if (params.caminhoFoto !== undefined) patch.url = params.caminhoFoto;
  if (params.dataFoto !== undefined) patch.data_tiragem = params.dataFoto;
  if (params.tipo !== undefined) patch.resultado_analise = params.tipo;

  const { error } = await supabase.from("foto").update(patch).eq("id_foto", Number(id));

  throwIfError(error);

  const updated = await getFotoById(id);
  if (!updated) throw new Error("Failed to update foto");

  return updated;
}

export async function deleteFoto(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("foto").delete().eq("id_foto", Number(id));

  throwIfError(error);
}
