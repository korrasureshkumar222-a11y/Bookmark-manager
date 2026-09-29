const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validateAuth = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  ...validateAuth,
], register);

router.post('/login', validateAuth, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
