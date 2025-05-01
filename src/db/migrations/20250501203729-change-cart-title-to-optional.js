"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
  },
};
