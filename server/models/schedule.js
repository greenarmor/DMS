const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientEmail: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  attachment: { type: Buffer, required: true },
  nextCheck: { type: Date, required: true }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
