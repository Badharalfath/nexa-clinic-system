# Progress — nexa-clinic-system

## Phase 0: Setup ✅
- [x] Create repository (Badharalfath/nexa-clinic-system)
- [x] Init project structure (backend + frontend skeleton)
- [x] Initialize backend (Node.js + Express + Sequelize + JWT)
- [x] Initialize frontend (React.js + Vite)
- [x] Git identity configured

## Phase 1: Database Design ✅
- [x] ERD (Entity Relationship Diagram) — HTML visual
- [x] Database schema models (8 Sequelize models)
- [x] Associations & relations defined (FK eksplisit + field mapping)
- [x] SQL schema file with auto-generate triggers & seed data
- [x] Sync & seed scripts (dotenv fix)

## Phase 2: Authentication ✅ (tested)
- [x] JWT login/logout/me (admin, dokter, petugas — verified)
- [x] Role-based authorization (403 for wrong roles — verified)

## Phase 3-7: Backend API ✅ (tested live on PostgreSQL 16)
- [x] Patients CRUD: auto RM# (RM-202608-0001...), NIK unik, search, pagination — verified
- [x] Registrations: auto queue (U001/G001 format), joins patient/doctor/polyclinic — verified
- [x] Queue: list, call (sync reg → check_in), status, invalid rejected — verified
- [x] Medical Records SOAP: + actions + prescriptions inline, auto-selesai, dupe rejected — verified
- [x] Dashboard stats — verified
- [x] Referensi (doctors, polyclinics) — verified
- [x] 18 endpoint PDF E semua aktif — verified E2E

## Phase 8: Frontend ✅ (approved flow)
- [x] Auth context + protected routes
- [x] All pages (dashboard, patients, registrations, queue, SOAP, history)
- [x] Mock API mode (USE_MOCK) — frontend demo tanpa backend
- [x] Light medical theme "Klinik Sehat" (typographic logo, SVG icons, no emoji)
- [x] Patient detail view, visit date, check_in status, NIK 16-digit validation
- [x] "Panggil Berikutnya" explicit queue action
- [x] Responsive sidebar (rail tablet / drawer mobile)
- [x] ErrorBoundary + unmount-safe fetches (no white screen)

## Phase 9: PRD & Docs
- [x] PRD folder (prd/nexa-clinic-system.prd.md) — acuan PDF
- [ ] README.md final
- [ ] Postman Collection
- [ ] Video Demo
- [ ] .env.example final check
- [ ] Frontend ↔ Backend integration (switch USE_MOCK off)
- [ ] Final push

## Backend Milestones (git history)
- M1: foundation + auth (dotenv, auth path fix) — `6961f7d`
- M2: patients API + auto RM# — `31c62c0`
- M3: registrations/queue + FK models fix — `2cee575`
- M4: medical records + prescriptions + dashboard — `82dc297`
- M5: E2E integration verified — next commit
