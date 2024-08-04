const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Route to add a new schedule
router.post('/add', isAuthenticated, async (req, res) => {
  const { recipientEmail, subject, body, attachment } = req.body;
  const newSchedule = new Schedule({
    userId: req.session.user,
    recipientEmail,
    subject,
    body,
    attachment,
    nextCheck: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000) // 3 months later
  });
  await newSchedule.save();
  res.send('Schedule added');
});

module.exports = router;
