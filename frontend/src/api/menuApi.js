import api from './axiosClient'

export const menuApi = {
  getMenuItems: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/menu-items`).then(r => r.data),
  getCategories: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/categories`).then(r => r.data),
  addCategory: (restaurantId, data) => api.post(`/api/restaurants/${restaurantId}/categories`, data).then(r => r.data),
  addMenuItem: (restaurantId, data) => api.post(`/api/restaurants/${restaurantId}/menu-items`, data).then(r => r.data),
  updateMenuItem: (itemId, data) => api.put(`/api/menu-items/${itemId}`, data).then(r => r.data),
  deleteMenuItem: (itemId) => api.delete(`/api/menu-items/${itemId}`).then(r => r.data),
}
