export interface Alqueire {
  id: string;
  propertyId: string;
  name: string;
  areaTotal?: number;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlqueireRequest {
  propertyId: string;
  name: string;
  areaTotal?: number;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string;
}

export interface UpdateAlqueireRequest {
  name?: string;
  areaTotal?: number;
  latitude?: number;
  longitude?: number;
  coordenadasPoligono?: string;
}