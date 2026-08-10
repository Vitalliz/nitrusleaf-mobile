import { createFoto } from "@/repositories/fotoRepository";
import { createRelatorio } from "@/repositories/relatorioRepository";
import { getPeById, updatePe } from "@/repositories/peRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import type { DeficiencyType } from "@/utils/deficiencyInfo";

export async function persistAnalysisResult(params: {
  peId: string;
  imageUri: string;
  deficiencyType: DeficiencyType;
  probability: number;
}): Promise<{ fotoId: string; relatorioId: string }> {
  const now = new Date().toISOString();
  const isCobre = params.deficiencyType === "Cobre";
  const isManganes = params.deficiencyType === "Manganês";
  const isSaudavel = params.deficiencyType === "Saudável";
  const isOutros =
    params.deficiencyType === "Indefinido" ||
    (!isCobre && !isManganes && !isSaudavel);

  const foto = await createFoto({
    peId: params.peId,
    caminhoFoto: params.imageUri,
    dataFoto: now,
    tipo: params.deficiencyType,
  });

  const relatorio = await createRelatorio({
    peId: params.peId,
    fotoId: foto.id,
    deficienciaCobre: isCobre,
    deficienciaManganes: isManganes,
    outros: isOutros,
    observacoes: `Probabilidade IA: ${params.probability}%. Classe: ${params.deficiencyType}.`,
    dataAnalise: now,
  });

  await updatePe(params.peId, {
    deficienciaCobre: isCobre,
    deficienciaManganes: isManganes,
    outros: isOutros,
    situacao: isSaudavel ? "Tratado" : "Não-Tratado",
    observacoes: `Última análise (${new Date().toLocaleDateString("pt-BR")}): ${params.deficiencyType} — ${params.probability}%`,
  });

  const pe = await getPeById(params.peId);
  if (pe?.talhaoId) {
    try {
      await syncTalhaoStatsFromPes(pe.talhaoId);
    } catch (e) {
      console.warn("[persistAnalysis] sync talhão:", e);
    }
  }

  return { fotoId: foto.id, relatorioId: relatorio.id };
}
