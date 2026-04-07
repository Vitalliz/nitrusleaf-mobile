export interface Relatorio {
  id: string;
  peId?: string;
  fotoId?: string;
  deficienciaCobre: boolean;
  deficienciaManganes: boolean;
  outros: boolean;
  observacoes?: string;
  dataAnalise: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelatorioRequest {
  peId?: string;
  fotoId?: string;
  deficienciaCobre: boolean;
  deficienciaManganes: boolean;
  outros: boolean;
  observacoes?: string;
  dataAnalise: string;
}

export interface UpdateRelatorioRequest {
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  dataAnalise?: string;
}