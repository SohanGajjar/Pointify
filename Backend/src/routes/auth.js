const express = require('express');
const { signup, login, verifyToken } = require('../controllers/authController');
const { verifyToken: authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router; 