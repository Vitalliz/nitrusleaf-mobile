/**
 * Timestamps vindos do Postgres/PostgREST: snake_case (`created_at`),
 * CamelCase citado no SQL (`createdAt` → coluna real costuma ser `createdat`).
 */
export function readCreatedUpdated(row: Record<string, unknown>): {
  createdAt: string;
  updatedAt: string;
} {
  const fallback = new Date().toISOString();
  const created =
    (row.created_at as string | undefined) ??
    (row.createdAt as string | undefined) ??
    (row.createdat as string | undefined);
  const updated =
    (row.updated_at as string | undefined) ??
    (row.updatedAt as string | undefined) ??
    (row.updatedat as string | undefined);
  return {
    createdAt: created ?? fallback,
    updatedAt: updated ?? fallback,
  };
}
