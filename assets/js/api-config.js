/**
 * Configuração da API para conectar com o backend Django
 * Atualizar a URL base quando o Railway fornecer o domínio
 */

// Configuração da API
const API_CONFIG = {
    // Detecta automaticamente o ambiente
    BASE_URL: (() => {
        const hostname = window.location.hostname;
        
        // Desenvolvimento local
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        
        // GitHub Pages - conecta com Railway
        if (hostname === 'edenilsonmaffezzoli.github.io') {
            return 'https://web-production-b793800f.up.railway.app';
        }
        
        // Produção Railway (fallback)
        return 'https://web-production-b793800f.up.railway.app';
    })(),
    ENDPOINTS: {
        // Autenticação
        LOGIN: '/api/login/',
        LOGOUT: '/api/logout/',
        REGISTER: '/api/register/',
        
        // Serviços
        SERVICES: '/api/services/',
        SERVICE_CATEGORIES: '/api/services/categories/',
        
        // Health Check
        HEALTH: '/api/health/',
        
        // Usuários
        USERS: '/api/users/',
        PROFILE: '/api/users/profile/',
        
        // Solicitações de serviço
        SERVICE_REQUESTS: '/api/service-requests/',
        
        // Contato
        CONTACT: '/api/contact/',
        
        // Trabalhadores
        WORKERS: '/api/workers/',
    }
};

// Função para fazer requisições à API
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Método para obter headers padrão
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Adicionar token de autenticação se existir
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Adicionar CSRF token se existir
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        return headers;
    }

    // Obter CSRF token
    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return null;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Métodos específicos
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Métodos específicos para funcionalidades

    // Enviar formulário de contato
    async sendContactForm(formData) {
        return this.post(API_CONFIG.ENDPOINTS.CONTACT, formData);
    }

    // Obter lista de serviços
    async getServices() {
        return this.get(API_CONFIG.ENDPOINTS.SERVICES);
    }

    // Obter categorias de serviços
    async getServiceCategories() {
        return this.get(API_CONFIG.ENDPOINTS.SERVICE_CATEGORIES);
    }

    // Login
    async login(credentials) {
        return this.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    }

    // Logout
    async logout() {
        return this.post(API_CONFIG.ENDPOINTS.LOGOUT, {});
    }

    // Registrar usuário
    async register(userData) {
        return this.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    }
}

// Instância global da API
const apiClient = new APIClient();

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.apiClient = apiClient;