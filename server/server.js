const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cron = require('node-cron');
const cors = require('cors');
const session = require('express-session'); // Import express-session

// Import models
const User = require('./models/user');
const Schedule = require('./models/schedule');

// Import routes
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');

// Initialize the app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure session middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using https
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/deadmanswitch')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);

// Set up email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Function to send email
function sendEmail(to, subject, body, attachment) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text: body,
    attachments: [{
      filename: 'attachment.txt',
      content: attachment
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Cron job to check schedules and send emails
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const schedules = await Schedule.find({ nextCheck: { $lte: now } }).populate('userId');

  schedules.forEach(schedule => {
    if (new Date(schedule.userId.lastLogin).getTime() < now.getTime() - (3 * 30 * 24 * 60 * 60 * 1000)) {
      sendEmail(schedule.recipientEmail, schedule.subject, schedule.body, schedule.attachment);
      schedule.nextCheck = new Date(now.getTime() + (3 * 30 * 24 * 60 * 60 * 1000)); // 3 months later
      schedule.save();
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
