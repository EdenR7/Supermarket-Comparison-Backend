"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add type column to carts table
    await queryInterface.addColumn("carts", "type", {
      type: Sequelize.ENUM("saved", "main", "active"),
      allowNull: false,
      defaultValue: "saved", // Default value for existing carts
    });

    // Change title field to be optional
    await queryInterface.changeColumn("carts", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Change title field back to required
    await queryInterface.changeColumn("carts", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove type column
    await queryInterface.removeColumn("carts", "type");

    // Remove the ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_carts_type";'
    );
  },
};
