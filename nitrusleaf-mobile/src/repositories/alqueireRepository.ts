import { getSupabase } from "@/services/supabase";
import type { Alqueire, CreateAlqueireRequest, UpdateAlqueireRequest } from "@/types/alqueire";
import { readCreatedUpdated } from "@/utils/postgresRow";

type DbAlqueireRow = Record<string, unknown> & {
  id_alqueire: number;
  id_propriedade: number;
  nome: string;
  area_total: number | null;
  latitude: number | null;
  longitude: number | null;
  coordenadas_poligono: string | null;
};

function mapAlqueire(row: DbAlqueireRow): Alqueire {
  const ts = readCreatedUpdated(row);
  return {
    id: String(row.id_alqueire),
    propertyId: String(row.id_propriedade),
    name: row.nome,
    areaTotal: row.area_total ?? undefined,
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

export async function createAlqueire(params: CreateAlqueireRequest): Promise<Alqueire> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("alqueires")
    .insert({
      id_propriedade: Number(params.propertyId),
      nome: params.name,
      area_total: params.areaTotal ?? null,
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      coordenadas_poligono: params.coordenadasPoligono ?? null,
    })
    .select("*")
    .single();

  throwIfError(error);
  if (!data) throw new Error("Falha ao criar alqueire.");
  return mapAlqueire(data as DbAlqueireRow);
}

export async function getAlqueiresByProperty(propertyId: string): Promise<Alqueire[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("alqueires")
    .select("*")
    .eq("id_propriedade", Number(propertyId))
    .order("id_alqueire", { ascending: false });

  throwIfError(error);
  return (data as DbAlqueireRow[]).map(mapAlqueire);
}

export async function getAlqueireById(id: string): Promise<Alqueire | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("alqueires")
    .select("*")
    .eq("id_alqueire", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapAlqueire(data as DbAlqueireRow) : null;
}

export async function updateAlqueire(id: string, params: UpdateAlqueireRequest): Promise<void> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {};

  if (params.name !== undefined) patch.nome = params.name;
  if (params.areaTotal !== undefined) patch.area_total = params.areaTotal;
  if (params.latitude !== undefined) patch.latitude = params.latitude;
  if (params.longitude !== undefined) patch.longitude = params.longitude;
  if (params.coordenadasPoligono !== undefined) {
    patch.coordenadas_poligono = params.coordenadasPoligono;
  }

  if (Object.keys(patch).length === 0) return;
  patch.updatedat = new Date().toISOString();

  const { error } = await supabase
    .from("alqueires")
    .update(patch)
    .eq("id_alqueire", Number(id));

  throwIfError(error);
}

export async function deleteAlqueire(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("alqueires")
    .delete()
    .eq("id_alqueire", Number(id));

  throwIfError(error);
}
