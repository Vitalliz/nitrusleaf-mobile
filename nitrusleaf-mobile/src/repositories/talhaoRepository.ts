import { getSupabase } from "@/services/supabase";
import type { Talhao, CreateTalhaoRequest, UpdateTalhaoRequest } from "@/types/talhao";
import { readCreatedUpdated } from "@/utils/postgresRow";

type DbTalhaoRow = Record<string, unknown> & {
  id_talhao: number;
  id_propriedade: number;
  id_alqueire: number | null;
  nome: string;
  especie_fruta: string;
  latitude: number | null;
  longitude: number | null;
  coordenadas_poligono: string | null;
};

function mapTalhao(row: DbTalhaoRow): Talhao {
  const ts = readCreatedUpdated(row);
  return {
    id: String(row.id_talhao),
    propertyId: String(row.id_propriedade),
    alqueireId: row.id_alqueire ? String(row.id_alqueire) : undefined,
    name: row.nome,
    especieFruta: row.especie_fruta,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    coordenadasPoligono: row.coordenadas_poligono ?? undefined,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createTalhao(params: CreateTalhaoRequest): Promise<Talhao> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("talhoes")
    .insert({
      id_propriedade: Number(params.propertyId),
      id_alqueire: params.alqueireId ? Number(params.alqueireId) : null,
      nome: params.name,
      especie_fruta: params.especieFruta,
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      coordenadas_poligono: params.coordenadasPoligono ?? null,
    })
    .select("*")
    .single();

  throwIfError(error);
  if (!data) throw new Error("Falha ao criar talhão.");
  return mapTalhao(data as DbTalhaoRow);
}

export async function getTalhoesByProperty(propertyId: string): Promise<Talhao[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("talhoes")
    .select("*")
    .eq("id_propriedade", Number(propertyId))
    .order("id_talhao", { ascending: false });

  throwIfError(error);
  return (data as DbTalhaoRow[]).map(mapTalhao);
}

export async function getTalhaoById(id: string): Promise<Talhao | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("talhoes")
    .select("*")
    .eq("id_talhao", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapTalhao(data as DbTalhaoRow) : null;
}

export async function updateTalhao(id: string, params: UpdateTalhaoRequest): Promise<void> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {};

  if (params.alqueireId !== undefined) {
    patch.id_alqueire = params.alqueireId ? Number(params.alqueireId) : null;
  }
  if (params.name !== undefined) patch.nome = params.name;
  if (params.especieFruta !== undefined) patch.especie_fruta = params.especieFruta;
  if (params.latitude !== undefined) patch.latitude = params.latitude;
  if (params.longitude !== undefined) patch.longitude = params.longitude;
  if (params.coordenadasPoligono !== undefined) {
    patch.coordenadas_poligono = params.coordenadasPoligono;
  }

  if (Object.keys(patch).length === 0) return;
  patch.updatedat = new Date().toISOString();

  const { error } = await supabase
    .from("talhoes")
    .update(patch)
    .eq("id_talhao", Number(id));

  throwIfError(error);
}

export async function deleteTalhao(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("talhoes").delete().eq("id_talhao", Number(id));

  throwIfError(error);
}
