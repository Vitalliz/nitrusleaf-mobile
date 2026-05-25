import { getPesByTalhao } from "@/repositories/peRepository";
import { getSupabase } from "@/services/supabase";
import { computeTalhaoPeStats } from "@/utils/peStats";

/** Atualiza `total_pes`, `pes_analisados` e `pes_diagnosticados` no talhão. */
export async function syncTalhaoStatsFromPes(talhaoId: string): Promise<void> {
  const supabase = getSupabase();
  const pes = await getPesByTalhao(talhaoId);
  const { total, analyzed, deficient } = computeTalhaoPeStats(pes);

  const { error } = await supabase
    .from("talhoes")
    .update({
      total_pes: total,
      pes_analisados: analyzed,
      pes_diagnosticados: deficient,
      updatedat: new Date().toISOString(),
    })
    .eq("id_talhao", Number(talhaoId));

  if (error) throw new Error(error.message);
}
