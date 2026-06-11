import api from './api';

export const registerUser = (payload) => api.post('/api/auth/register', payload);
export const loginUser = (payload) => api.post('/api/auth/login', payload);
export const getCurrentUser = () => api.get('/api/auth/me');