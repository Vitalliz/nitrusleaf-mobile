import type { Pe } from "@/types/pe";

/** Pé considerado analisado após escaneamento IA ou registro de situação/deficiência. */
export function isPeAnalyzed(pe: Pe): boolean {
  return (
    pe.situacao === "Tratado" ||
    pe.situacao === "Não-Tratado" ||
    Boolean(pe.deficienciaCobre) ||
    Boolean(pe.deficienciaManganes) ||
    Boolean(pe.outros)
  );
}

export function isPeDeficient(pe: Pe): boolean {
  return Boolean(pe.deficienciaCobre || pe.deficienciaManganes || pe.outros);
}

export function computeTalhaoPeStats(pes: Pe[]): {
  total: number;
  analyzed: number;
  deficient: number;
} {
  const total = pes.length;
  const analyzed = pes.filter(isPeAnalyzed).length;
  const deficient = pes.filter(isPeDeficient).length;
  return { total, analyzed, deficient };
}
