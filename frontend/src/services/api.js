import axios from 'axios';

// Get base URL from environment or default to local API
let rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure the baseURL ends with '/api'
if (rawBaseURL && !rawBaseURL.endsWith('/api') && !rawBaseURL.endsWith('/api/')) {
  rawBaseURL = `${rawBaseURL.replace(/\/$/, '')}/api`;
}

const API = axios.create({
  baseURL: rawBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if present
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('travelbuddy_user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
