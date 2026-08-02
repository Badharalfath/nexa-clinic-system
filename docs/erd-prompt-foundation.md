# 🧱 Prompt Fondasi — Pembuatan ERD Mini Clinic Information System

> Prompt siap pakai ini diekstrak dari project `nexa-clinic-system` (schema aktual dari
> Sequelize models + `database/schema.sql`). Gunakan sebagai fondasi untuk membuat ERD
> dalam 3 format: **diagram Chen**, **mapping relasional**, dan **Mermaid erDiagram**.

---

## Cara pakai

1. Salin blok **"PROMPT"** di bawah.
2. Tempel ke AI (ChatGPT/Claude/Gemini) atau ke tool diagram (mermaid.live, draw.io).
3. Untuk gambar ala buku teks (Chen + mapping): minta AI menghasilkan **HTML+SVG** dengan
   spesifikasi dari prompt, lalu screenshot.
4. Untuk README: cukup tempel bagian **Mermaid** langsung.

---

## PROMPT

```
Buatkan Entity Relationship Diagram (ERD) lengkap untuk "Mini Clinic Information System"
— sistem informasi klinik dengan 8 entitas. Ikuti spesifikasi di bawah ini PERSIS.

## Gaya diagram (pilih sesuai kebutuhan)
1) DIAGRAM KONSEPTUAL (notasi Chen, gaya buku teks Database Systems):
   - Entitas: kotak/persegi panjang, border hitam tebal 2px, teks tebal.
   - Relasi: belah ketupat (diamond) berisi kata kerja (DAFTAR, DITANGANI, POLI,
     MENGHASILKAN, PEMERIKSAAN, RIWAYAT, DOKTER, TINDAKAN, RESEP).
   - Atribut: oval/ellipse terhubung ke entitas via garis pendek.
   - Primary Key: digaris bawah. Foreign Key: warna biru.
   - SEMUA garis penghubung harus orthogonal (belok 90°), TIDAK BOLEH ada garis
     miring/diagonal, dan TIDAK BOLEH menimpa entitas/atribut/diamond.
   - Jangan gunakan CSS transform rotate untuk diamond (bounding box jadi salah);
     gunakan SVG <polygon> dengan koordinat presisi.
2) MAPPING RELASIONAL (tabel skema, gaya buku teks):
   - 8 tabel, header abu-abu (#dcdcdc), kolom atribut + tipe data, PK digaris bawah,
     FK biru.
   - Garis penghubung antar tabel: hitam, siku 90° murni (hanya H dan V).
3) MERMAID (untuk README GitHub):
   - Sintaks `erDiagram`, kardinalitas crow's foot (||--o{ , ||--||), label relasi
     bahasa Indonesia, komentar atribut dalam tanda kutip.

## ENTITAS & ATRIBUT (wajib persis)

USERS (pengguna sistem)
  id UUID PK
  username VARCHAR(50) UNIQUE
  email VARCHAR(100) UNIQUE
  password VARCHAR(255) — ter-hash, jangan tampilkan nilai
  name VARCHAR(100)
  role ENUM('administrator','dokter','petugas_pendaftaran')
  is_active BOOLEAN

PATIENTS (pasien)
  id UUID PK
  medical_record_number VARCHAR(20) UNIQUE — format RM-YYYYMM-XXXX, auto-generate
  nik VARCHAR(16) UNIQUE — tepat 16 digit
  name VARCHAR(100)
  gender ENUM('L','P')
  birth_date DATE
  phone VARCHAR(15)
  address TEXT
  deleted_at TIMESTAMP — soft delete (paranoid)

POLYCLINICS (poli)
  id UUID PK
  name VARCHAR(100) UNIQUE
  description TEXT

REGISTRATIONS (pendaftaran)
  id UUID PK
  patient_id UUID FK → patients.id
  doctor_id UUID FK → users.id
  polyclinic_id UUID FK → polyclinics.id
  registration_date DATE
  payment_type ENUM('umum','bpjs','asuransi')
  complaint TEXT
  status ENUM('menunggu','check_in','pemeriksaan','selesai')

QUEUES (antrean)
  id UUID PK
  registration_id UUID FK UNIQUE → registrations.id
  queue_number VARCHAR(10) — format U001/G001, auto-generate dari inisial poli
  status ENUM('menunggu','dipanggil','pemeriksaan','selesai','lewat')
  called_at TIMESTAMP

MEDICAL_RECORDS (pemeriksaan SOAP)
  id UUID PK
  registration_id UUID FK UNIQUE → registrations.id
  patient_id UUID FK → patients.id
  doctor_id UUID FK → users.id
  subjective TEXT (S — keluhan)
  objective_blood_pressure VARCHAR(20) (O)
  objective_temperature DECIMAL(4,1)
  objective_weight DECIMAL(5,1)
  objective_height DECIMAL(5,1)
  assessment TEXT (A — diagnosa)
  plan TEXT (P — rencana terapi)

MEDICAL_ACTIONS (tindakan medis)
  id UUID PK
  medical_record_id UUID FK → medical_records.id
  action_name VARCHAR(200)
  action_description TEXT
  cost DECIMAL(12,2)

PRESCRIPTIONS (resep obat)
  id UUID PK
  medical_record_id UUID FK → medical_records.id
  drug_name VARCHAR(200)
  dosage VARCHAR(100)
  quantity INTEGER
  instructions TEXT

## RELASI & KARDINALITAS (wajib persis)

1. USERS 1 ── N REGISTRATIONS  (dokter menangani pendaftaran, FK doctor_id)
2. USERS 1 ── N MEDICAL_RECORDS  (dokter membuat pemeriksaan, FK doctor_id)
3. PATIENTS 1 ── N REGISTRATIONS  (pasien mendaftar, FK patient_id)
4. PATIENTS 1 ── N MEDICAL_RECORDS  (pasien punya riwayat, FK patient_id)
5. POLYCLINICS 1 ── N REGISTRATIONS  (poli tujuan, FK polyclinic_id)
6. REGISTRATIONS 1 ── 1 QUEUES  (satu pendaftaran = satu antrean, FK registration_id)
7. REGISTRATIONS 1 ── 1 MEDICAL_RECORDS  (satu pendaftaran = maksimal satu SOAP,
   FK registration_id)
8. MEDICAL_RECORDS 1 ── N MEDICAL_ACTIONS  (tindakan, FK medical_record_id)
9. MEDICAL_RECORDS 1 ── N PRESCRIPTIONS  (resep, FK medical_record_id)

## ATURAN WAJIB

- Semua id UUID (bukan auto-increment integer).
- Soft delete HANYA di PATIENTS (kolom deleted_at), tabel lain hard delete.
- ON DELETE: registrations→queues & medical_records→actions/prescriptions = CASCADE;
  patients diarsipkan (soft delete), bukan dihapus.
- Label relasi pakai bahasa Indonesia (menangani, mendaftar, memiliki riwayat,
  menghasilkan antrean, pemeriksaan SOAP, tindakan, resep).
- Output: berikan (a) HTML+SVG siap render untuk diagram Chen, (b) HTML+SVG untuk
  mapping, (c) blok Mermaid erDiagram. Jangan omong kosong, langsung kode.
```

---

## Output yang dihasilkan prompt ini (contoh)

| Format | File di repo | Kegunaan |
|---|---|---|
| Mermaid | `docs/erd.mmd` | README GitHub (render otomatis) |
| Diagram Chen | `docs/erd-diagram.html/.png` | dokumentasi visual gaya buku |
| Mapping | `docs/erd-mapping.html/.png` | lampiran skema relasional |

## Verifikasi wajib setelah generate

- [ ] Tidak ada overlap antar entitas/diamond/atribut (cek bounding box programatik)
- [ ] Semua garis orthogonal (tidak ada path diagonal)
- [ ] 8 entitas, 9 relasi, kardinalitas benar
- [ ] PK/FK ditandai benar (underline / biru)
- [ ] Mermaid render tanpa error di mermaid.live
