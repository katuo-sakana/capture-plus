const Sequelize = require("sequelize");

const dbConfig = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    // 接続先ホストを指定
    host: process.env.DB_HOST,

    // 使用する DB 製品を指定
    dialect: "postgres",

    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = dbConfig;
