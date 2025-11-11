// Serviço de API - Exemplo de integração com backend
// TODO: Substituir base URL e endpoints reais

const API_BASE_URL = "https://api.seu-backend.com"; // Alterar para URL real
const API_TIMEOUT = 10000;

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiService {
  private baseUrl: string = API_BASE_URL;
  private timeout: number = API_TIMEOUT;

  /**
   * Fazer requisição HTTP genérica
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      token,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      mergedHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // ====== AUTH ENDPOINTS ======
  login(email: string, password: string, token?: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
      token,
    });
  }

  register(data: any, token?: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: data,
      token,
    });
  }

  refreshToken(token?: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      token,
    });
  }

  logout(token?: string) {
    return this.request("/auth/logout", {
      method: "POST",
      token,
    });
  }

  // ====== USER ENDPOINTS ======
  getProfile(token?: string) {
    return this.request("/user/profile", {
      method: "GET",
      token,
    });
  }

  updateProfile(data: any, token?: string) {
    return this.request("/user/profile", {
      method: "PUT",
      body: data,
      token,
    });
  }

  changePassword(currentPassword: string, newPassword: string, token?: string) {
    return this.request("/user/password", {
      method: "POST",
      body: { currentPassword, newPassword },
      token,
    });
  }

  // ====== PLANTATIONS ENDPOINTS ======
  getPlantations(token?: string) {
    return this.request("/plantations", {
      method: "GET",
      token,
    });
  }

  getPlantation(id: string, token?: string) {
    return this.request(`/plantations/${id}`, {
      method: "GET",
      token,
    });
  }

  createPlantation(data: any, token?: string) {
    return this.request("/plantations", {
      method: "POST",
      body: data,
      token,
    });
  }

  updatePlantation(id: string, data: any, token?: string) {
    return this.request(`/plantations/${id}`, {
      method: "PUT",
      body: data,
      token,
    });
  }

  deletePlantation(id: string, token?: string) {
    return this.request(`/plantations/${id}`, {
      method: "DELETE",
      token,
    });
  }

  // ====== PLANTS ENDPOINTS ======
  getPlants(token?: string) {
    return this.request("/plants", {
      method: "GET",
      token,
    });
  }

  searchPlants(query: string, token?: string) {
    return this.request(`/plants/search?q=${query}`, {
      method: "GET",
      token,
    });
  }

  // ====== ACTIVITY ENDPOINTS ======
  getActivities(token?: string) {
    return this.request("/activities", {
      method: "GET",
      token,
    });
  }

  getActivityHistory(plantationId?: string, token?: string) {
    const query = plantationId ? `?plantation_id=${plantationId}` : "";
    return this.request(`/activities/history${query}`, {
      method: "GET",
      token,
    });
  }

  logActivity(data: any, token?: string) {
    return this.request("/activities", {
      method: "POST",
      body: data,
      token,
    });
  }

  // Método genérico para requisições customizadas
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request(endpoint, { method: "GET", token });
  }

  async post<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request(endpoint, { method: "POST", body, token });
  }

  async put<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request(endpoint, { method: "PUT", body, token });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request(endpoint, { method: "DELETE", token });
  }

  async patch<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request(endpoint, { method: "PATCH", body, token });
  }
}

// Exportar instância singleton
export const apiService = new ApiService();