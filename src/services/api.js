import axios from 'axios';

// Use legacy API server for Paket Wisata and Berita Event (port 5000)
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

export default apiClient;