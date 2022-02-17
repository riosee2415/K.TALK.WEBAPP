const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: "dev",
    password: process.env.DB_PASSWORD,
    database: "ktalk",
    host: process.env.DB_DEV_PORT,
    dialect: "mysql",
    timezone: "Asia/Seoul",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "ktalk",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Seoul",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "ktalk",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Seoul",
  },
};
