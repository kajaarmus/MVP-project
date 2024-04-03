const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../src/models/User');

// Signup route
router.post('/signup', [
  check('username').notEmpty().withMessage('Username cannot be empty'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    res.status(200).json({ msg: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
