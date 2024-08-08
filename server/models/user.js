// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   publicKey: { type: String, required: true },
//   lastLogin: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

//Replacing to Mysql
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  publicKey: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;

