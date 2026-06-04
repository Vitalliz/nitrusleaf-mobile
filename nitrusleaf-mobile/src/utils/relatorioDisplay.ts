import type { Relatorio } from "@/types/relatorio";
import type { AnalysisData } from "@/components/cards/analysis-card";

export function parseRelatorioObservacoes(observacoes?: string): {
  probability?: number;
  deficiencyType?: string;
} {
  if (!observacoes) return {};
  const probMatch = observacoes.match(/Probabilidade IA:\s*([\d.]+)%/i);
  const classMatch = observacoes.match(/Classe:\s*([^.\n]+)/i);
  return {
    probability: probMatch ? Number(probMatch[1]) : undefined,
    deficiencyType: classMatch?.[1]?.trim(),
  };
}

export function deficiencyLabelFromRelatorio(r: Relatorio): string {
  if (r.deficienciaManganes) return "Manganês";
  if (r.deficienciaCobre) return "Cobre";
  if (r.outros) return "Adversos";
  return "Saudável";
}

export function statusLabelFromRelatorio(
  r: Relatorio,
  peSituacao?: string
): string {
  if (peSituacao === "Tratado") return "Tratado";
  if (peSituacao === "Não-Tratado") return "Não-Tratado";
  if (r.deficienciaManganes || r.deficienciaCobre || r.outros) {
    return "Em tratamento";
  }
  return peSituacao || "Sem-informações";
}

export function mapRelatorioToAnalysisData(
  r: Relatorio,
  peSituacao?: string
): AnalysisData {
  const parsed = parseRelatorioObservacoes(r.observacoes);
  const date = r.dataAnalise
    ? new Date(r.dataAnalise).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Sem data";

  return {
    id: r.id,
    label: `Análise #${String(r.id).padStart(2, "0")}`,
    status: statusLabelFromRelatorio(r, peSituacao),
    date,
    probability: parsed.probability ?? 0,
    deficiencyType:
      parsed.deficiencyType ?? deficiencyLabelFromRelatorio(r),
  };
}
