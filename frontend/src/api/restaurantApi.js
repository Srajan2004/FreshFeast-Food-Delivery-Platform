import api from './axiosClient'

export const restaurantApi = {
  getAll: (search) => api.get('/api/restaurants', { params: { search } }).then(r => r.data),
  getById: (id) => api.get(`/api/restaurants/${id}`).then(r => r.data),
  getMine: () => api.get('/api/restaurants/mine').then(r => r.data),
  create: (data) => api.post('/api/restaurants', data).then(r => r.data),
  update: (id, data) => api.put(`/api/restaurants/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/api/restaurants/${id}`).then(r => r.data),
}
