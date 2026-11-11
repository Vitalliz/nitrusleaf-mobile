import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  getDeficiencyAccentColor,
  getDeficiencyExplanation,
  getDeficiencyTitle,
  type DeficiencyType,
} from "@/utils/deficiencyInfo";

export type ExportAnalysisPdfParams = {
  analysisId: string;
  formattedId: string;
  formattedDate: string;
  deficiencyType: DeficiencyType;
  probability: number;
  authorName: string;
  propertyName?: string;
  talhaoName?: string;
  peName?: string;
  latitude?: number;
  longitude?: number;
  statusLabel?: string;
  observacoes?: string;
  imageUri?: string;
};

function escapeHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildAnalysisReportHtml(params: ExportAnalysisPdfParams): string {
  const accentColor = getDeficiencyAccentColor(params.deficiencyType);
  const deficiencyTitle = getDeficiencyTitle(params.deficiencyType);
  const explanation = getDeficiencyExplanation(params.deficiencyType);
  const safePct = Math.min(100, Math.max(0, Number(params.probability) || 0));
  const displayPct = Number.isInteger(safePct) ? safePct : Math.round(safePct * 10) / 10;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePct / 100) * circumference;

  const propertyName = escapeHtml(params.propertyName || "Propriedade não especificada");
  const talhaoName = escapeHtml(params.talhaoName || "Talhão não selecionado");
  const peName = escapeHtml(params.peName || "Árvore/Pé não selecionado");
  const statusLabel = escapeHtml(params.statusLabel || "Não informado");
  const authorName = escapeHtml(params.authorName || "Não informado");
  const formattedId = escapeHtml(params.formattedId);
  const formattedDate = escapeHtml(params.formattedDate);
  const observacoes = escapeHtml(params.observacoes?.trim());

  const hasCoords = params.latitude !== undefined && params.longitude !== undefined;
  const coordsText = hasCoords
    ? `${params.latitude?.toFixed(6)}, ${params.longitude?.toFixed(6)}`
    : "Coordenadas não disponíveis";

  const isHealthy = params.deficiencyType === "Saudável";
  const badgeBg = isHealthy ? "#DCFCE7" : params.deficiencyType === "Manganês" ? "#FEF3C7" : "#F3F4F6";
  const badgeColor = isHealthy ? "#166534" : params.deficiencyType === "Manganês" ? "#92400E" : "#374151";

  const recommendationsHtml = explanation.recommendations
    .map((rec) => `<li>${escapeHtml(rec)}</li>`)
    .join("");

  const sampleImageHtml =
    params.imageUri && (params.imageUri.startsWith("http") || params.imageUri.startsWith("data:"))
      ? `<div style="text-align:center; margin-top: 14px;">
           <img src="${escapeHtml(params.imageUri)}" alt="Amostra da folha" style="max-height: 160px; max-width: 100%; border-radius: 8px; border: 1px solid #E5E7EB; object-fit: contain;" />
           <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">Foto da folha analisada</div>
         </div>`
      : "";

  const observacoesHtml = observacoes
    ? `<div class="section">
         <div class="section-title">Observações do Técnico</div>
         <div class="observations-text">"${observacoes}"</div>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório de Análise - NitrusLeaf #${formattedId}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1F2937;
      background-color: #FFFFFF;
      padding: 32px 36px;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #58B741;
      padding-bottom: 14px;
      margin-bottom: 22px;
    }
    .brand-col {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 42px;
      height: 42px;
      background-color: #58B741;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 24px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #1A2C3E;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .meta-col {
      text-align: right;
    }
    .meta-id {
      font-size: 15px;
      font-weight: 800;
      color: #1A2C3E;
    }
    .meta-date {
      font-size: 12px;
      color: #6B7280;
      margin-top: 3px;
    }
    .grid-2 {
      display: flex;
      gap: 18px;
      margin-bottom: 18px;
    }
    .card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 16px;
      flex: 1;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 12px;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 6px;
    }
    .gauge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .badge {
      display: inline-block;
      font-size: 15px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
      background-color: ${badgeBg};
      color: ${badgeColor};
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }
    .info-table td {
      padding: 7px 0;
      border-bottom: 1px dashed #E5E7EB;
      font-size: 12.5px;
    }
    .info-table tr:last-child td {
      border-bottom: none;
    }
    .info-label {
      color: #6B7280;
      font-weight: 500;
      width: 40%;
    }
    .info-val {
      color: #1A2C3E;
      font-weight: 600;
      text-align: right;
    }
    .section {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 18px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1A2C3E;
      margin-bottom: 8px;
    }
    .section-desc {
      font-size: 12.5px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .rec-heading {
      font-size: 12px;
      font-weight: 700;
      color: #1A2C3E;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .rec-list {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 12.5px;
      color: #374151;
      line-height: 1.5;
    }
    .rec-list li {
      margin-bottom: 4px;
    }
    .advisory-box {
      background: #F3F4F6;
      border-left: 4px solid #58B741;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      font-size: 11.5px;
      color: #4B5563;
      margin-top: 14px;
      line-height: 1.5;
    }
    .observations-text {
      font-size: 12.5px;
      color: #374151;
      font-style: italic;
      line-height: 1.5;
    }
    .footer {
      border-top: 1px solid #E5E7EB;
      padding-top: 12px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #9CA3AF;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-col">
      <div class="brand-icon">🍃</div>
      <div>
        <div class="brand-title">NitrusLeaf</div>
        <div class="brand-sub">Diagnóstico Nutricional Inteligente</div>
      </div>
    </div>
    <div class="meta-col">
      <div class="meta-id">Análise #${formattedId}</div>
      <div class="meta-date">${formattedDate}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Resultado da Análise</div>
      <div class="gauge-container">
        <div class="badge">${deficiencyTitle}</div>
        <svg width="180" height="180" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="${radius}"
            stroke="#E5E7EB"
            stroke-width="16"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="${radius}"
            stroke="${accentColor}"
            stroke-width="16"
            fill="none"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${strokeDashoffset}"
            stroke-linecap="round"
            transform="rotate(-90 100 100)"
          />
          <text
            x="100"
            y="106"
            font-size="32"
            font-weight="bold"
            fill="#1A2C3E"
            text-anchor="middle"
            font-family="-apple-system, BlinkMacSystemFont, sans-serif"
          >
            ${displayPct}%
          </text>
          <text
            x="100"
            y="126"
            font-size="11"
            font-weight="600"
            fill="#6B7280"
            text-anchor="middle"
            font-family="-apple-system, BlinkMacSystemFont, sans-serif"
          >
            Confiança
          </text>
        </svg>
      </div>
      ${sampleImageHtml}
    </div>

    <div class="card">
      <div class="card-title">Identificação da Amostra</div>
      <table class="info-table">
        <tr>
          <td class="info-label">Propriedade</td>
          <td class="info-val">${propertyName}</td>
        </tr>
        <tr>
          <td class="info-label">Talhão</td>
          <td class="info-val">${talhaoName}</td>
        </tr>
        <tr>
          <td class="info-label">Árvore / Pé</td>
          <td class="info-val">${peName}</td>
        </tr>
        <tr>
          <td class="info-label">Coordenadas</td>
          <td class="info-val">${coordsText}</td>
        </tr>
        <tr>
          <td class="info-label">Status da Planta</td>
          <td class="info-val">${statusLabel}</td>
        </tr>
        <tr>
          <td class="info-label">Responsável</td>
          <td class="info-val">${authorName}</td>
        </tr>
        <tr>
          <td class="info-label">Data e Hora</td>
          <td class="info-val">${formattedDate}</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Diagnóstico e Detalhamento</div>
    <div class="section-desc">${escapeHtml(explanation.meaning)}</div>

    <div class="rec-heading">Recomendações Técnicas:</div>
    <ul class="rec-list">
      ${recommendationsHtml}
    </ul>

    <div class="advisory-box">
      <strong>Aviso:</strong> ${escapeHtml(explanation.footer)}
    </div>
  </div>

  ${observacoesHtml}

  <div class="footer">
    <div>NitrusLeaf Mobile • Relatório gerado automaticamente</div>
    <div>Documento para fins de monitoramento e manejo agrícola</div>
  </div>
</body>
</html>`;
}

export async function exportAnalysisPdf(
  params: ExportAnalysisPdfParams
): Promise<void> {
  const html = buildAnalysisReportHtml(params);

  if (Platform.OS === "web") {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({
    html,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
      dialogTitle: `Relatório NitrusLeaf #${params.formattedId}`,
    });
  }
}

