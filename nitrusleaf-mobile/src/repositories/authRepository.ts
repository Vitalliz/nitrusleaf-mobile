import type { Session } from "@supabase/supabase-js";
import { getSupabase, waitForAuthSession } from "@/services/supabase";
import type { User } from "@/types/auth";
import {
  beginAuthProfileWrite,
  endAuthProfileWrite,
} from "@/utils/authFlowLock";

type DbUserRow = {
  id_usuario: number;
  user_id?: string | null;
  nome: string;
  sobrenome: string | null;
  email: string;
  telefone: string | null;
  celular: string | null;
  cpf: string | null;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapUser(row: DbUserRow): User {
  const first = row.nome ?? "";
  const last = row.sobrenome ? ` ${row.sobrenome}` : "";
  return {
    id: String(row.id_usuario),
    name: `${first}${last}`.trim() || row.email,
    email: row.email,
    phone: row.telefone ?? row.celular ?? undefined,
    cpf: row.cpf ?? undefined,
  };
}

function throwIfError(error: { message: string; code?: string } | null) {
  if (error) {
    const code = error.code ? ` [${error.code}]` : "";
    throw new Error(`${error.message}${code}`);
  }
}

/** Erros do `auth.signUp` / `signInWithPassword` com mensagens mais claras em PT-BR. */
function throwAuthError(error: { message: string; code?: string } | null) {
  if (!error) return;
  const code = String(error.code ?? "");
  const msg = (error.message ?? "").toLowerCase();
  if (
    code === "over_email_send_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("email rate limit")
  ) {
    throw new Error(
      "Limite de e-mails do Supabase atingido (muitas tentativas de cadastro ou confirmação). Aguarde alguns minutos, use outro e-mail para testes ou desative confirmação de e-mail no painel (Authentication → Providers → Email) em desenvolvimento."
    );
  }
  if (
    code === "user_already_exists" ||
    msg.includes("user already registered") ||
    msg.includes("already been registered") ||
    msg.includes("email address is already registered") ||
    msg.includes("already registered")
  ) {
    throw new Error(
      "Este e-mail já está cadastrado no Supabase (Authentication → Users). Apagar só a linha em `usuarios` não libera o e-mail: exclua o usuário em Authentication ou use outro e-mail."
    );
  }
  throw new Error(error.message);
}

function assertAuthUserId(id: unknown): asserts id is string {
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    throw new Error("Conta de autenticação inválida: user_id ausente ou inválido.");
  }
}

export async function registerLocal(params: {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf: string;
  password: string;
}): Promise<{ user: User; session: Session | null }> {
  beginAuthProfileWrite();
  try {
    const supabase = getSupabase();

    const nome = (params.name || "").trim() || "Usuário";
    /** Evita string vazia se a coluna for NOT NULL no Postgres. */
    const sobrenome = (params.lastName || "").trim() || "-";
    const emailNorm = params.email.trim().toLowerCase();
    const phoneNorm = params.phone?.trim() || null;
    const cpfNorm = params.cpf?.trim() || null;

    // 1) Autenticar ANTES do INSERT em `usuarios`.
    const { data, error } = await supabase.auth.signUp({
      email: emailNorm,
      password: params.password,
    });

    throwAuthError(error);

    if (!data.user?.id) {
      throw new Error(
        "Não foi possível criar a conta com este e-mail. Ele pode já estar em uso no Auth (mesmo que você tenha apagado só a linha em `usuarios`). No painel: Authentication → Users — remova o usuário ou use outro e-mail."
      );
    }

    const authUserId = data.user.id;
    assertAuthUserId(authUserId);

    let session: Session | null = data.session ?? null;
    if (!session?.access_token) {
      session = await waitForAuthSession(6000);
    }
    if (!session?.access_token) {
      await supabase.auth.signOut();
      throw new Error(
        "Cadastro criado no Auth, mas não há sessão ativa ainda. Se o projeto exige confirmação de e-mail, abra o link recebido e faça login; em desenvolvimento desative em Authentication → Providers → Email → Confirm email. Sem JWT o app não consegue gravar seu perfil em `usuarios` (RLS)."
      );
    }

    const USUARIO_COLS =
      "id_usuario, user_id, nome, sobrenome, email, telefone, celular, cpf";

    const { data: existingProfile } = await supabase
      .from("usuarios")
      .select(USUARIO_COLS)
      .eq("user_id", authUserId)
      .maybeSingle();

    /** Trigger no Supabase costuma criar stub só com e-mail — completamos com UPDATE. */
    if (existingProfile) {
      const fullPatch = {
        nome,
        sobrenome,
        email: emailNorm,
        telefone: phoneNorm,
        cpf: cpfNorm,
        tipo_pessoa: "fisica" as const,
      };
      let { data: updated, error: updateErr } = await supabase
        .from("usuarios")
        .update(fullPatch)
        .eq("user_id", authUserId)
        .select(USUARIO_COLS)
        .maybeSingle();

      const errMsg = updateErr?.message?.toLowerCase() ?? "";
      if (updateErr && (errMsg.includes("tipo_pessoa") || errMsg.includes("column"))) {
        const retry = await supabase
          .from("usuarios")
          .update({
            nome,
            sobrenome,
            email: emailNorm,
            telefone: phoneNorm,
            cpf: cpfNorm,
          })
          .eq("user_id", authUserId)
          .select(USUARIO_COLS)
          .maybeSingle();
        updateErr = retry.error;
        updated = retry.data;
      }

      throwIfError(updateErr);
      if (!updated) {
        throw new Error(
          "Não foi possível atualizar seu perfil (0 linhas). Verifique RLS de UPDATE em `usuarios` para o próprio `user_id`."
        );
      }
      return { user: mapUser(updated as DbUserRow), session };
    }

    try {
    // 2) INSERT com user_id = data.user.id (RLS: user_id = auth.uid()).
    const { data: inserted, error: insertError } = await supabase
      .from("usuarios")
      .insert({
        user_id: authUserId,
        nome,
        sobrenome,
        email: emailNorm,
        telefone: phoneNorm,
        cpf: cpfNorm,
        tipo_pessoa: "fisica",
      })
      .select(USUARIO_COLS)
      .single();

    throwIfError(insertError);
    if (!inserted) {
      throw new Error("Falha ao salvar perfil do usuário.");
    }

    const row = inserted as DbUserRow;
    if (!row.user_id || row.user_id !== authUserId) {
      throw new Error(
        "Perfil salvo sem user_id ou inconsistente. Verifique triggers/RLS no Supabase."
      );
    }

    return { user: mapUser(row), session };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (
      msg.includes("usuarios_user_id_key") ||
      msg.includes("duplicate key") ||
      msg.includes("23505")
    ) {
      const { data: again, error: fetchErr } = await supabase
        .from("usuarios")
        .select(USUARIO_COLS)
        .eq("user_id", authUserId)
        .maybeSingle();
      throwIfError(fetchErr);
      if (again) {
        const { data: merged, error: mergeErr } = await supabase
          .from("usuarios")
          .update({
            nome,
            sobrenome,
            email: emailNorm,
            telefone: phoneNorm,
            cpf: cpfNorm,
            tipo_pessoa: "fisica",
          })
          .eq("user_id", authUserId)
          .select(USUARIO_COLS)
          .single();
        throwIfError(mergeErr);
        if (merged) {
          return { user: mapUser(merged as DbUserRow), session };
        }
        return { user: mapUser(again as DbUserRow), session };
      }
    }
    await supabase.auth.signOut();
    throw err;
  }
  } finally {
    endAuthProfileWrite();
  }
}

export async function loginLocal(email: string, password: string): Promise<User> {
  const supabase = getSupabase();

  const emailNorm = email.trim().toLowerCase();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: emailNorm,
      password,
    });

  throwAuthError(authError);

  const authUserId = authData.user?.id;
  assertAuthUserId(authUserId);

  const { data: row, error } = await supabase
    .from("usuarios")
    .select("id_usuario, nome, sobrenome, email, telefone, celular, cpf")
    .eq("user_id", authUserId)
    .maybeSingle();

  throwIfError(error);
  if (!row) {
    throw new Error("Perfil não encontrado. Entre em contato com o suporte.");
  }

  return mapUser(row as DbUserRow);
}

/**
 * Busca por `user_id` (UUID do Supabase Auth) ou por `id_usuario` (legado).
 */
export async function getUserByIdLocal(id: string): Promise<User | null> {
  const supabase = getSupabase();

  const base = supabase
    .from("usuarios")
    .select("id_usuario, nome, sobrenome, email, telefone, celular, cpf");

  const { data, error } = UUID_REGEX.test(id.trim())
    ? await base.eq("user_id", id.trim()).maybeSingle()
    : await base.eq("id_usuario", Number(id)).maybeSingle();

  throwIfError(error);
  if (!data) return null;
  return mapUser(data as DbUserRow);
}
