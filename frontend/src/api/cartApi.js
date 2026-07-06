import api from './axiosClient'

export const cartApi = {
  getCart: () => api.get('/api/cart').then(r => r.data),
  addItem: (data) => api.post('/api/cart/items', data).then(r => r.data),
  updateItem: (cartItemId, data) => api.put(`/api/cart/items/${cartItemId}`, data).then(r => r.data),
  removeItem: (cartItemId) => api.delete(`/api/cart/items/${cartItemId}`).then(r => r.data),
  clearCart: () => api.delete('/api/cart').then(r => r.data),
}
