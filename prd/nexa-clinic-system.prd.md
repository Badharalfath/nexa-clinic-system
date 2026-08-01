# PRD: Mini Clinic Information System (NEXA)

**Status:** Source-aligned baseline

**Version:** 1.1

**Date:** 2026-08-01

**Primary source:** `TECHNICAL ASSIGNMENT PROGRAMMER NEXA.pdf`

## 1. Source and interpretation rules

This PRD translates the NEXA technical assignment into traceable product
requirements. The PDF is the normative source.

- A requirement labelled **PDF requirement** is mandatory because it appears in
  the assignment.
- A statement labelled **Project decision** is an implementation choice and is
  not mandated by the PDF.
- A statement labelled **Open assumption** must be agreed by the project and
  documented in the final README before it becomes binding.
- This PRD does not use implementation status as proof of compliance. Evidence
  and verification status belong in `REQUIREMENTS.md` and `TEST_MATRIX.md`.
- If this PRD conflicts with the PDF, the PDF takes precedence.

## 2. Assignment context

This is a take-home test for the Programmer position with an estimated
completion time of approximately three working days.

The clinic currently performs much of its patient service manually, causing
irregular queues, scattered patient records, and difficulty reviewing patient
examination history.

The requested solution is a web-based Mini Clinic Information System that
integrates the main clinic service processes:

1. Patient data management
2. Visit registration
3. Queue management
4. Doctor examination records

The application does not need to cover every clinic business process. It must
demonstrate database design, REST API development, user-interface development,
and working frontend-backend integration.

## 3. Mandatory technology

| Component | PDF requirement |
|---|---|
| Frontend | React.js |
| Backend | Node.js with Express.js |
| Database | PostgreSQL or MySQL |
| Authentication | JSON Web Token (JWT) |
| Version control | Git |

Supporting libraries are allowed as long as they do not replace the mandatory
primary technologies.

## 4. Functional requirements

Every item in this section is a PDF requirement.

### 4.1 Authentication

| ID | Requirement | Acceptance statement |
|---|---|---|
| FR-001 | Login | A user can log in through JWT authentication. |
| FR-002 | Logout | An authenticated user can log out. |
| FR-003 | Role-based authorization | The system supports at least Administrator, Dokter, and Petugas Pendaftaran and restricts access by role. |

The PDF does not define the detailed permission matrix for each role. That
matrix is an open assumption listed in Section 11.

### 4.2 Master data pasien

Patient data must include:

- Nomor Rekam Medis, generated automatically
- NIK
- Nama Pasien
- Jenis Kelamin
- Tanggal Lahir
- Nomor Telepon
- Alamat

| ID | Requirement | Acceptance statement |
|---|---|---|
| FR-004 | Tambah Data | An authorized user can create patient data. |
| FR-005 | Ubah Data | An authorized user can update patient data. |
| FR-006 | Hapus Data | An authorized user can delete patient data. |
| FR-007 | Detail Data | An authorized user can view patient details. |
| FR-008 | Pencarian | An authorized user can search patient data. |
| FR-009 | Pagination | The patient list supports pagination. |
| FR-010 | NIK unik | Duplicate NIK values are rejected. |
| FR-011 | Nomor Rekam Medis otomatis | The system generates the medical record number automatically. |

The PDF does not prescribe NIK length or character format, nor does it define
which patient fields must be searchable.

### 4.3 Pendaftaran pasien

Registration data must include:

- Pasien
- Dokter
- Poli
- Tanggal Kunjungan
- Jenis Pembayaran
- Keluhan Awal

| ID | Requirement | Acceptance statement |
|---|---|---|
| FR-012 | Pendaftaran kunjungan | An authorized user can register a patient visit using all required registration data. |
| FR-013 | Status kunjungan | A visit supports the statuses Menunggu, Check In, Pemeriksaan, and Selesai. |

The PDF does not prescribe the allowed values for Jenis Pembayaran.

### 4.4 Antrean

| ID | Requirement | Acceptance statement |
|---|---|---|
| FR-014 | Generate nomor antrean | The system generates a queue number automatically. |
| FR-015 | Daftar antrean | The system displays the patient queue list. |
| FR-016 | Panggil antrean berikutnya | An authorized user can call the next queue. |
| FR-017 | Ubah status antrean | An authorized user can change a queue status. |

The PDF gives `A001`, `A002`, and `A003` as examples. It does not require a
polyclinic initial, define reset timing, or prescribe the complete queue-status
set.

### 4.5 Pemeriksaan dokter

The examination must use SOAP:

| ID | SOAP section | Required data |
|---|---|---|
| FR-018 | Subjective | Keluhan Pasien |
| FR-019 | Objective | Tekanan Darah, Suhu Tubuh, Berat Badan, and Tinggi Badan |
| FR-020 | Assessment | Diagnosa |
| FR-021 | Plan | Rencana Terapi |

Additional required examination features:

| ID | Requirement | Acceptance statement |
|---|---|---|
| FR-022 | Input Tindakan Medis | A doctor can record medical actions. |
| FR-023 | Input Resep Obat | A doctor can record a prescription. |
| FR-024 | Riwayat Pemeriksaan Pasien | An authorized user can review a patient's examination history. |

The PDF does not prescribe the detailed fields for medical actions or
prescriptions.

### 4.6 Dashboard

The dashboard must be simple and display:

| ID | Required indicator |
|---|---|
| FR-025 | Total Pasien |
| FR-026 | Total Pasien Hari Ini |
| FR-027 | Total Antrean Hari Ini |
| FR-028 | Total Pasien Menunggu |
| FR-029 | Total Pasien Selesai Dilayani |

The PDF does not define whether "Total Pasien Hari Ini" means newly created
patient records or patient visits today. This is an open assumption.

## 5. Minimum REST API

The backend must provide at least these endpoint paths as listed in the PDF.

| ID | Method and path |
|---|---|
| API-001 | `POST /login` |
| API-002 | `POST /logout` |
| API-003 | `GET /patients` |
| API-004 | `GET /patients/{id}` |
| API-005 | `POST /patients` |
| API-006 | `PUT /patients/{id}` |
| API-007 | `DELETE /patients/{id}` |
| API-008 | `GET /registrations` |
| API-009 | `POST /registrations` |
| API-010 | `PUT /registrations/{id}` |
| API-011 | `GET /queues` |
| API-012 | `POST /queues` |
| API-013 | `PUT /queues/{id}/call` |
| API-014 | `PUT /queues/{id}/status` |
| API-015 | `POST /medical-records` |
| API-016 | `GET /medical-records/{patientId}` |
| API-017 | `POST /prescriptions` |
| API-018 | `GET /prescriptions/{id}` |

### 5.1 Response format

All endpoints are expected to use a consistent response format.

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {}
}
```

## 6. Engineering requirements

Every item below comes from Section F or G of the PDF:

- Use an application architecture that is structured and easy to extend.
- Implement the REST API well.
- Use appropriate database relationships.
- Validate data on both the frontend and backend.
- Handle errors well.
- Use Git throughout development.
- Do not hard-code database credentials, JWT secrets, or other sensitive
  configuration in source code or the repository.
- Include `.env.example`.

The PDF does not mandate MVC, Sequelize, Joi, bcrypt, a JWT expiration period,
specific performance thresholds, or a particular test framework.

## 7. UI/UX requirement

The PDF does not prescribe a specific application, theme, component library,
layout, or responsive breakpoint. It requires the interface to be:

- Neat
- Easy to use
- Consistent

## 8. Required deliverables

| No. | Deliverable |
|---|---|
| 1 | Frontend source code using React.js |
| 2 | Backend source code using Node.js |
| 3 | Database `.sql` file |
| 4 | Entity Relationship Diagram (ERD) |
| 5 | Postman Collection |
| 6 | `README.md` |
| 7 | `.env.example` |
| 8 | GitHub or GitLab repository with development commit history |
| 9 | Application demonstration video with a maximum duration of 10 minutes |

The README must contain:

- Application installation instructions
- Application run instructions
- Project structure
- Login accounts
- `.env` configuration
- Database migration instructions, if migrations are used
- Any business-process assumptions or simplifications

The repository must show the development process through commit history and
should not contain only one final commit.

## 9. Evaluation criteria

| Evaluation aspect | Weight |
|---|---:|
| Database Design (ERD and Database Relations) | 15% |
| REST API and Backend Implementation | 20% |
| Frontend Implementation (React.js) | 20% |
| Authentication and Authorization | 10% |
| Clean Code and Project Structure | 10% |
| Data Validation and Error Handling | 10% |
| Documentation (README, Postman, ERD) | 10% |
| Git Commit History | 5% |
| **Total** | **100%** |

The assignment is expected to be completed independently. Supporting libraries
are allowed if the required primary technologies remain unchanged.

## 10. Project decisions, not PDF requirements

The current repository has selected the following implementation and design
choices. They must not be presented as NEXA-mandated requirements:

- PostgreSQL rather than MySQL
- Sequelize ORM
- Joi validation
- bcrypt-compatible password hashing
- MVC-style backend folders
- React with Vite
- A light medical theme, sidebar navigation, modal forms, and a queue board
- Mock data for the frontend user-flow prototype before real integration

These choices may be retained as long as they comply with the PDF.

## 11. Open assumptions requiring an explicit project decision

| ID | Topic not specified by the PDF |
|---|---|
| AS-001 | Exact role-permission matrix beyond the three minimum roles |
| AS-002 | Searchable patient fields |
| AS-003 | NIK length and character format beyond uniqueness |
| AS-004 | Allowed Jenis Pembayaran values |
| AS-005 | Queue-number prefix, sequence scope, and reset timing |
| AS-006 | Queue-status values and transitions |
| AS-007 | Whether queue and registration status changes synchronize automatically |
| AS-008 | Detailed fields for medical actions and prescriptions |
| AS-009 | Meaning and date boundaries of dashboard totals |

Accepted assumptions or business-process simplifications must be documented in
the final README, as permitted by the PDF.

## 12. Source coverage matrix

This table records PRD coverage of the source. It is not an implementation
completion report.

| PDF section | PRD coverage |
|---|---|
| A. Informasi Umum | Assignment context and delivery constraint recorded |
| B. Studi Kasus | Section 2 |
| C. Teknologi yang Digunakan | Section 3 |
| D.1 Authentication | FR-001 through FR-003 |
| D.2 Master Data Pasien | FR-004 through FR-011 |
| D.3 Modul Pendaftaran Pasien | FR-012 and FR-013 |
| D.4 Modul Antrean | FR-014 through FR-017 |
| D.5 Modul Pemeriksaan Dokter | FR-018 through FR-024 |
| D.6 Dashboard | FR-025 through FR-029 |
| E. REST API Minimum | API-001 through API-018 and Section 5.1 |
| F. Ketentuan Pengerjaan | Section 6 |
| G. Deliverables | Section 8 |
| H. Kriteria Penilaian and Catatan | Sections 7, 9, and 11 |

## Change log

| Date | Version | Change |
|---|---|---|
| 2026-07-31 | 1.0 | Initial PRD based on the assignment and frontend review. |
| 2026-08-01 | 1.1 | Corrected the PRD to separate exact PDF requirements from project decisions and open assumptions. |
