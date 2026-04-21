import { getSupabase } from "@/services/supabase";
import type { Property, CreatePropertyRequest, UpdatePropertyRequest } from "@/types/property";
import { readCreatedUpdated } from "@/utils/postgresRow";

type DbPropertyRow = Record<string, unknown> & {
  id_propriedade: number;
  id_usuario: number;
  nome: string;
  cep: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  latitude: number | null;
  longitude: number | null;
  regiao: string | null;
};

function mapProperty(row: DbPropertyRow): Property {
  const ts = readCreatedUpdated(row);
  return {
    id: String(row.id_propriedade),
    userId: String(row.id_usuario),
    name: row.nome,
    cep: row.cep,
    logradouro: row.logradouro,
    numero: row.numero,
    bairro: row.bairro,
    cidade: row.cidade,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    regiao: row.regiao ?? undefined,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/** Colunas existentes na tabela (sem timestamps CamelCase que o PostgREST não encontra no PG). */
const PROP_COLUMNS =
  "id_propriedade, id_usuario, nome, cep, logradouro, numero, bairro, cidade, latitude, longitude, regiao";

export async function createProperty(params: CreatePropertyRequest): Promise<Property> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("propriedades")
    .insert({
      id_usuario: Number(params.userId),
      nome: params.name,
      cep: params.cep,
      logradouro: params.logradouro,
      numero: params.numero,
      bairro: params.bairro,
      cidade: params.cidade,
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      regiao: params.regiao ?? null,
    })
    .select(PROP_COLUMNS)
    .single();

  throwIfError(error);
  if (!data) throw new Error("Falha ao criar propriedade.");
  return mapProperty(data as DbPropertyRow);
}

export async function getPropertiesByUser(userId: string): Promise<Property[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("propriedades")
    .select(PROP_COLUMNS)
    .eq("id_usuario", Number(userId))
    .order("id_propriedade", { ascending: false });

  throwIfError(error);
  return (data as DbPropertyRow[]).map(mapProperty);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("propriedades")
    .select(PROP_COLUMNS)
    .eq("id_propriedade", Number(id))
    .maybeSingle();

  throwIfError(error);
  return data ? mapProperty(data as DbPropertyRow) : null;
}

export async function updateProperty(id: string, params: UpdatePropertyRequest): Promise<void> {
  const supabase = getSupabase();

  const patch: Record<string, unknown> = {};

  if (params.name !== undefined) patch.nome = params.name;
  if (params.cep !== undefined) patch.cep = params.cep;
  if (params.logradouro !== undefined) patch.logradouro = params.logradouro;
  if (params.numero !== undefined) patch.numero = params.numero;
  if (params.bairro !== undefined) patch.bairro = params.bairro;
  if (params.cidade !== undefined) patch.cidade = params.cidade;
  if (params.latitude !== undefined) patch.latitude = params.latitude;
  if (params.longitude !== undefined) patch.longitude = params.longitude;
  if (params.regiao !== undefined) patch.regiao = params.regiao;

  if (Object.keys(patch).length === 0) return;
  patch.updatedat = new Date().toISOString();

  const { error } = await supabase
    .from("propriedades")
    .update(patch)
    .eq("id_propriedade", Number(id));

  throwIfError(error);
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("propriedades")
    .delete()
    .eq("id_propriedade", Number(id));

  throwIfError(error);
}
