const express = require('express');
const router = express.Router();
const { getPatients, getPatient, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, patientSchema } = require('../validators');

router.use(authenticate);

router.get('/', getPatients);
router.get('/:id', getPatient);
router.post('/', authorize('administrator', 'petugas_pendaftaran'), validate(patientSchema), createPatient);
router.put('/:id', authorize('administrator', 'petugas_pendaftaran'), validate(patientSchema), updatePatient);
router.delete('/:id', authorize('administrator'), deletePatient);

module.exports = router;
