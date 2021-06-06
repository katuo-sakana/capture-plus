"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      form_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      done: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_readonly: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      position_x: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      position_y: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      window_y: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      position_form_x: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      position_form_y: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      page_id: {
        type: Sequelize.INTEGER,
        references: { model: "pages", key: "id" }, // 外部キー
        onUpdate: "cascade", // （任意）連動して自動更新する場合
        onDelete: "cascade" // （任意）連動して自動削除する場合
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("comments");
  }
};
