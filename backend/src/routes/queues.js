const express = require('express');
const router = express.Router();
const { getQueues, callQueue, updateQueueStatus } = require('../controllers/queueController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getQueues);
router.put('/:id/call', callQueue);
router.put('/:id/status', updateQueueStatus);

module.exports = router;
