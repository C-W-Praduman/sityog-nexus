// API Configuration - uses environment variable or defaults for production
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http:///172.20.10.5:3000'; // Default for development

export default API_BASE_URL;
``