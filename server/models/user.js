const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
