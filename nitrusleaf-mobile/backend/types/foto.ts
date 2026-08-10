export interface Foto {
  id: string;
  peId: string;
  caminhoFoto: string;
  dataFoto: string;
  tipo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFotoRequest {
  peId: string;
  caminhoFoto: string;
  dataFoto: string;
  tipo: string;
}

export interface UpdateFotoRequest {
  peId?: string;
  caminhoFoto?: string;
  dataFoto?: string;
  tipo?: string;
}