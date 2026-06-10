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

export type DeficiencyCategory = "cobre" | "manganes" | "adversos";

/**
 * Classifica pé já analisado em uma única categoria.
 * Adversos = flag outros (IA) ou analisado sem cobre/manganês (ex.: Saudável).
 */
export function getPeDeficiencyCategory(pe: Pe): DeficiencyCategory | null {
  if (!isPeAnalyzed(pe)) return null;
  if (pe.deficienciaCobre) return "cobre";
  if (pe.deficienciaManganes) return "manganes";
  return "adversos";
}

export type PropertyDeficiencyStats = {
  analyzed: number;
  cobre: number;
  manganes: number;
  adversos: number;
  /** % entre pés com cobre ou manganês (card nutricional). */
  nutritionalCobrePct: number;
  nutritionalManganesPct: number;
  /** % entre todos os pés analisados (donut — soma 100%). */
  cobrePct: number;
  manganesPct: number;
  adversosPct: number;
};

export function computePropertyDeficiencyStats(
  pes: Pe[]
): PropertyDeficiencyStats {
  const analyzedPes = pes.filter(isPeAnalyzed);
  const analyzed = analyzedPes.length;

  let cobre = 0;
  let manganes = 0;
  let adversos = 0;

  for (const pe of analyzedPes) {
    const category = getPeDeficiencyCategory(pe);
    if (category === "cobre") cobre += 1;
    else if (category === "manganes") manganes += 1;
    else if (category === "adversos") adversos += 1;
  }

  const pctOf = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  const nutritionalBase = cobre + manganes;

  return {
    analyzed,
    cobre,
    manganes,
    adversos,
    nutritionalCobrePct: pctOf(cobre, nutritionalBase),
    nutritionalManganesPct: pctOf(manganes, nutritionalBase),
    cobrePct: pctOf(cobre, analyzed),
    manganesPct: pctOf(manganes, analyzed),
    adversosPct: pctOf(adversos, analyzed),
  };
}
