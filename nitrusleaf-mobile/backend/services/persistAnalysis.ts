import { createFoto, deleteFoto } from "@/repositories/fotoRepository";
import {
  createRelatorio,
  deleteRelatorio,
} from "@/repositories/relatorioRepository";
import { getPeById, updatePe } from "@/repositories/peRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import type { DeficiencyType } from "@/utils/deficiencyInfo";
import type { Pe } from "@/types/pe";

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

  const previousPe = await getPeById(params.peId);
  if (!previousPe) throw new Error("Pé não encontrado para salvar a análise.");

  let fotoId: string | undefined;
  let relatorioId: string | undefined;
  let updatedPe: Pe | undefined;
  let peUpdateAttempted = false;

  try {
    const foto = await createFoto({
      peId: params.peId,
      caminhoFoto: params.imageUri,
      dataFoto: now,
      tipo: params.deficiencyType,
    });
    fotoId = foto.id;

    const relatorio = await createRelatorio({
      peId: params.peId,
      fotoId: foto.id,
      deficienciaCobre: isCobre,
      deficienciaManganes: isManganes,
      outros: isOutros,
      observacoes: `Probabilidade IA: ${params.probability}%. Classe: ${params.deficiencyType}.`,
      dataAnalise: now,
    });
    relatorioId = relatorio.id;

    peUpdateAttempted = true;
    updatedPe = await updatePe(params.peId, {
      deficienciaManganes: isManganes,
      outros: isOutros,
      situacao: isSaudavel ? "Tratado" : "Não-Tratado",
      observacoes: `Última análise (${new Date().toLocaleDateString("pt-BR")}): ${params.deficiencyType} — ${params.probability}%`,
    });
  } catch (error) {
    const cleanupErrors: string[] = [];

    if (peUpdateAttempted) {
      try {
        await updatePe(params.peId, {
          deficienciaManganes: previousPe.deficienciaManganes ?? false,
          outros: previousPe.outros ?? false,
          situacao: previousPe.situacao,
          observacoes: previousPe.observacoes ?? null,
        });
      } catch (rollbackError) {
        cleanupErrors.push(
          `restauração do pé: ${
            rollbackError instanceof Error
              ? rollbackError.message
              : String(rollbackError)
          }`
        );
      }
    }

    if (relatorioId) {
      try {
        await deleteRelatorio(relatorioId);
      } catch (cleanupError) {
        cleanupErrors.push(
          `remoção do relatório: ${
            cleanupError instanceof Error
              ? cleanupError.message
              : String(cleanupError)
          }`
        );
      }
    }

    if (fotoId) {
      try {
        await deleteFoto(fotoId);
      } catch (cleanupError) {
        cleanupErrors.push(
          `remoção da foto: ${
            cleanupError instanceof Error
              ? cleanupError.message
              : String(cleanupError)
          }`
        );
      }
    }

    if (cleanupErrors.length > 0) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Falha ao salvar a análise: ${cause}. A compensação também falhou (${cleanupErrors.join("; ")}).`
      );
    }
    throw error;
  }

  if (!fotoId || !relatorioId || !updatedPe) {
    throw new Error("A análise não foi concluída corretamente.");
  }

  if (updatedPe.talhaoId) {
    try {
      await syncTalhaoStatsFromPes(updatedPe.talhaoId);
    } catch (e) {
      console.warn("[persistAnalysis] sync talhão:", e);
    }
  }

  return { fotoId, relatorioId };
}
