const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'deadmanswitch', // Database name
  'your_username', // Database username
  'your_password', // Database password
  {
    host: '127.0.0.1',
    dialect: 'mysql'
  }
);

module.exports = sequelize;
