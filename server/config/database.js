const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "deadmanswitch", // Database name
  "green", // Database username
  "w93cqMDo5QaZBnzKdaCPPm2zaQoUqD", // Database password
  {
    host: "127.0.0.1",
    dialect: "mysql",
  }
);

module.exports = sequelize;
