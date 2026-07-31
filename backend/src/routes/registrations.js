const express = require('express');
const router = express.Router();
const { getRegistrations, createRegistration, updateRegistration } = require('../controllers/registrationController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, registrationSchema } = require('../validators');

router.use(authenticate);

router.get('/', getRegistrations);
router.post('/', authorize('administrator', 'petugas_pendaftaran'), validate(registrationSchema), createRegistration);
router.put('/:id', authorize('administrator', 'petugas_pendaftaran'), updateRegistration);

module.exports = router;
