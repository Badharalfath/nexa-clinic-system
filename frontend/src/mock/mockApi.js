// Mock API Handler - intercepts axios-style API calls and returns mock data
import {
  getDemoState, nextId, mockUsers, mockPolyclinics,
  buildRegistrationResponse, getPatientById, getRegistrationById,
  demoLogin
} from './mockData';

let currentUser = null;

// Simulated delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// Pagination helper
function paginate(arr, page = 1, limit = 10) {
  const total = arr.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  return {
    data: arr.slice(offset, offset + limit),
    pagination: { total, page: Number(page), limit: Number(limit), totalPages }
  };
}

// Deep clone to avoid mutation issues
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ===== API Handler =====
export async function mockApi(method, url, data = null, params = {}) {
  await delay(200 + Math.random() * 300);

  const s = getDemoState();

  // --- AUTH ---
  if (url === '/api/auth/login' && method === 'post') {
    const user = demoLogin(data.username, data.password);
    if (!user) return { status: 401, data: { success: false, message: 'Invalid username or password' } };
    currentUser = user;
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, name: user.name }));
    return {
      status: 200,
      data: {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role }
        }
      }
    };
  }

  if (url === '/api/auth/logout' && method === 'post') {
    currentUser = null;
    return { status: 200, data: { success: true, message: 'Logout successful', data: null } };
  }

  if (url === '/api/auth/me' && method === 'get') {
    if (!currentUser) {
      // Try to restore from token (page refresh)
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const decoded = JSON.parse(atob(token));
          currentUser = mockUsers.find(u => u.id === decoded.id) || null;
        } catch { /* ignore invalid token */ }
      }
    }
    if (!currentUser) return { status: 401, data: { success: false, message: 'Unauthorized' } };
    return { status: 200, data: { success: true, data: currentUser } };
  }

  // --- REFERENSI ---
  if (url === '/api/referensi/doctors' && method === 'get') {
    return { status: 200, data: { success: true, data: clone(mockUsers.filter(u => u.role === 'dokter')) } };
  }
  if (url === '/api/referensi/polyclinics' && method === 'get') {
    return { status: 200, data: { success: true, data: clone(mockPolyclinics) } };
  }

  // --- DASHBOARD ---
  if (url === '/api/dashboard' && method === 'get') {
    const today = new Date().toISOString().split('T')[0];
    const todayRegs = s.registrations.filter(r => r.registrationDate === today);
    return {
      status: 200,
      data: {
        success: true,
        data: {
          totalPatients: s.patients.length,
          todayPatients: todayRegs.length,
          todayQueues: s.queues.filter(q => q.status !== 'selesai' && q.status !== 'lewat').length,
          waitingPatients: s.queues.filter(q => q.status === 'menunggu').length,
          completedPatients: s.queues.filter(q => q.status === 'selesai').length,
        }
      }
    };
  }

  // --- PATIENTS ---
  if (url.startsWith('/api/patients') && method === 'get') {
    // Check if /patients/:id
    const matchId = url.match(/^\/api\/patients\/([^/]+)$/);
    if (matchId) {
      const p = s.patients.find(pat => pat.id === matchId[1]);
      if (!p) return { status: 404, data: { success: false, message: 'Patient not found' } };
      return { status: 200, data: { success: true, data: clone(p) } };
    }
    // List with search & pagination
    let filtered = [...s.patients];
    const search = (params.search || '').toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.nik.includes(search) ||
        (p.medicalRecordNumber || '').toLowerCase().includes(search)
      );
    }
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    filtered.sort((a, b) => {
      const va = a[sortBy] || '', vb = b[sortBy] || '';
      return sortOrder === 'ASC' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    const result = paginate(filtered, page, limit);
    // Match real backend contract: { patients, pagination }
    return { status: 200, data: { success: true, data: { patients: result.data, pagination: result.pagination } } };
  }

  if (url.startsWith('/api/patients') && method === 'post') {
    const existingNIK = s.patients.find(p => p.nik === data.nik);
    if (existingNIK) {
      return { status: 400, data: { success: false, message: 'NIK already exists', errors: [{ path: 'nik', message: 'NIK already exists' }] } };
    }
    const lastRM = s.patients[s.patients.length - 1]?.medicalRecordNumber || 'RM-202607-0000';
    const seq = String(parseInt(lastRM.split('-')[2]) + 1).padStart(4, '0');
    const newPatient = {
      id: nextId('pat'),
      medicalRecordNumber: `RM-202607-${seq}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    s.patients.push(newPatient);
    return { status: 201, data: { success: true, data: clone(newPatient), message: 'Patient created successfully' } };
  }

  if (method === 'put' && url.match(/^\/api\/patients\/([^/]+)$/)) {
    const id = url.match(/^\/api\/patients\/([^/]+)$/)[1];
    const idx = s.patients.findIndex(p => p.id === id);
    if (idx === -1) return { status: 404, data: { success: false, message: 'Patient not found' } };
    // Check NIK uniqueness
    const dupeNik = s.patients.find((p, i) => p.nik === data.nik && i !== idx);
    if (dupeNik) return { status: 400, data: { success: false, message: 'NIK already exists' } };
    s.patients[idx] = { ...s.patients[idx], ...data, updatedAt: new Date().toISOString() };
    return { status: 200, data: { success: true, data: clone(s.patients[idx]), message: 'Patient updated successfully' } };
  }

  if (method === 'delete' && url.match(/^\/api\/patients\/([^/]+)$/)) {
    const id = url.match(/^\/api\/patients\/([^/]+)$/)[1];
    const idx = s.patients.findIndex(p => p.id === id);
    if (idx === -1) return { status: 404, data: { success: false, message: 'Patient not found' } };
    s.patients.splice(idx, 1);
    return { status: 200, data: { success: true, data: null, message: 'Patient deleted successfully' } };
  }

  // --- REGISTRATIONS ---
  if (url === '/api/registrations' && method === 'get') {
    let filtered = [...s.registrations];
    const { page = 1, limit = 10, status, date } = params;
    if (status) { const sts = status.split(','); filtered = filtered.filter(r => sts.includes(r.status)); }
    if (date) filtered = filtered.filter(r => r.registrationDate === date);

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const result = paginate(filtered, page, limit);
    const enriched = result.data.map(r => buildRegistrationResponse(r));
    return { status: 200, data: { success: true, data: { registrations: enriched, pagination: result.pagination } } };
  }

  if (url === '/api/registrations' && method === 'post') {
    const newReg = {
      id: nextId('reg'),
      patientId: data.patientId,
      doctorId: data.doctorId,
      polyclinicId: data.polyclinicId,
      registrationDate: data.registrationDate || new Date().toISOString().split('T')[0],
      paymentType: data.paymentType,
      complaint: data.complaint || '',
      status: 'menunggu',
      createdAt: new Date().toISOString(),
    };
    s.registrations.push(newReg);

    // Auto-create queue
    const polyInitial = (mockPolyclinics.find(p => p.id === data.polyclinicId)?.name?.[0] || 'U').toUpperCase();
    const seqNum = String(s.queues.filter(q => q.queueNumber?.startsWith(polyInitial)).length + 1).padStart(3, '0');
    const newQueue = {
      id: nextId('q_'),
      registrationId: newReg.id,
      queueNumber: `${polyInitial}${seqNum}`,
      status: 'menunggu',
      calledAt: null,
      createdAt: new Date().toISOString(),
    };
    s.queues.push(newQueue);

    const enriched = buildRegistrationResponse({ ...newReg, queueNumber: newQueue.queueNumber });
    return { status: 201, data: { success: true, data: enriched, message: 'Registration created successfully' } };
  }

  if (method === 'put' && url.match(/^\/api\/registrations\/([^/]+)$/)) {
    const id = url.match(/^\/api\/registrations\/([^/]+)$/)[1];
    const idx = s.registrations.findIndex(r => r.id === id);
    if (idx === -1) return { status: 404, data: { success: false, message: 'Registration not found' } };
    s.registrations[idx] = { ...s.registrations[idx], ...data, updatedAt: new Date().toISOString() };
    return { status: 200, data: { success: true, data: clone(s.registrations[idx]), message: 'Registration updated' } };
  }

  // --- QUEUES ---
  if (url === '/api/queues' && method === 'get') {
    let filtered = [...s.queues];
    const { status, date } = params;
    if (status) { const sts = status.split(','); filtered = filtered.filter(q => sts.includes(q.status)); }
    // Enrich
    const enriched = filtered.map(q => ({
      ...q,
      registration: (() => {
        const reg = s.registrations.find(r => r.id === q.registrationId);
        if (!reg) return null;
        return buildRegistrationResponse(reg);
      })()
    }));
    enriched.sort((a, b) => {
      const order = ['menunggu', 'dipanggil', 'pemeriksaan', 'selesai'];
      return order.indexOf(a.status) - order.indexOf(b.status) || a.queueNumber?.localeCompare(b.queueNumber);
    });
    return { status: 200, data: { success: true, data: enriched } };
  }

  if (method === 'put' && url.match(/^\/api\/queues\/([^/]+)\/call$/)) {
    const id = url.match(/^\/api\/queues\/([^/]+)\/call$/)[1];
    const qIdx = s.queues.findIndex(q => q.id === id);
    if (qIdx === -1) return { status: 404, data: { success: false, message: 'Queue not found' } };
    s.queues[qIdx].status = 'dipanggil';
    s.queues[qIdx].calledAt = new Date().toISOString();
    // Sync registration
    const regIdx = s.registrations.findIndex(r => r.id === s.queues[qIdx].registrationId);
    if (regIdx !== -1) s.registrations[regIdx].status = 'check_in';
    return { status: 200, data: { success: true, data: clone(s.queues[qIdx]), message: 'Queue called' } };
  }

  if (method === 'put' && url.match(/^\/api\/queues\/([^/]+)\/status$/)) {
    const id = url.match(/^\/api\/queues\/([^/]+)\/status$/)[1];
    const qIdx = s.queues.findIndex(q => q.id === id);
    if (qIdx === -1) return { status: 404, data: { success: false, message: 'Queue not found' } };
    s.queues[qIdx].status = data.status;
    // Sync registration
    const statusMap = { dipanggil: 'check_in', pemeriksaan: 'pemeriksaan', selesai: 'selesai', lewat: 'selesai' };
    const regIdx = s.registrations.findIndex(r => r.id === s.queues[qIdx].registrationId);
    if (regIdx !== -1 && statusMap[data.status]) {
      s.registrations[regIdx].status = statusMap[data.status];
    }
    return { status: 200, data: { success: true, data: clone(s.queues[qIdx]), message: 'Status updated' } };
  }

  // --- MEDICAL RECORDS ---
  if (method === 'post' && url === '/api/medical-records') {
    const record = {
      id: nextId('mr'),
      registrationId: data.registrationId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      subjective: data.subjective || '',
      objectiveBloodPressure: data.objectiveBloodPressure || '',
      objectiveTemperature: data.objectiveTemperature || null,
      objectiveWeight: data.objectiveWeight || null,
      objectiveHeight: data.objectiveHeight || null,
      assessment: data.assessment || '',
      plan: data.plan || '',
      createdAt: new Date().toISOString(),
      doctor: mockUsers.find(u => u.id === data.doctorId) || null,
      registration: { polyclinic: { name: mockPolyclinics.find(p => p.id === s.registrations.find(r => r.id === data.registrationId)?.polyclinicId)?.name || '' } },
      medicalActions: (data.medicalActions || []).map((a, i) => ({ id: nextId('ma'), ...a })),
      prescriptions: (data.prescriptions || []).map((p, i) => ({ id: nextId('pr'), ...p })),
    };
    s.medicalRecords.push(record);

    // Mark registration and queue as selesai
    const regIdx = s.registrations.findIndex(r => r.id === data.registrationId);
    if (regIdx !== -1) s.registrations[regIdx].status = 'selesai';
    const qIdx = s.queues.findIndex(q => q.registrationId === data.registrationId);
    if (qIdx !== -1) { s.queues[qIdx].status = 'selesai'; }

    return { status: 201, data: { success: true, data: clone(record), message: 'Medical record created' } };
  }

  if (method === 'get' && url.match(/^\/api\/medical-records\/patient\/([^/]+)$/)) {
    const patientId = url.match(/^\/api\/medical-records\/patient\/([^/]+)$/)[1];
    const records = s.medicalRecords
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { status: 200, data: { success: true, data: clone(records) } };
  }

  if (method === 'get' && url === '/api/medical-records/recent-patients') {
    const seen = new Map();
    const sorted = [...s.medicalRecords].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    for (const r of sorted) {
      const pid = r.patient?.id || r.registrationId;
      const prev = seen.get(pid);
      if (prev) {
        prev.visitCount += 1;
      } else {
        seen.set(pid, {
          patient: r.patient || null,
          lastVisit: r.createdAt,
          lastPolyclinic: r.registration?.polyclinic?.name || null,
          lastDoctor: r.doctor?.name || null,
          visitCount: 1,
        });
      }
    }
    return { status: 200, data: { success: true, data: clone(Array.from(seen.values()).slice(0, 15)) } };
  }

  if (method === 'get' && url.match(/^\/api\/medical-records\/([^/]+)$/)) {
    const id = url.match(/^\/api\/medical-records\/([^/]+)$/)[1];
    const record = s.medicalRecords.find(r => r.id === id);
    if (!record) return { status: 404, data: { success: false, message: 'Record not found' } };
    return { status: 200, data: { success: true, data: clone(record) } };
  }

  // Fallback
  console.warn(`[MockAPI] Unhandled: ${method.toUpperCase()} ${url}`, { data, params });
  return { status: 404, data: { success: false, message: 'Mock endpoint not implemented' } };
}
