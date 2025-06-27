// services/api.js
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true

export const authAPI = {
  register: (userData) => axios.post(`${API_BASE}/auth/register`, userData),
  login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
  profile: () => axios.get(`${API_BASE}/auth/profile`),
  logout: () => axios.post(`${API_BASE}/auth/logout`)
}

export const postsAPI = {
  getAll: () => axios.get(`${API_BASE}/posts`),
  getById: (id) => axios.get(`${API_BASE}/posts/${id}`),
  create: (post) => axios.post(`${API_BASE}/posts`, post),
  update: (id, post) => axios.put(`${API_BASE}/posts/${id}`, post),
  delete: (id) => axios.delete(`${API_BASE}/posts/${id}`)
}

export const commentsAPI = {
  getByPost: (postId) => axios.get(`${API_BASE}/${postId}/comments`),
  create: (postId, comment) => axios.post(`${API_BASE}/${postId}/comments`, comment),
  delete: (postId, commentId) => axios.delete(`${API_BASE}/${postId}/comments/${commentId}`)
}