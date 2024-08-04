const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Example registration route
router.post('/register', async (req, res) => {
  const { email, publicKey } = req.body;
  const user = new User({ email, publicKey, lastLogin: new Date() });
  await user.save();
  res.send('User registered');
});

// Example login route
router.post('/login', async (req, res) => {
  const { email, publicKey } = req.body;
  const user = await User.findOne({ email, publicKey });
  if (user) {
    user.lastLogin = new Date();
    await user.save();
    res.send('User logged in');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
