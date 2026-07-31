// ===== Complete Mock Data for Frontend Demo =====

const now = new Date();
const today = now.toISOString().split('T')[0];

// ===== Users =====
export const mockUsers = [
  { id: 'u1', username: 'admin', email: 'admin@clinic.com', name: 'Administrator', role: 'administrator', isActive: true },
  { id: 'u2', username: 'dr.sari', email: 'drsari@clinic.com', name: 'Dr. Sari', role: 'dokter', isActive: true },
  { id: 'u3', username: 'dr.budi', email: 'drbudi@clinic.com', name: 'Dr. Budi', role: 'dokter', isActive: true },
  { id: 'u4', username: 'petugas1', email: 'petugas1@clinic.com', name: 'Ani Petugas', role: 'petugas_pendaftaran', isActive: true },
];

// ===== Polyclinics =====
export const mockPolyclinics = [
  { id: 'p1', name: 'Umum', description: 'Poli pelayanan umum' },
  { id: 'p2', name: 'Gigi', description: 'Poli kesehatan gigi dan mulut' },
  { id: 'p3', name: 'Anak', description: 'Poli kesehatan anak' },
  { id: 'p4', name: 'Mata', description: 'Poli kesehatan mata' },
];

// ===== Patients =====
export const mockPatients = [
  { id: 'pat1', medicalRecordNumber: 'RM-202607-0001', nik: '3201234567890001', name: 'Ahmad Fauzi', gender: 'L', birthDate: '1990-05-12', phone: '081234567890', address: 'Jl. Merdeka No. 1, Jakarta', createdAt: '2026-07-01T08:00:00Z' },
  { id: 'pat2', medicalRecordNumber: 'RM-202607-0002', nik: '3201234567890002', name: 'Siti Nurhaliza', gender: 'P', birthDate: '1985-08-22', phone: '081234567891', address: 'Jl. Sudirman No. 45, Jakarta', createdAt: '2026-07-02T09:00:00Z' },
  { id: 'pat3', medicalRecordNumber: 'RM-202607-0003', nik: '3201234567890003', name: 'Budi Santoso', gender: 'L', birthDate: '1978-01-15', phone: '081234567892', address: 'Jl. Gatot Subroto No. 78, Jakarta', createdAt: '2026-07-03T10:00:00Z' },
  { id: 'pat4', medicalRecordNumber: 'RM-202607-0004', nik: '3201234567890004', name: 'Dewi Lestari', gender: 'P', birthDate: '1995-11-30', phone: '081234567893', address: 'Jl. Thamrin No. 12, Jakarta', createdAt: '2026-07-05T11:00:00Z' },
  { id: 'pat5', medicalRecordNumber: 'RM-202607-0005', nik: '3201234567890005', name: 'Rudi Hartono', gender: 'L', birthDate: '2000-03-20', phone: '081234567894', address: 'Jl. Asia Afrika No. 56, Bandung', createdAt: '2026-07-10T07:00:00Z' },
  { id: 'pat6', medicalRecordNumber: 'RM-202607-0006', nik: '3201234567890006', name: 'Maya Indah', gender: 'P', birthDate: '1992-07-14', phone: '081234567895', address: 'Jl. Diponegoro No. 33, Jakarta', createdAt: '2026-07-12T08:30:00Z' },
  { id: 'pat7', medicalRecordNumber: 'RM-202607-0007', nik: '3201234567890007', name: 'Hendra Gunawan', gender: 'L', birthDate: '1988-09-05', phone: '081234567896', address: 'Jl. Pahlawan No. 7, Surabaya', createdAt: '2026-07-15T09:00:00Z' },
  { id: 'pat8', medicalRecordNumber: 'RM-202607-0008', nik: '3201234567890008', name: 'Rina Marlina', gender: 'P', birthDate: '2002-12-25', phone: '081234567897', address: 'Jl. Kemerdekaan No. 21, Jakarta', createdAt: '2026-07-18T10:00:00Z' },
  { id: 'pat9', medicalRecordNumber: 'RM-202607-0009', nik: '3201234567890009', name: 'Agus Wijaya', gender: 'L', birthDate: '1975-04-10', phone: '081234567898', address: 'Jl. Veteran No. 90, Jakarta', createdAt: '2026-07-20T11:00:00Z' },
  { id: 'pat10', medicalRecordNumber: 'RM-202607-0010', nik: '3201234567890010', name: 'Fitri Handayani', gender: 'P', birthDate: '1998-06-18', phone: '081234567899', address: 'Jl. Ahmad Yani No. 15, Jakarta', createdAt: '2026-07-22T07:00:00Z' },
];

// ===== Registrations for today =====
const todayRegistrations = [
  {
    id: 'reg1', patientId: 'pat1', doctorId: 'u2', polyclinicId: 'p1',
    registrationDate: today, paymentType: 'bpjs', complaint: 'Demam dan batuk sejak 3 hari',
    status: 'selesai', createdAt: `${today}T07:30:00Z`, queueNumber: 'U001'
  },
  {
    id: 'reg2', patientId: 'pat3', doctorId: 'u2', polyclinicId: 'p1',
    registrationDate: today, paymentType: 'umum', complaint: 'Sakit kepala dan pusing',
    status: 'pemeriksaan', createdAt: `${today}T08:00:00Z`, queueNumber: 'U002'
  },
  {
    id: 'reg3', patientId: 'pat5', doctorId: 'u3', polyclinicId: 'p2',
    registrationDate: today, paymentType: 'umum', complaint: 'Sakit gigi berlubang',
    status: 'dipanggil', createdAt: `${today}T08:15:00Z`, queueNumber: 'G001'
  },
  {
    id: 'reg4', patientId: 'pat2', doctorId: 'u2', polyclinicId: 'p1',
    registrationDate: today, paymentType: 'bpjs', complaint: 'Pengecekan rutin tekanan darah',
    status: 'menunggu', createdAt: `${today}T08:30:00Z`, queueNumber: 'U003'
  },
  {
    id: 'reg5', patientId: 'pat8', doctorId: 'u3', polyclinicId: 'p3',
    registrationDate: today, paymentType: 'asuransi', complaint: 'Batuk pilek pada anak',
    status: 'menunggu', createdAt: `${today}T08:45:00Z`, queueNumber: 'A001'
  },
  {
    id: 'reg6', patientId: 'pat6', doctorId: 'u2', polyclinicId: 'p1',
    registrationDate: today, paymentType: 'umum', complaint: 'Nyeri ulu hati',
    status: 'menunggu', createdAt: `${today}T09:00:00Z`, queueNumber: 'U004'
  },
  {
    id: 'reg7', patientId: 'pat10', doctorId: 'u3', polyclinicId: 'p2',
    registrationDate: today, paymentType: 'bpjs', complaint: 'Sakit gigi bungsu',
    status: 'menunggu', createdAt: `${today}T09:15:00Z`, queueNumber: 'G002'
  },
];

// ===== Queues =====
function findQueueStatus(regId) {
  const r = todayRegistrations.find(x => x.id === regId);
  if (!r) return 'menunggu';
  if (r.status === 'selesai') return 'selesai';
  if (r.status === 'pemeriksaan') return 'pemeriksaan';
  if (r.status === 'dipanggil') return 'dipanggil';
  return 'menunggu';
}

export const mockQueues = todayRegistrations.map(r => ({
  id: `q_${r.id}`,
  registrationId: r.id,
  queueNumber: r.queueNumber,
  status: findQueueStatus(r.id),
  calledAt: r.status === 'dipanggil' || r.status === 'pemeriksaan' ? `${today}T08:20:00Z` : null,
  createdAt: r.createdAt,
}));

// Helper to find registration by id
export const getRegistrationById = (id) => todayRegistrations.find(r => r.id === id);
export const getPatientById = (id) => mockPatients.find(p => p.id === id);

// Build registration responses (fully loaded)
export function buildRegistrationResponse(reg) {
  return {
    ...reg,
    patient: getPatientById(reg.patientId) || null,
    doctor: mockUsers.find(u => u.id === reg.doctorId) || null,
    polyclinic: mockPolyclinics.find(p => p.id === reg.polyclinicId) || null,
    queue: mockQueues.find(q => q.registrationId === reg.id) || null,
  };
}

// ===== Medical Records (sample history) =====
export const mockMedicalRecords = [
  {
    id: 'mr1',
    registrationId: 'reg_prev1',
    patientId: 'pat1',
    doctorId: 'u2',
    subjective: 'Demam sejak 2 hari, suhu 38.5°C, batuk kering',
    objectiveBloodPressure: '120/80',
    objectiveTemperature: 38.5,
    objectiveWeight: 68,
    objectiveHeight: 170,
    assessment: 'ISPA (Infeksi Saluran Pernafasan Akut)',
    plan: 'Istirahat cukup, minum air putih hangat, kontrol 3 hari lagi jika demam tidak turun',
    createdAt: '2026-07-20T10:00:00Z',
    doctor: { id: 'u2', name: 'Dr. Sari' },
    registration: { polyclinic: { name: 'Umum' } },
    medicalActions: [
      { id: 'ma1', actionName: 'Pemberian obat demam', actionDescription: 'Parasetamol 500mg', cost: 15000 },
    ],
    prescriptions: [
      { id: 'pr1', drugName: 'Parasetamol 500mg', dosage: '3x sehari', quantity: 10, instructions: 'Sesudah makan' },
      { id: 'pr2', drugName: 'Ambroxol', dosage: '3x sehari', quantity: 10, instructions: 'Sesudah makan' },
    ]
  },
  {
    id: 'mr2',
    registrationId: 'reg_prev2',
    patientId: 'pat3',
    doctorId: 'u2',
    subjective: 'Sakit kepala hebat, pusing berputar, mual',
    objectiveBloodPressure: '140/90',
    objectiveTemperature: 36.8,
    objectiveWeight: 75,
    objectiveHeight: 172,
    assessment: 'Hipertensi Grade 1',
    plan: 'Kontrol tekanan darah rutin, kurangi konsumsi garam, olahraga teratur',
    createdAt: '2026-07-15T11:00:00Z',
    doctor: { id: 'u2', name: 'Dr. Sari' },
    registration: { polyclinic: { name: 'Umum' } },
    medicalActions: [],
    prescriptions: [
      { id: 'pr3', drugName: 'Amlodipine 5mg', dosage: '1x sehari', quantity: 30, instructions: 'Pagi setelah makan' },
    ]
  },
  {
    id: 'mr3',
    registrationId: 'reg_prev3',
    patientId: 'pat5',
    doctorId: 'u3',
    subjective: 'Sakit gigi kanan bawah, nyeri saat mengunyah',
    objectiveBloodPressure: '110/70',
    objectiveTemperature: 36.5,
    objectiveWeight: 62,
    objectiveHeight: 165,
    assessment: 'Karies gigi molar 2 kanan bawah',
    plan: 'Rencana tambal gigi, kontrol 1 minggu',
    createdAt: '2026-07-10T09:30:00Z',
    doctor: { id: 'u3', name: 'Dr. Budi' },
    registration: { polyclinic: { name: 'Gigi' } },
    medicalActions: [
      { id: 'ma2', actionName: 'Pembersihan karies', actionDescription: 'ECC (Excavasi Caries)', cost: 100000 },
    ],
    prescriptions: [
      { id: 'pr4', drugName: 'Asam Mefenamat 500mg', dosage: '3x sehari', quantity: 6, instructions: 'Sesudah makan jika nyeri' },
    ]
  },
];

// ===== State (mutable, for demo) =====
let demoState = {
  patients: [...mockPatients],
  registrations: todayRegistrations.map(r => ({ ...r })),
  queues: mockQueues.map(q => ({ ...q })),
  medicalRecords: [...mockMedicalRecords],
  users: [...mockUsers],
  polyclinics: [...mockPolyclinics],
};
let idCounter = 100;

export function getDemoState() { return demoState; }
export function nextId(prefix) { return `${prefix}${++idCounter}`; }

// Demo login check
export function demoLogin(username, password) {
  const user = demoState.users.find(u => u.username === username);
  if (!user || password !== 'password123') return null;
  return { ...user };
}
