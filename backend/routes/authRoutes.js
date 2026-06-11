const express = require('express');
const { register, login, me } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', validate([
  { field: 'name', label: 'Name', required: true, min: 2, max: 60 },
  { field: 'email', label: 'Email', required: true, email: true },
  { field: 'password', label: 'Password', required: true, min: 6 },
  {
    field: 'confirmPassword',
    label: 'Confirm password',
    required: true,
    matchesField: 'password',
    matchesLabel: 'password',
  },
]), register);

router.post('/login', validate([
  { field: 'email', label: 'Email', required: true, email: true },
  { field: 'password', label: 'Password', required: true },
]), login);

router.get('/me', protect, me);

module.exports = router;
