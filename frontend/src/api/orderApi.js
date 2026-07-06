import api from './axiosClient'

export const orderApi = {
  place: (data) => api.post('/api/orders', data).then(r => r.data),
  getMine: () => api.get('/api/orders/mine').then(r => r.data),
  getForRestaurant: (restaurantId) => api.get(`/api/orders/restaurant/${restaurantId}`).then(r => r.data),
  getById: (id) => api.get(`/api/orders/${id}`).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }).then(r => r.data),
}
