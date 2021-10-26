require("dotenv").config(); // this is important!
const config = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "sidcord",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    dialectOptions: {},
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "sidcord",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    dialectOptions: {},
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {},
  },
};
const env = process.env.NODE_ENV || "development";
if (process.env.DB_PORT) {
  config[env].dialectOptions.port = process.env.DB_PORT;
}
if (process.env.DB_SSL !== null) {
  config[env].dialectOptions.ssl = process.env.DB_SSL;
}

module.exports = config;
