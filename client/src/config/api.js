// API Configuration - uses environment variable or defaults for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.20.10.5:3000';

export default API_BASE_URL;
