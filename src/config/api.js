// Centralized API Configuration for Twinora AI
// Connects to Render production backend by default, or VITE_API_URL if provided

const envUrl = import.meta.env?.VITE_API_URL || '';

export const API_URL = envUrl 
  ? envUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '')
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://twinora-backend.onrender.com');

export const API_BASE = `${API_URL}/api`;

export default { API_URL, API_BASE };
