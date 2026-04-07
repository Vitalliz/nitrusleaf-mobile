export interface Property {
  id: string;
  userId: string;
  name: string;
  cep: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  talhoesRegistrados: number;
  totalPes: number;
  pesAnalisados: number;
  pesDiagnosticados: number;
  latitude?: number;
  longitude?: number;
  regiao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  userId: string;
  name: string;
  cep: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  latitude?: number;
  longitude?: number;
  regiao?: string;
}

export interface UpdatePropertyRequest {
  name?: string;
  cep?: string;
  logradouro?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  latitude?: number;
  longitude?: number;
  regiao?: string;
}