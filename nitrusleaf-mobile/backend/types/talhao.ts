export interface Talhao {
  id: string;
  propertyId: string;
  alqueireId?: string;
  name: string;
  especieFruta: string;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTalhaoRequest {
  propertyId: string;
  alqueireId?: string;
  name: string;
  especieFruta: string;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string;
}

export interface UpdateTalhaoRequest {
  alqueireId?: string;
  name?: string;
  especieFruta?: string;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string;
}
