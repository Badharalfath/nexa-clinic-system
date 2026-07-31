const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { validate, loginSchema } = require('../validators/authValidator');
const { authenticate } = require('../middleware/auth');

router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
