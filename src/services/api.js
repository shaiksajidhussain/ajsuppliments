// API service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(email, password, name) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async verifyToken() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      return { ok: false };
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      return { ok: response.ok };
    } catch (error) {
      return { ok: false };
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('loginTime');
    }
  }

  // Ingredients endpoints
  async getIngredients(category = null, search = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    return this.request(`/ingredients${queryString ? `?${queryString}` : ''}`);
  }

  async getIngredientCategories() {
    return this.request('/ingredients/categories');
  }

  // Species endpoints
  async getSpeciesConfigs(species = null, subspecies = null, animalType = null, phase = null) {
    const params = new URLSearchParams();
    if (species) params.append('species', species);
    if (subspecies) params.append('subspecies', subspecies);
    if (animalType) params.append('animalType', animalType);
    if (phase) params.append('phase', phase);
    
    const queryString = params.toString();
    return this.request(`/species/configs${queryString ? `?${queryString}` : ''}`);
  }

  async getSpeciesOptions() {
    return this.request('/species/options');
  }

  // Feed formulation endpoints
  async getFeedFormulations() {
    return this.request('/feed-formulations');
  }

  async getFeedFormulation(id) {
    return this.request(`/feed-formulations/${id}`);
  }

  async createFeedFormulation(formulationData) {
    return this.request('/feed-formulations', {
      method: 'POST',
      body: JSON.stringify(formulationData),
    });
  }

  async updateFeedFormulation(id, formulationData) {
    return this.request(`/feed-formulations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formulationData),
    });
  }

  async deleteFeedFormulation(id) {
    return this.request(`/feed-formulations/${id}`, {
      method: 'DELETE',
    });
  }

  async calculateFeedFormulation(calculationData) {
    return this.request('/feed-formulations/calculate', {
      method: 'POST',
      body: JSON.stringify(calculationData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Export verifyToken function for use in components
export const verifyToken = () => apiService.verifyToken();

export default apiService;
