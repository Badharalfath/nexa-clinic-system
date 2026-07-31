-- ============================================================
-- Mini Clinic Information System - Database Schema
-- Database: PostgreSQL
-- ============================================================

-- Drop existing tables (if re-running)
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medical_actions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS queues CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS polyclinics CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE user_role AS ENUM ('administrator', 'dokter', 'petugas_pendaftaran');
CREATE TYPE gender_type AS ENUM ('L', 'P');
CREATE TYPE payment_type AS ENUM ('umum', 'bpjs', 'asuransi');
CREATE TYPE registration_status AS ENUM ('menunggu', 'check_in', 'pemeriksaan', 'selesai');
CREATE TYPE queue_status AS ENUM ('menunggu', 'dipanggil', 'pemeriksaan', 'selesai', 'lewat');

-- ============================================================
-- 1. USERS (Authentication & Roles)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. PATIENTS (Master Data Pasien)
-- ============================================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_number VARCHAR(20) NOT NULL UNIQUE,
    nik VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender gender_type NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-generate medical record number function
CREATE SEQUENCE IF NOT EXISTS medical_record_seq START 1;

CREATE OR REPLACE FUNCTION generate_medical_record_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.medical_record_number := 'RM-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('medical_record_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_medical_record_number
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION generate_medical_record_number();

-- ============================================================
-- 3. POLYCLINICS (Poli)
-- ============================================================
CREATE TABLE polyclinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. REGISTRATIONS (Pendaftaran Pasien)
-- ============================================================
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    polyclinic_id UUID NOT NULL REFERENCES polyclinics(id),
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_type payment_type NOT NULL,
    complaint TEXT,
    status registration_status NOT NULL DEFAULT 'menunggu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registrations_patient ON registrations(patient_id);
CREATE INDEX idx_registrations_doctor ON registrations(doctor_id);
CREATE INDEX idx_registrations_date ON registrations(registration_date);
CREATE INDEX idx_registrations_status ON registrations(status);

-- ============================================================
-- 5. QUEUES (Antrean)
-- ============================================================
CREATE TABLE queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    queue_number VARCHAR(10) NOT NULL,
    status queue_status NOT NULL DEFAULT 'menunggu',
    called_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_number ON queues(queue_number);

-- Auto-generate queue number function
CREATE SEQUENCE IF NOT EXISTS queue_seq START 1;

CREATE OR REPLACE FUNCTION generate_queue_number()
RETURNS TRIGGER AS $$
DECLARE
    poly_initial VARCHAR(2);
    seq_num TEXT;
BEGIN
    -- Get first letter of polyclinic name as prefix
    SELECT UPPER(SUBSTRING(p.name FROM 1 FOR 1)) INTO poly_initial
    FROM registrations r
    JOIN polyclinics p ON r.polyclinic_id = p.id
    WHERE r.id = NEW.registration_id;

    seq_num := LPAD(NEXTVAL('queue_seq')::TEXT, 3, '0');
    NEW.queue_number := poly_initial || seq_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_queue_number
    BEFORE INSERT ON queues
    FOR EACH ROW
    EXECUTE FUNCTION generate_queue_number();

-- ============================================================
-- 6. MEDICAL RECORDS (Pemeriksaan SOAP)
-- ============================================================
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES users(id),
    -- Subjective
    subjective TEXT,
    -- Objective
    objective_blood_pressure VARCHAR(20),
    objective_temperature DECIMAL(4,1),
    objective_weight DECIMAL(5,1),
    objective_height DECIMAL(5,1),
    -- Assessment
    assessment TEXT,
    -- Plan
    plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);

-- ============================================================
-- 7. MEDICAL ACTIONS (Tindakan Medis)
-- ============================================================
CREATE TABLE medical_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    action_name VARCHAR(200) NOT NULL,
    action_description TEXT,
    cost DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_actions_record ON medical_actions(medical_record_id);

-- ============================================================
-- 8. PRESCRIPTIONS (Resep Obat)
-- ============================================================
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    drug_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    quantity INTEGER,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_record ON prescriptions(medical_record_id);

-- ============================================================
-- SEED DATA
-- ============================================================
-- Default users (password: password123)
INSERT INTO users (id, username, email, password, name, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin', 'admin@clinic.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfM1lRsV4G6JzQ7qX5v5y5y5y5y', 'Administrator', 'administrator'),
    ('a0000000-0000-0000-0000-000000000002', 'dr.sari', 'drsari@clinic.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfM1lRsV4G6JzQ7qX5v5y5y5y5y', 'Dr. Sari', 'dokter'),
    ('a0000000-0000-0000-0000-000000000003', 'dr.budi', 'drbudi@clinic.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfM1lRsV4G6JzQ7qX5v5y5y5y5y', 'Dr. Budi', 'dokter'),
    ('a0000000-0000-0000-0000-000000000004', 'petugas1', 'petugas1@clinic.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfM1lRsV4G6JzQ7qX5v5y5y5y5y', 'Ani Petugas', 'petugas_pendaftaran');

-- Polyclinics
INSERT INTO polyclinics (id, name, description) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Umum', 'Poli pelayanan umum'),
    ('b0000000-0000-0000-0000-000000000002', 'Gigi', 'Poli kesehatan gigi dan mulut'),
    ('b0000000-0000-0000-0000-000000000003', 'Anak', 'Poli kesehatan anak');
