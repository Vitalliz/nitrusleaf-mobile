// Tipos comuns da aplicação

export interface Plantation {
  id: string;
  name: string;
  area: number;
  temperature: number;
  humidity: number;
  status: "healthy" | "warning" | "alert";
  type: string;
  lastUpdated: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Plant {
  id: string;
  name: string;
  description: string;
  image?: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
  irrigationFrequency: string;
}

export interface Activity {
  id: string;
  type: "watering" | "alert" | "inspection" | "maintenance" | "photo" | "report";
  title: string;
  description: string;
  plantation?: string;
  timestamp: string;
  details?: {
    [key: string]: any;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
}

export interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}