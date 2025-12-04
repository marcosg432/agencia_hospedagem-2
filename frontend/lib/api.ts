import axios from 'axios';

// Determinar URL da API
const getApiUrl = () => {
  // Em produção, usar variável de ambiente
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Em desenvolvimento, usar localhost
  if (typeof window !== 'undefined') {
    // No browser, verificar se estamos em localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
  }
  
  // Fallback padrão
  return 'http://localhost:4000/api';
};

const API_URL = getApiUrl();

console.log('[API] URL Base configurada:', API_URL);
console.log('[API] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'não definido');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);
    
    // Log completo em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Request config:', {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL}${response.config.url}`;
    console.log(`[API] ✓ ${response.config.method?.toUpperCase()} ${fullUrl} - Status: ${response.status}`);
    if (process.env.NODE_ENV === 'development' && response.data) {
      console.log('[API] Response data:', response.data);
    }
    return response;
  },
  (error) => {
    const fullUrl = error.config ? `${error.config.baseURL}${error.config.url}` : 'URL desconhecida';
    
    console.error(`[API] ✗ ${error.config?.method?.toUpperCase() || 'REQUEST'} ${fullUrl}`);
    console.error('[API] Erro completo:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
      request: error.request ? 'Request enviado mas sem resposta' : null,
    });
    
    // Tratamento detalhado de erros
    if (!error.response) {
      // Erro de rede (sem resposta do servidor)
      let errorMessage = 'Erro de conexão com o servidor.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: O servidor demorou muito para responder.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Conexão recusada: O servidor backend não está rodando ou não está acessível.';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Servidor não encontrado: Verifique se a URL da API está correta.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Erro de rede: Verifique sua conexão com a internet e se o backend está rodando.';
      }
      
      const networkError = new Error(errorMessage);
      (networkError as any).isNetworkError = true;
      (networkError as any).code = error.code;
      (networkError as any).originalError = error;
      (networkError as any).apiUrl = API_URL;
      
      console.error('[API] Detalhes do erro de rede:', {
        message: errorMessage,
        code: error.code,
        apiUrl: API_URL,
        originalError: error.message,
      });
      
      return Promise.reject(networkError);
    }
    
    // Erro com resposta do servidor
    console.error('[API] Status code:', error.response.status);
    console.error('[API] Error details:', error.response.data);
    
    return Promise.reject(error);
  }
);

export default api;


