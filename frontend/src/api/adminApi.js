import api from './axiosClient'

export const adminApi = {
  getUsers: () => api.get('/api/admin/users').then(r => r.data),
  updateUserStatus: (id, status) => api.patch(`/api/admin/users/${id}/status`, { status }).then(r => r.data),
  getStats: () => api.get('/api/admin/stats').then(r => r.data),
}
