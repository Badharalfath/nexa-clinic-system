# NEXA Clinic System — Sistem Informasi Klinik Mini

Sistem informasi klinik mini (full-stack) yang dibuat sebagai tugas technical test.
Aplikasi ini mengelola alur pelayanan pasien secara lengkap:
**pendaftaran → antrean → pemeriksaan (SOAP) → tindakan & resep**,
dengan kontrol akses berdasarkan peran (administrator, dokter, petugas pendaftaran),
REST API, dan database PostgreSQL.

![ERD](docs/ERD.png)

---

## Teknologi yang Digunakan

| Lapisan | Teknologi |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Axios, sistem ikon SVG sendiri |
| **Backend** | Node.js, Express 5, Sequelize 6 (ORM), PostgreSQL |
| **Keamanan** | JWT (masa berlaku 8 jam), bcryptjs untuk hashing password, Helmet, CORS |
| **Validasi** | Joi di sisi backend; NIK 16 digit + cek kolom wajib di sisi frontend |
| **Lainnya** | Postman collection, Git (commit bertahap), ERD |

---

## Fitur Utama

- **Login berbasis peran** — satu endpoint login, sistem yang menentukan peran:
  `administrator`, `dokter`, `petugas_pendaftaran`
- **Pengelolaan pasien** — tambah, ubah, lihat, hapus; NIK divalidasi harus
  tepat 16 digit; nomor rekam medis dibuat otomatis (`RM-YYYYMM-XXXX`)
- **Pendaftaran & antrean** — pendaftaran dengan keluhan dan jenis pembayaran,
  nomor antrean (`U001`/`G001`), status `menunggu → dipanggil → pemeriksaan → selesai`
- **Pemeriksaan (SOAP)** — Subjective, Objective (tekanan darah, suhu, berat
  badan, tinggi badan), Assessment, Plan
- **Tindakan & resep** — tercatat pada setiap pemeriksaan
- **Arsip / hapus lunak** — pasien diarsipkan secara default (data klinis tidak
  pernah hilang, sesuai aturan penyimpanan rekam medis); hapus permanen hanya
  untuk administrator dengan transaksi berantai (cascade)
- **Pasien terakhir diperiksa** — dashboard dokter menampilkan pasien yang baru
  saja diperiksa
- **Tampilan responsif** — sidebar rail + drawer, nyaman di desktop maupun HP

---

## Struktur Project

```
nexa-clinic-system/
├── backend/
│   ├── src/
│   │   ├── config/         # konfigurasi database & env
│   │   ├── controllers/    # penangan permintaan (route handler)
│   │   ├── middleware/     # autentikasi, peran, penanganan error
│   │   ├── models/         # model Sequelize (8 tabel)
│   │   ├── routes/         # rute REST API
│   │   ├── seeders/        # data contoh (users, patients, dll.)
│   │   ├── utils/          # helper respons API
│   │   └── validators/     # skema validasi Joi
│   ├── database/
│   │   └── schema.sql      # skema lengkap PostgreSQL
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # klien axios
│   │   ├── components/     # komponen bersama (Icon.jsx, Sidebar, dll.)
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Auth, Dashboard, Patients, Registrations,
│   │   │                   # Queues, MedicalRecords, MasterData
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── docs/
│   └── ERD.png             # Entity Relationship Diagram
├── postman/                # collection & environment Postman
└── prd/                    # Product Requirements Document
```

---

## Struktur Database (8 tabel)

`USERS`, `PATIENTS`, `POLYCLINICS`, `REGISTRATIONS`, `QUEUES`,
`MEDICAL_RECORDS`, `MEDICAL_ACTIONS`, `PRESCRIPTIONS`

- Relasi antar tabel dijamin dengan foreign key dan `ON DELETE CASCADE`
- `registrations → queues` dan `registrations → medical_records` bersifat 1:1
  (foreign key unik per pendaftaran)
- Skema lengkap ada di [`backend/database/schema.sql`](backend/database/schema.sql)

---

## Cara Menjalankan

### Kebutuhan

- Node.js versi 18 ke atas
- PostgreSQL versi 14 ke atas (lokal, atau pakai Docker)
- npm

### 1. Database

```bash
# Cara A — jalankan skema langsung
psql -U postgres -c "CREATE DATABASE clinic_system;"
psql -U postgres -d clinic_system -f backend/database/schema.sql

# Cara B — pakai Docker
docker run -d --name nexa-postgres -p 5432:5432 \
  -e POSTGRES_DB=clinic_system -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # lalu ubah DB_PASSWORD dan JWT_SECRET
npm install
npm run sync:force          # membuat tabel + mengisi data contoh
npm run dev                 # server jalan di http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # buka http://localhost:5174
```

Setelah itu buka **http://localhost:5174** di browser.

---

## Akun Demo

| Peran | Username |
|---|---|
| Administrator | `admin` |
| Dokter | `dr.sari`, `dr.budi` |
| Petugas pendaftaran | `petugas1` |

Semua akun demo memakai password yang sama (lihat `backend/src/seeders/seed.js`).
Halaman login juga menyediakan tombol akun demo yang bisa diklik untuk mengisi
username otomatis.

---

## Daftar REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| POST | `/auth/login` | Login, mengembalikan JWT | Publik |
| POST | `/auth/logout` | Logout | Sudah login |
| GET | `/auth/me` | Profil pengguna yang login | Sudah login |
| GET | `/dashboard` | Statistik dashboard | Sudah login |
| GET | `/referensi/doctors` | Daftar dokter | Sudah login |
| GET | `/referensi/polyclinics` | Daftar poliklinik | Sudah login |
| GET | `/patients` | Daftar pasien (dengan paginasi) | Sudah login |
| GET | `/patients/:id` | Detail pasien | Sudah login |
| GET | `/patients/:id/related-counts` | Jumlah data terkait pasien | Sudah login |
| POST | `/patients` | Tambah pasien | admin / petugas |
| PUT | `/patients/:id` | Ubah pasien | admin / petugas |
| DELETE | `/patients/:id` | Arsipkan pasien (hapus lunak) | Administrator |
| DELETE | `/patients/:id/permanent` | Hapus permanen (cascade) | Administrator |
| GET | `/registrations` | Daftar pendaftaran | Sudah login |
| POST | `/registrations` | Buat pendaftaran | admin / petugas |
| PUT | `/registrations/:id` | Ubah pendaftaran | admin / petugas |
| GET | `/queues` | Daftar antrean | Sudah login |
| PUT | `/queues/:id/call` | Panggil antrean berikutnya | Sudah login |
| PUT | `/queues/:id/status` | Ubah status antrean | Sudah login |
| GET | `/medical-records/recent-patients` | Pasien terakhir diperiksa | Sudah login |
| GET | `/medical-records/:id` | Detail pemeriksaan | Sudah login |
| GET | `/medical-records/patient/:patientId` | Riwayat pasien | Sudah login |
| POST | `/medical-records` | Buat catatan SOAP | Dokter |
| POST | `/medical-records/:id/prescriptions` | Tambah resep | Dokter |
| GET | `/medical-records/prescriptions/:id` | Detail resep | Sudah login |

Semua endpoint yang dilindungi memerlukan header: `Authorization: Bearer <token>`.

---

## Dokumentasi API (Postman)

Collection siap import tersedia di folder [`postman/`](postman/):

- `NEXA Clinic System API.postman_collection.json` — 23 request dalam
  7 folder, lengkap dengan script auto-token (login otomatis mengisi `token`
  di environment dan collection variables)
- Environment: `baseUrl = http://localhost:5000/api`

Cara pakai: import kedua file di Postman → aktifkan environment → jalankan
request **Login** → `token` terisi otomatis → semua request lain langsung jalan.

---

## Verifikasi

- Frontend: `npm run lint` (oxlint) — 0 error; `npm run build` berhasil
- Backend: server berjalan, cek `GET /api/health` → `{"success": true}`
- E2E: login → dashboard → pendaftaran pasien → antrean → pemeriksaan SOAP
  sudah diuji di browser dengan Playwright

---

## Lisensi

ISC — untuk keperluan penilaian.
