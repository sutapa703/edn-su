import axios from 'axios';

// Use the provided API URL
const API_BASE_URL = 'https://miniature-parakeet-green.vercel.app/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Student endpoints
export const studentAPI = {
  getAllCourses: () => api.get('/student/courses'),
  getEnrolledCourses: () => api.get('/student/my-courses'),
  enrollCourse: (courseId) => api.post(`/student/courses/${courseId}/enroll`),
  unenrollCourse: (courseId) => api.post(`/student/courses/${courseId}/unenroll`),
};

// Admin endpoints
export const adminAPI = {
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (courseId, data) => api.put(`/admin/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
