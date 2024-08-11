const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "deadmanswitch", // Database name
  "user", // Database username
  "**********************", // Database password
  {
    host: "127.0.0.1",
    dialect: "mysql",
  }
);

module.exports = sequelize;
