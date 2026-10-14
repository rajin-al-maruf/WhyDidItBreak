const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/user.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);

module.exports = router;