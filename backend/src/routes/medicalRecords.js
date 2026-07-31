const express = require('express');
const router = express.Router();
const { createMedicalRecord, getPatientMedicalRecords, getMedicalRecord } = require('../controllers/medicalRecordController');
const { createPrescription, getPrescription } = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, medicalRecordSchema } = require('../validators');

router.use(authenticate);

router.post('/', authorize('dokter'), validate(medicalRecordSchema), createMedicalRecord);
router.get('/:id', getMedicalRecord);
router.get('/patient/:patientId', getPatientMedicalRecords);

// Prescriptions nested under medical records
router.post('/:id/prescriptions', authorize('dokter'), createPrescription);
router.get('/prescriptions/:id', getPrescription);

module.exports = router;
