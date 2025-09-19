const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to handle responses
const handleResponse = async <T,>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();
  
  if (!response.ok) {
    return {
      error: data.message || 'Something went wrong',
      ...data
    };
  }

  return { data };
};

// Set auth token in headers
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Define the API interface
export interface IApi {
  auth: {
    login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>>;
    register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>>;
    getCurrentUser(): Promise<ApiResponse<{ user: any }>>;
  };
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

const api: IApi = {
  // Auth endpoints
  auth: {
    async login(credentials: { email: string; password: string }) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      return handleResponse<{ user: any; token: string }>(response);
    },

    async register(userData: { username: string; email: string; password: string }) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return handleResponse<{ user: any; token: string }>(response);
    },

    getCurrentUser() {
      return api.get<{ user: any }>('/auth/me');
    },
  },

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<T>(response);
  },
};

// Export the API instance
export default api;
