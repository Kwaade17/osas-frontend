// Automatically uses your live deployed backend URL, or falls back to localhost during development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';