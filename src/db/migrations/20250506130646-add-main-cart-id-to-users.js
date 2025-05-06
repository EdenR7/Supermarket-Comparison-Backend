"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add main_cart_id column to users table
    await queryInterface.addColumn("users", "main_cart_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "carts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Get all users
    const users = await queryInterface.sequelize.query("SELECT id FROM users", {
      type: Sequelize.QueryTypes.SELECT,
    });

    for (const user of users) {
      // Check if user already has a main cart
      let mainCart = await queryInterface.sequelize.query(
        "SELECT id FROM carts WHERE user_id = ? AND type = ?",
        {
          replacements: [user.id, "main"],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      // If user doesn't have a main cart, create one
      if (mainCart.length === 0) {
        const now = new Date();
        await queryInterface.bulkInsert("carts", [
          {
            user_id: user.id,
            type: "main",
            title: "My Cart",
            createdAt: now,
            updatedAt: now,
          },
        ]);

        // Get the newly created cart
        mainCart = await queryInterface.sequelize.query(
          "SELECT id FROM carts WHERE user_id = ? AND type = ?",
          {
            replacements: [user.id, "main"],
            type: Sequelize.QueryTypes.SELECT,
          }
        );
      }

      // Update the user with their main cart ID
      if (mainCart.length > 0) {
        await queryInterface.sequelize.query(
          "UPDATE users SET main_cart_id = ? WHERE id = ?",
          {
            replacements: [mainCart[0].id, user.id],
          }
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove main_cart_id column
    await queryInterface.removeColumn("users", "main_cart_id");
  },
};
