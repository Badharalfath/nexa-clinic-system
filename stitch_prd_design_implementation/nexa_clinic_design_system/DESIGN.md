---
name: NEXA Clinic Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424752'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#006970'
  on-secondary: '#ffffff'
  secondary-container: '#7af1fc'
  on-secondary-container: '#006e75'
  tertiary: '#224683'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d5e9d'
  on-tertiary-container: '#cbd9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#5dd8e2'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#aec6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#224583'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  status-waiting: '#64748B'
  status-checkin: '#0EA5E9'
  status-exam: '#F59E0B'
  status-done: '#10B981'
  error-red: '#EF4444'
  border-subtle: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1.5rem
  margin-page: 2rem
  sidebar-width: 260px
  stack-gap: 1rem
  table-cell-padding: 1rem 1.5rem
---

## Brand & Style

The design system for the NEXA Clinic Information System is built upon the pillars of **Trust, Efficiency, and Clarity**. As a medical tool, the interface must prioritize cognitive ease for healthcare professionals who manage high-stress environments and sensitive patient data.

### Design Style: Corporate Modern
The system utilizes a **Corporate Modern** aesthetic. It focuses on a highly structured layout, balanced proportions, and a professional atmosphere that feels reliable and "institutional" without being cold. 

- **Reliability:** Through a stable, blue-centric palette and systematic spacing.
- **Precision:** Through sharp typography and subtle, clear-cut borders.
- **Efficiency:** Through a "neat and easy to use" philosophy that minimizes visual noise and maximizes data legibility.

The target audience includes Administrators, Doctors, and Registration Officers, requiring a UI that remains legible during long shifts and functional across various clinical workflows.

## Colors

The palette is anchored by "Clinical Blue" to establish immediate professional trust.

- **Primary (#005EB8):** Used for primary actions, active navigation states, and key brand moments.
- **Secondary (#00A3AD):** A teal-leaning blue used for secondary highlights, accents in data visualization, and medical-specific focus areas.
- **Tertiary (#002F6C):** Deep navy for high-contrast text and sidebar backgrounds to create a strong structural hierarchy.
- **Neutral (#F8FAFC):** A cool-toned off-white that reduces glare on screens compared to pure white, essential for clinical environments.

**Status Badge Colors:**
- **Menunggu (Waiting):** Slate gray to denote a neutral, pending state.
- **Check In:** Bright sky blue to signal active entry.
- **Pemeriksaan (Exam):** Amber to indicate "in-progress" and require attention.
- **Selesai (Done):** Emerald green for successful completion.

## Typography

The typography system relies on **Inter** for its exceptional legibility and neutral character, which is critical for reading medical records and numbers (NIK, Rekam Medis).

- **Hierarchy:** Use `headline-lg` strictly for dashboard overviews and page titles.
- **Data Display:** `body-md` is the workhorse for table data. For automated ID numbers like "Nomor Rekam Medis," a monospaced alternative (`mono-data`) can be used to ensure character alignment and prevent misreading.
- **Readability:** Maintain a line height of at least 1.5 for body text to ensure clinical notes in the SOAP sections are easy to scan.
- **Labels:** Use `label-md` in all-caps for table headers and form labels to distinguish them clearly from input data.

## Layout & Spacing

The system uses a **Fixed Grid** approach for the main content area to maintain a consistent reading line, with a persistent sidebar for primary navigation.

- **Grid:** A 12-column grid system. On desktop, content is contained within a max-width container, centered.
- **Sidebar:** Fixed at 260px. It contains the role-based navigation links.
- **Data Tables:** These are the heart of the system. Use generous horizontal padding (1.5rem) and tight vertical padding (1rem) to allow for high data density without feeling cluttered.
- **Forms:** SOAP inputs and patient registration forms should follow a single-column or two-column stack with a 1rem gap between fields to prevent user fatigue.
- **Breakpoints:**
  - **Mobile (< 768px):** Sidebar collapses into a hamburger menu. Margins reduce to 1rem. Headlines scale down (e.g., `headline-lg` becomes 24px).
  - **Tablet (768px - 1024px):** Two-column form layouts collapse to one.

## Elevation & Depth

To maintain a "neat" and "professional" look, this design system avoids heavy shadows, instead using **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** The neutral background (#F8FAFC).
- **Level 1 (Cards/Surface):** Pure white (#FFFFFF) surfaces with a 1px solid border (#E2E8F0). This is used for data tables, form containers, and dashboard widgets.
- **Level 2 (Modals/Popovers):** Used for "Tambah Pasien" or "Detail Data" views. These use a very soft, diffused shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.05)) to separate them from the background.
- **Interactive States:** Buttons and clickable rows use a subtle background color shift (darkening by 5%) rather than an elevation increase to keep the interface feeling "flat" and stable.

## Shapes

The shape language is **Soft**. We use a 0.25rem (4px) base radius for standard UI elements. 

- **Buttons & Inputs:** 0.25rem (4px) corner radius. This conveys modern professionalism without the "playfulness" of highly rounded or pill-shaped elements.
- **Cards & Data Containers:** 0.5rem (8px) for larger structural elements like the main table container or dashboard cards.
- **Status Badges:** These are the only exception, utilizing a "Full Pill" (999px) radius to distinguish them as status indicators rather than interactive buttons or input fields.

## Components

### Status Badges
Badges should have a low-opacity background of their status color with high-contrast text of the same hue.
*   *Example:* "Selesai" has a light green background with dark green text.

### Data Tables
- **Header:** Background #F1F5F9 with `label-md` typography.
- **Rows:** Alternating "Zebra" striping is discouraged; instead, use a subtle 1px bottom border between rows.
- **Actions:** Icons for "Edit" and "Hapus" should be secondary-colored and grouped at the end of the row.

### Medical Forms (SOAP)
- **Grouping:** Group S, O, A, and P into clearly labeled sections with sub-headers.
- **Inputs:** Use standard text inputs for S, A, and P. Use "Input Groups" for O (Objective) where units (kg, °C, mmHg) are appended as suffixes inside the field.

### Dashboard Widgets
- **Metric Cards:** Large `headline-lg` numbers with a small `label-md` description below. Use a primary-colored icon in the corner to provide a visual anchor for each metric (e.g., a "Users" icon for Total Pasien).

### Buttons
- **Primary:** Solid #005EB8 with white text.
- **Secondary:** Outline #005EB8 with clear background.
- **Critical (Hapus):** Outline #EF4444 to prevent accidental data loss.