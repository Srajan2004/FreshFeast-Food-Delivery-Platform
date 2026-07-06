import api from './axiosClient'

export const analyticsApi = {
  getForRestaurant: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/analytics`).then(r => r.data),
}
