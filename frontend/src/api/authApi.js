import api from './axiosClient'

export const authApi = {
  login: (data) => api.post('/api/auth/login', data).then(r => r.data),
  register: (data) => api.post('/api/auth/register', data).then(r => r.data),
}
