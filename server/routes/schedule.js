const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');

// Example route to create a schedule
router.post('/create', async (req, res) => {
  const { userId, recipientEmail, subject, body, attachment } = req.body;
  const schedule = new Schedule({
    userId,
    recipientEmail,
    subject,
    body,
    attachment,
    nextCheck: new Date(new Date().getTime() + (3 * 30 * 24 * 60 * 60 * 1000)) // 3 months later
  });
  await schedule.save();
  res.send('Schedule created');
});

module.exports = router;
