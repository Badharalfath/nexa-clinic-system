# Project State

> Current operational handoff. Keep concise update after each completed
> task or material blocker.

- Last updated: 2026-08-03T02:15:00+07:00
- Status: Stitch design system implemented into frontend; verified live
- Current milestone: Milestone 0 Specification baseline (design work done as unblocked priority)
- Active task: Resolve AS-001 through AS-009

## Objective

Implement every in-scope requirement from product/PRD/design sources.

## Source documents

- Product source: `/Users/alfatih/Downloads/ABDM/Documents/TECHNICAL ASSIGNMENT PROGRAMMER NEXA.pdf`
- PRD: `prd/nexa-clinic-system.prd.md` version 1.1
- Design: `DESIGN.md` (repo root, from Google Stitch) + `stitch_prd_design_implementation/` (5 screens)
- Requirements: `REQUIREMENTS.md`
- Plan: `IMPLEMENTATION_PLAN.md`
- Verification matrix: `TEST_MATRIX.md`

## Current implementation

Frontend restyled to the Google Stitch "NEXA CIS" design system
(Corporate Modern / Clinical Blue #005EB8, Inter + Courier Prime,
4px/8px radii, status tokens slate/sky/amber/emerald). Backend
unchanged (18 endpoints, PostgreSQL, JWT — previously E2E verified).

## Verification commands

| Gate | Command | Last result |
|---|---|---|
| Lint | `npm run lint` (frontend) | Passing, 8 warnings (pre-existing), 2026-08-02 |
| Production build | `npm run build` (frontend) | Passing, 2026-08-02 |
| Dev runtime | `npm run dev -- --port 5173` | Passing, all routes loaded |
| E2E / browser | Desktop: login, dashboard, patients, registrations, queues, examination, history | Passing, 2026-08-02 |
| Queue flow E2E | U007/G002: menunggu → dipanggil → pemeriksaan → selesai | Passing, 2026-08-02 |
| SOAP submit E2E | DONI KUSUMA record saved (vitals 120/80, 36.8, 70, 172) | Passing, 2026-08-02 |
| Visual evidence | `docs/screenshots/implemented-dashboard.png`, `implemented-queues.png` | Captured, 2026-08-02 |

## Completed work

- 2026-08-03: Rebuilt `docs/erd-diagram.html` as a Chen-style ERD visual:
  - Entities use rectangles, relationships use diamonds, and core attributes use ovals.
  - All nine relations carry cardinality labels, including the two `0..1` registration child relations.
  - Rendered `docs/erd-diagram.png` was visually reviewed at 1760 × 1600.

- 2026-08-03: Verified and corrected the ERD against `backend/database/schema.sql`:
  - `docs/erd.mmd` documents all 8 persisted tables, key columns, and 9 FK relationships.
  - `docs/erd-mapping.html` shows orthogonal relationship lines and `1` / `0..*` / `0..1` cardinalities.
  - Corrected the two registration child relations to optional one-to-one (`0..1`): a registration is allowed to exist before its queue or SOAP record.

- 2026-08-02: Implemented Stitch design system in frontend (see DECISIONS D-003):
  - `index.css` rewritten to Clinical Blue tokens (all existing class names kept)
  - Navy sidebar (NEXA CIS), topbar user chip + logout
  - Dashboard: Stitch KPI cards + Antrean Berikutnya panel + Aksi Cepat (real data)
  - Patients: master-data toolbar (search + sort), mono RM/NIK, auto-RM banner modal
  - Queues: hero panel (antrean saat ini, Panggil Berikutnya, stats) + queue table
  - Examination: patient header (avatar initials), vitals grid with unit suffixes
  - Login/history/registrations restyled; status badges slate/sky/amber/emerald
- Fixed `statusTone` object called as function (ErrorBoundary catch, browser console).

## Known failures / risks

- `REQUIREMENTS.md` and `TEST_MATRIX.md` still lack the full
  requirement-by-requirement implementation audit (Milestone 0 pending).
- Open business assumptions AS-001 through AS-009 require decisions.
- Browser session resets (localStorage cleared) between some tool calls — environment
  quirk of the remote browser, not app code; verified via API for persistence.

## Exact next action

Resolve AS-001 through AS-009, then audit FR-001 through FR-029 and
API-001 through API-018 into `REQUIREMENTS.md` and `TEST_MATRIX.md`.
