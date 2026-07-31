import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Patients
export const patientsAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Registrations
export const registrationsAPI = {
  getAll: (params) => api.get('/registrations', { params }),
  create: (data) => api.post('/registrations', data),
  update: (id, data) => api.put(`/registrations/${id}`, data),
};

// Queues
export const queuesAPI = {
  getAll: (params) => api.get('/queues', { params }),
  call: (id) => api.put(`/queues/${id}/call`),
  updateStatus: (id, status) => api.put(`/queues/${id}/status`, { status }),
};

// Medical Records
export const medicalRecordsAPI = {
  create: (data) => api.post('/medical-records', data),
  getById: (id) => api.get(`/medical-records/${id}`),
  getByPatient: (patientId) => api.get(`/medical-records/patient/${patientId}`),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// Referensi
export const referensiAPI = {
  getDoctors: () => api.get('/referensi/doctors'),
  getPolyclinics: () => api.get('/referensi/polyclinics'),
};
