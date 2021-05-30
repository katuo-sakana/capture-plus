"use strict";
const Sequelize = require("sequelize");
const dbConfig = require("../db/db-config");

const Page = dbConfig.define(
  "Pages",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    counter: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    processing: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    url: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  },
  {
    freezeTableName: true
    // timestamps: false
  }
);

module.exports = Page;
