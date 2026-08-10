import { getPesByTalhao } from "@/repositories/peRepository";
import { getSupabase } from "@/services/supabase";
import { computeTalhaoPeStats } from "@/utils/peStats";

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

  if (!error) return;

  const msg = (error.message ?? "").toLowerCase();
  const missingColumn =
    msg.includes("pes_analisados") ||
    msg.includes("pes_diagnosticados") ||
    msg.includes("total_pes") ||
    msg.includes("schema cache") ||
    msg.includes("column") ||
    msg.includes("coluna");

  if (missingColumn) {
    console.warn(
      "[syncTalhaoStats] Colunas total_pes, pes_analisados ou pes_diagnosticados ausentes em talhoes.",
      error.message
    );
    return;
  }

  throw new Error(error.message);
}
