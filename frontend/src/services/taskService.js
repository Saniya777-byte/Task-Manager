import api from './api';

export const fetchTasks = (params) => api.get('/api/tasks', { params });
export const fetchTask = (id) => api.get(`/api/tasks/${id}`);
export const createTask = (payload) => api.post('/api/tasks', payload);
export const updateTask = (id, payload) => api.put(`/api/tasks/${id}`, payload);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
export const updateTaskStatus = (id, status) =>
  api.patch(`/api/tasks/${id}/status`, { status });