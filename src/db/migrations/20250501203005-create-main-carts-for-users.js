"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all users
    const users = await queryInterface.sequelize.query("SELECT id FROM users", {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Create main cart for each user who doesn't already have one
    for (const user of users) {
      // Check if user already has a main cart
      const existingMainCart = await queryInterface.sequelize.query(
        "SELECT id FROM carts WHERE user_id = ? AND type = ?",
        {
          replacements: [user.id, "main"],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      // If user doesn't have a main cart, create one
      if (existingMainCart.length === 0) {
        const now = new Date();
        await queryInterface.bulkInsert("carts", [
          {
            user_id: user.id,
            type: "main",
            // title: "My Cart",
            createdAt: now,
            updatedAt: now,
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all main carts
    await queryInterface.bulkDelete("carts", { type: "main" });
  },
};
