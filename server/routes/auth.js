const express = require('express');
const router = express.Router();
const User = require('../models/user');
const base64url = require('base64url');
const crypto = require('crypto');

// Example registration route (already existing)
router.post('/register', async (req, res) => {
  const { email, publicKey } = req.body;
  const user = new User({ email, publicKey, lastLogin: new Date() });
  await user.save();
  res.send('User registered');
});

// WebAuthn registration options (already existing)
router.post('/webauthn/register', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).send('User already exists');
  }

  const challenge = base64url(crypto.randomBytes(32));
  const options = {
    challenge: challenge,
    rp: { name: 'Your Application' },
    user: {
      id: base64url(Buffer.from(email)),
      name: email,
      displayName: email,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' } // RS256
    ],
  };

  req.session.challenge = challenge; // Store challenge in session
  res.json(options);
});

// WebAuthn verify route (already existing)
router.post('/webauthn/verify', async (req, res) => {
  const { email, id, rawId, response, type } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).send('User already exists');
  }

  const clientDataJSON = JSON.parse(Buffer.from(response.clientDataJSON, 'base64').toString('utf-8'));
  if (!req.session.challenge || req.session.challenge !== clientDataJSON.challenge) {
    return res.status(400).send('Invalid challenge');
  }

  const publicKey = base64url(Buffer.from(id, 'base64'));

  const newUser = new User({ email, publicKey, lastLogin: new Date() });
  await newUser.save();
  res.send('User registered');
});

// WebAuthn login options
router.post('/webauthn/login-options', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  const challenge = base64url(crypto.randomBytes(32));
  const options = {
    challenge: challenge,
    allowCredentials: [{
      id: user.publicKey,
      type: 'public-key',
      transports: ['usb', 'nfc', 'ble', 'internal']
    }],
    userVerification: 'preferred'
  };

  req.session.challenge = challenge; // Store challenge in session
  res.json(options);
});

// WebAuthn login verify
router.post('/webauthn/login-verify', async (req, res) => {
  const { email, id, response, type } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  const clientDataJSON = JSON.parse(Buffer.from(response.clientDataJSON, 'base64').toString('utf-8'));
  if (!req.session.challenge || req.session.challenge !== clientDataJSON.challenge) {
    return res.status(400).send('Invalid challenge');
  }

  // Update the user's last login time
  user.lastLogin = new Date();
  await user.save();

  req.session.user = user._id; // Store user ID in session
  res.send('User logged in');
});

module.exports = router;
