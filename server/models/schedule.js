// const mongoose = require('mongoose');

// const scheduleSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   recipientEmail: { type: String, required: true },
//   subject: { type: String, required: true },
//   body: { type: String, required: true },
//   attachment: { type: Buffer, required: true },
//   nextCheck: { type: Date, required: true }
// });

// const Schedule = mongoose.model('Schedule', scheduleSchema);
// module.exports = Schedule;
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

class Schedule extends Model {}

Schedule.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  recipientEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachment: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  nextCheck: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Schedule'
});

module.exports = Schedule;
