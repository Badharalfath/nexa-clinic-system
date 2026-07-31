const express = require('express');
const router = express.Router();
const { getDoctors, getPolyclinics } = require('../controllers/referensiController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/doctors', getDoctors);
router.get('/polyclinics', getPolyclinics);

module.exports = router;
