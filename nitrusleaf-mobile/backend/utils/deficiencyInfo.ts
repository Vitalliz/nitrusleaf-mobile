export type DeficiencyType = "Cobre" | "Manganês" | "Saudável" | "Indefinido";

export function normalizeDeficiencyType(raw: string | undefined): DeficiencyType {
  if (!raw?.trim()) return "Indefinido";
  const n = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (n.includes("cobre")) return "Cobre";
  if (n.includes("manganes") || n.includes("manganese")) return "Manganês";
  if (
    n.includes("saudavel") ||
    n.includes("saud") ||
    n.includes("healthy") ||
    n.includes("normal")
  ) {
    return "Saudável";
  }
  return "Indefinido";
}

export function getDeficiencyAccentColor(type: DeficiencyType): string {
  if (type === "Cobre") return "#E65723";
  if (type === "Manganês") return "#FBBF24";
  if (type === "Saudável") return "#58B741";
  return "#6B7280";
}

export function getDeficiencyTitle(type: DeficiencyType): string {
  if (type === "Saudável") return "Nenhuma deficiência detectada";
  if (type === "Indefinido") return "Nada identificado com clareza";
  return `Deficiência de ${type}`;
}

export type DeficiencyExplanation = {
  title: string;
  meaning: string;
  recommendations: string[];
  footer: string;
};

export function getDeficiencyExplanation(
  type: DeficiencyType
): DeficiencyExplanation {
  if (type === "Manganês") {
    return {
      title: "Deficiência de Manganês",
      meaning:
        "O modelo identificou padrão visual compatível com deficiência de manganês na folha. Em citros, isso costuma aparecer como clorose internerval nas folhas novas, com nervuras ainda verdes, redução do vigor e menor fotossíntese.",
      recommendations: [
        "Confirmar com análise foliar e de solo antes de qualquer correção.",
        "Avaliar pH do solo: valores muito altos podem reduzir a disponibilidade de manganês.",
        "Considerar adubação foliar ou de solo com fonte de manganês, conforme orientação técnica.",
        "Monitorar o talhão nas próximas semanas e repetir a análise após intervenção.",
      ],
      footer:
        "Recomendações básicas. Para dose, produto e época de aplicação, consulte um agrônomo especializado em citricultura.",
    };
  }

  if (type === "Cobre") {
    return {
      title: "Deficiência de Cobre",
      meaning:
        "O modelo indicou sinais compatíveis com deficiência de cobre. Em plantas cítricas, pode haver folhas pequenas, deformadas, queda prematura e menor qualidade dos frutos quando o desequilíbrio persiste.",
      recommendations: [
        "Validar o diagnóstico com análise foliar e histórico do manejo da área.",
        "Evitar aplicações repetidas sem laudo: excesso de cobre também prejudica a lavoura.",
        "Ajustar programa de micronutrientes somente com recomendação técnica.",
        "Registrar o pé/talhão e reavaliar em 30 a 45 dias.",
      ],
      footer:
        "Recomendações básicas. Consulte um agrônomo para prescrição segura de fontes e doses de cobre.",
    };
  }

  if (type === "Saudável") {
    return {
      title: "Nada identificado",
      meaning:
        "A imagem analisada não apresentou, com confiança suficiente, padrão típico de deficiência de manganês ou cobre no modelo atual. Isso não substitui avaliação presencial nem análise laboratorial.",
      recommendations: [
        "Manter o monitoramento periódico das folhas e do vigor das plantas.",
        "Seguir o plano de adubação e manejo já adotado na propriedade.",
        "Refazer a análise se surgirem sintomas visuais ou queda de produção.",
      ],
      footer:
        "Se houver suspeita de outro problema (pragas, doenças, outros nutrientes), consulte um agrônomo especializado.",
    };
  }

  return {
    title: "Nada identificado",
    meaning:
      "O resultado não foi classificado com segurança pelo modelo. Pode ser imagem fora do padrão, iluminação inadequada ou sintoma não coberto pelo treinamento atual.",
    recommendations: [
      "Tire uma nova foto com boa luz, folha centralizada e foco nítido.",
      "Associe a análise ao talhão e ao pé corretos no resumo técnico.",
      "Procure um agrônomo se os sintomas visíveis persistirem no campo.",
    ],
    footer:
      "Em caso de suspeita de deficiência ou doença, consulte um agrônomo especializado antes de aplicar corretivos.",
  };
}
