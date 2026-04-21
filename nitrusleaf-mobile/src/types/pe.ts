/** Alinhado ao enum `situacao_pe` do PostgreSQL */
export type SituacaoPe = "Tratado" | "Não-Tratado" | "Sem-informações";

export const SITUACOES_PE: SituacaoPe[] = [
  "Tratado",
  "Não-Tratado",
  "Sem-informações",
];

export interface Pe {
  id: string;
  talhaoId: string;
  nome: string;
  situacao: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeRequest {
  talhaoId: string;
  nome: string;
  situacao?: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatePeRequest {
  talhaoId?: string;
  nome?: string;
  situacao?: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  latitude?: number;
  longitude?: number;
}
