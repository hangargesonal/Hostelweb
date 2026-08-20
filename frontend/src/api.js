import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

export const studentApi = {
  all: () => api.get('/students'),
  get: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`)
}

export const attendanceApi = {
  byDate: (date) => api.get(`/attendance?date=${date}`),
  save: (data) => api.post('/attendance', data)
}

export const leavingApi = {
  all: () => api.get('/leaving'),
  create: (data) => api.post('/leaving', data),
  status: (id, status) => api.put(`/leaving/${id}/status?status=${status}`)
}

export const dashboardApi = {
  get: () => api.get('/dashboard')
}
