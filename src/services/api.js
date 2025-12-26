import axios from 'axios';

// Use Laravel dev server base URL (no trailing /api)
// Final request becomes: baseURL + '/api/...' from service files
const API_BASE_URL = 'http://127.0.0.1:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

export default apiClient;