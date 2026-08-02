# Tasks Mini Clinic Information System

Based on: TECHNICAL ASSIGNMENT PROGRAMMER NEXA

## Deliverables
1. Source Code Frontend (React.js)
2. Source Code Backend (Node.js Express)
3. File Database (.sql)
4. Entity Relationship Diagram (ERD)
5. Postman Collection
6. README.md (instalasi, struktur, akun, .env, migrasi)
7. File .env.example
8. Repository GitHub (commit history lengkap)
9. Video demo (max 10 menit)

## Scoring
| Aspect | Weight |
|--------|--------|
| Database Design (ERD & Relations) | 15% |
| REST API Backend Implementation | 20% |
| Frontend Implementation (React.js) | 20% |
| Authentication & Authorization | 10% |
| Clean Code & Project Structure | 10% |
| Validation & Error Handling | 10% |
| Documentation (README, Postman, ERD) | 10% |
| Git Commit History | 5% |
| **Total** | **100%** |

## Tech Stack
- Frontend: React.js
- Backend: Node.js (Express.js)
- Database: PostgreSQL
- Auth: JWT
- Version Control: Git

## Task log

### T-2026-08-02-01 Implement Stitch design system in frontend — DONE
- Acceptance criteria (all verified, 2026-08-02):
  - [x] Design tokens (Clinical Blue #005EB8, Inter, radii, status colors) applied in `frontend/src/index.css`
  - [x] Navy sidebar "NEXA CIS" + topbar user chip + logout (Layout.jsx)
  - [x] Dashboard KPI cards + Antrean Berikutnya panel + Aksi Cepat (real API data)
  - [x] Patients: toolbar search+sort, mono RM/NIK, auto-RM modal banner
  - [x] Queues: hero panel + queue table with status badges
  - [x] Examination: patient header, vitals grid with unit suffixes (mmHg/°C/kg/cm)
  - [x] Login/history/registrations rebranded and restyled
  - [x] `npm run lint` 0 errors; `npm run build` passing; browser E2E on all routes

## Active task

Resolve AS-001 through AS-009 (open assumptions), then audit FR-001..FR-029
and API-001..API-018 into `REQUIREMENTS.md` + `TEST_MATRIX.md` (Milestone 0).
