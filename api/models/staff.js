"use strict";
const Sequelize = require("sequelize");
const dbConfig = require("../db/db-config");

const Staff = dbConfig.define(
  "staff",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    age: {
      type: Sequelize.INTEGER
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Staff;
