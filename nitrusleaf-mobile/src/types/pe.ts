export type SituacaoPe = 'Saudável' | 'Doente' | 'Morto';

export interface Pe {
  id: string;
  talhaoId: string;
  identificacao: string;
  linha: number;
  coluna: number;
  situacao: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  dataPlantio: string;
  dataCadastro: string;
  dataUltimaAnalise?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeRequest {
  talhaoId: string;
  identificacao: string;
  linha: number;
  coluna: number;
  situacao?: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  dataPlantio: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatePeRequest {
  talhaoId?: string;
  identificacao?: string;
  linha?: number;
  coluna?: number;
  situacao?: SituacaoPe;
  deficienciaCobre?: boolean;
  deficienciaManganes?: boolean;
  outros?: boolean;
  observacoes?: string;
  dataPlantio?: string;
  latitude?: number;
  longitude?: number;
}