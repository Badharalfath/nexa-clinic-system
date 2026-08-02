import axios from 'axios';

// Toggle to switch between mock and real backend
const USE_MOCK = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

if (USE_MOCK) {
  // Replace the HTTP adapter with mock handler
  api.defaults.adapter = async (config) => {
    const { mockApi } = await import('../mock/mockApi');

    const method = config.method.toLowerCase();
    const url = config.baseURL + config.url;
    // Normalize URL to just the path for matching in mockApi
    const path = url.replace(/^https?:\/\/[^/]+/, '');
    // config.data might be string (transformed) or object (raw in adapter)
    let data = config.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = null; }
    }
    const params = config.params || {};

    console.log(`[Mock] ${method.toUpperCase()} ${path}`, data);
    const res = await mockApi(method, path, data, params);

    // Build axios-compatible response
    const response = {
      data: res.data,
      status: res.status,
      statusText: res.status === 200 || res.status === 201 ? 'OK' : 'Error',
      headers: {},
      config,
    };

    // 401 handling (same as real API)
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here for initial getMe check
    }

    if (res.status >= 400) {
      return Promise.reject({ response });
    }

    return response;
  };
} else {
  // Real backend interceptors
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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
}

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
  getRecentPatients: () => api.get('/medical-records/recent-patients'),
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
