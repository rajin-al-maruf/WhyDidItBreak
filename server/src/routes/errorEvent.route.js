const express = require('express');
const { ingestErrorEvent } = require('../controllers/errorEvent.controller');

const router = express.Router();

router.post('/', ingestErrorEvent);   //no authMiddleware here because the SDK uses ingestionKey, not a login JWT

module.exports = router;