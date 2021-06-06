"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../db/db-config");

const Comment = dbConfig.define(
  "comments",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    form_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_readonly: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position_x: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position_y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    window_y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position_form_x: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position_form_y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    page_id: {
      type: DataTypes.INTEGER,
      references: { model: "pages", key: "id" }, // 外部キー
      onUpdate: "cascade", // （任意）連動して自動更新する場合
      onDelete: "cascade" // （任意）連動して自動削除する場合
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

module.exports = Comment;
