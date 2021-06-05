"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../db/db-config");

const Page = dbConfig.define(
  "pages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    counter: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    processing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    url: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true
    // timestamps: false
  }
);

module.exports = Page;
