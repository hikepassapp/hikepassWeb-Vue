import axios from 'axios';

// Use Laravel dev server base URL (no trailing /api)
// Final request becomes: baseURL + '/api/...' from service files
const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Interceptor untuk handle FormData
apiClient.interceptors.request.use(
  (config) => {
    // Jika FormData, biarkan browser set Content-Type dengan boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      // Untuk JSON request, set Content-Type
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;