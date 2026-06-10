import {
  computePropertyDeficiencyStats,
  computeTalhaoPeStats,
  isPeAnalyzed,
  isPeDeficient,
} from "../peStats";
import type { Pe } from "@/types/pe";

const basePe = (overrides: Partial<Pe>): Pe => ({
  id: "1",
  talhaoId: "1",
  nome: "Pé 1",
  situacao: "Sem-informações",
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

describe("peStats", () => {
  it("considera pé analisado com situação Tratado ou Não-Tratado", () => {
    expect(isPeAnalyzed(basePe({ situacao: "Tratado" }))).toBe(true);
    expect(isPeAnalyzed(basePe({ situacao: "Não-Tratado" }))).toBe(true);
    expect(isPeAnalyzed(basePe({ situacao: "Sem-informações" }))).toBe(false);
  });

  it("considera pé analisado com flag de deficiência", () => {
    expect(isPeAnalyzed(basePe({ deficienciaManganes: true }))).toBe(true);
  });

  it("calcula totais do talhão", () => {
    const pes = [
      basePe({ id: "1", situacao: "Tratado" }),
      basePe({ id: "2", deficienciaCobre: true, situacao: "Não-Tratado" }),
      basePe({ id: "3" }),
    ];
    expect(computeTalhaoPeStats(pes)).toEqual({
      total: 3,
      analyzed: 2,
      deficient: 1,
    });
  });

  it("identifica pé deficiente", () => {
    expect(isPeDeficient(basePe({ deficienciaManganes: true }))).toBe(true);
    expect(isPeDeficient(basePe({ situacao: "Tratado" }))).toBe(false);
  });

  it("calcula % nutricional só entre cobre e manganês", () => {
    const pes = [
      basePe({ id: "1", deficienciaCobre: true, situacao: "Não-Tratado" }),
      basePe({ id: "2", situacao: "Tratado" }),
    ];
    const stats = computePropertyDeficiencyStats(pes);
    expect(stats.nutritionalCobrePct).toBe(100);
    expect(stats.nutritionalManganesPct).toBe(0);
    expect(stats.adversos).toBe(1);
    expect(stats.cobrePct).toBe(50);
    expect(stats.adversosPct).toBe(50);
  });

  it("conta saudável e indefinido em adversos", () => {
    const pes = [
      basePe({ id: "1", outros: true, situacao: "Não-Tratado" }),
      basePe({ id: "2", situacao: "Tratado" }),
    ];
    const stats = computePropertyDeficiencyStats(pes);
    expect(stats.adversos).toBe(2);
    expect(stats.adversosPct).toBe(100);
  });
});
