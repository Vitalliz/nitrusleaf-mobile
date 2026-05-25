import { computeTalhaoPeStats, isPeAnalyzed, isPeDeficient } from "../peStats";
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
});
