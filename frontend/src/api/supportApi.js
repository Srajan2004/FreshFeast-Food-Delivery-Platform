import api from './axiosClient'

export const supportApi = {
  create: (data) => api.post('/api/support/tickets', data).then(r => r.data),
  getMine: () => api.get('/api/support/tickets/mine').then(r => r.data),
  getAll: () => api.get('/api/support/tickets').then(r => r.data),
  update: (id, data) => api.patch(`/api/support/tickets/${id}`, data).then(r => r.data),
}
