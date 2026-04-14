import axios from 'axios';

const BASE = 'http://localhost:5000/api/tasks';
const client = axios.create({ baseURL: BASE, timeout: 15000, headers: { 'Content-Type': 'application/json' } });

client.interceptors.response.use(r => r, err => {
  err.userMessage = (err.response && err.response.data && err.response.data.error) || err.message || 'Error';
  return Promise.reject(err);
});

export const getAllTasks = (p) => client.get('/', { params: p || {} });
export const getTaskById = (id) => client.get('/' + id);
export const createTask = (t) => client.post('/', t);
export const createTaskWithAI = (input) => client.post('/ai', { naturalLanguageInput: input });
export const updateTask = (id, t) => client.put('/' + id, t);
export const deleteTask = (id) => client.delete('/' + id);
export const getStats = () => client.get('/stats/summary');
