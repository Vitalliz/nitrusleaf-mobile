export type DeficiencyType = "Manganês" | "Saudável" | "Indefinido";

export function normalizeDeficiencyType(raw: string | undefined): DeficiencyType {
  if (!raw?.trim()) return "Indefinido";
  const n = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
  if (type === "Manganês") return "#FBBF24";
  if (type === "Saudável") return "#58B741";
  return "#6B7280";
}

export function getDeficiencyTitle(type: DeficiencyType, isEn = false): string {
  if (isEn) {
    if (type === "Saudável") return "Healthy / No deficiency detected";
    if (type === "Indefinido") return "Inconclusive result";
    return "Manganese Deficiency";
  }
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
  type: DeficiencyType,
  isEn = false
): DeficiencyExplanation {
  if (isEn) {
    if (type === "Manganês") {
      return {
        title: "Manganese Deficiency",
        meaning:
          "The model identified a visual pattern consistent with manganese deficiency on the leaf. In citrus, this commonly appears as interveinal chlorosis on young leaves, with main veins remaining green, reduced tree vigor, and diminished photosynthesis.",
        recommendations: [
          "Confirm with foliar and soil laboratory tests before applying chemical corrections.",
          "Assess soil pH: high alkalinity or excessive lime reduces manganese availability.",
          "Consider foliar or ground fertilization with manganese sulfate according to agronomist advice.",
          "Monitor the sector in upcoming weeks and repeat the analysis after intervention.",
        ],
        footer:
          "Basic recommendations. For dosage, commercial product, and timing, always consult a certified citrus agronomist.",
      };
    }

    if (type === "Saudável") {
      return {
        title: "Healthy Leaf",
        meaning:
          "The analyzed image showed visual characteristics typical of a healthy, well-nourished leaf with no significant signs of manganese deficiency.",
        recommendations: [
          "Maintain regular visual inspections and proper irrigation scheduling.",
          "Follow the current nutritional plan established for the property.",
          "Repeat the scan if visual symptoms or yield declines appear.",
        ],
        footer:
          "If you suspect other issues (pests, diseases, other nutrients), consult a specialized agronomist.",
      };
    }

    return {
      title: "Inconclusive",
      meaning:
        "The model could not classify the leaf with sufficient confidence. This may happen due to glare, distance, shadows, or symptoms outside the training dataset.",
      recommendations: [
        "Take a new picture with good lighting, leaf centered, and sharp focus.",
        "Link the analysis to the correct field and tree tag in the summary.",
        "Seek agronomic assistance if field symptoms persist.",
      ],
      footer:
        "Always consult a qualified professional before applying corrective treatments.",
    };
  }

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

  if (type === "Saudável") {
    return {
      title: "Nada identificado",
      meaning:
        "A imagem analisada não apresentou, com confiança suficiente, padrão típico de deficiência de manganês no modelo atual. Isso não substitui avaliação presencial nem análise laboratorial.",
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
