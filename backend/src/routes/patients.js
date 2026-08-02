const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientRelatedCounts,
  permanentDeletePatient,
} = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, patientSchema } = require('../validators');

router.use(authenticate);

router.get('/', getPatients);
router.get('/:id', getPatient);
router.get('/:id/related-counts', getPatientRelatedCounts);
router.post('/', authorize('administrator', 'petugas_pendaftaran'), validate(patientSchema), createPatient);
router.put('/:id', authorize('administrator', 'petugas_pendaftaran'), validate(patientSchema), updatePatient);
router.delete('/:id', authorize('administrator'), deletePatient);
router.delete('/:id/permanent', authorize('administrator'), permanentDeletePatient);

module.exports = router;
