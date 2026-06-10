-- Execute no Supabase: SQL Editor → New query → Run
-- Adiciona colunas de contagem em `talhoes` (usadas opcionalmente pelo app).
-- Sem isso, o app ainda funciona: totais são calculados a partir da tabela `pes`.

ALTER TABLE public.talhoes
  ADD COLUMN IF NOT EXISTS total_pes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pes_analisados integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pes_diagnosticados integer DEFAULT 0;

-- Atualiza o cache de schema do PostgREST (evita erro "schema cache")
NOTIFY pgrst, 'reload schema';
