import { getSupabase } from "@/services/supabase";

type UsuarioRow = {
  id_usuario: number;
  nome: string;
  sobrenome: string | null;
  email: string;
  telefone: string | null;
  celular: string | null;
  cpf: string | null;
  data_nascimento: string | null;
};

export type UsuarioDetails = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
};

function mapRow(row: UsuarioRow): UsuarioDetails {
  const sobrenome = row.sobrenome ?? "";
  const last = sobrenome ? ` ${sobrenome}` : "";
  return {
    id: String(row.id_usuario),
    fullName: `${row.nome}${last}`.trim(),
    email: row.email,
    phone: row.telefone ?? row.celular ?? undefined,
    cpf: row.cpf ?? undefined,
    birthDate: row.data_nascimento ?? undefined,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function getUsuarioDetails(
  id_usuario: string
): Promise<UsuarioDetails | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios")
    .select(
      "id_usuario, nome, sobrenome, email, telefone, celular, cpf, data_nascimento"
    )
    .eq("id_usuario", Number(id_usuario))
    .maybeSingle();

  throwIfError(error);
  if (!data) return null;
  return mapRow(data as UsuarioRow);
}

export async function updateUsuarioDetails(
  id_usuario: string,
  payload: {
    fullName: string;
    email: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
  }
): Promise<void> {
  const supabase = getSupabase();

  const trimmedName = payload.fullName.trim();
  const [nome, ...rest] = trimmedName.split(/\s+/);
  const sobrenome = rest.length ? rest.join(" ") : "";

  const { error } = await supabase
    .from("usuarios")
    .update({
      nome: nome || trimmedName,
      sobrenome,
      email: payload.email.trim().toLowerCase(),
      telefone: payload.phone ?? null,
      cpf: payload.cpf ?? null,
      data_nascimento: payload.birthDate ?? null,
      updatedat: new Date().toISOString(),
    })
    .eq("id_usuario", Number(id_usuario));

  throwIfError(error);
}
