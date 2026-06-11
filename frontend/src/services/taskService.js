import api from './api';

export const fetchTasks = (params) => api.get('/tasks', { params });
export const fetchTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (payload) => api.post('/tasks', payload);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
