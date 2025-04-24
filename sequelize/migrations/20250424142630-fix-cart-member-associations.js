"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if constraints exist before trying to remove them
    try {
      // For cart_items
      await queryInterface.removeConstraint(
        "cart_items",
        "cart_items_cart_id_fkey"
      );
    } catch (error) {
      console.log("cart_items constraint may not exist, continuing...");
    }

    try {
      // For cart_members
      await queryInterface.removeConstraint(
        "cart_members",
        "cart_members_cart_id_fkey"
      );
    } catch (error) {
      console.log("cart_members constraint may not exist, continuing...");
    }

    // Add constraints with CASCADE
    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_items_cart_id_cascade_fk",
      references: {
        table: "carts",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("cart_members", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_members_cart_id_cascade_fk",
      references: {
        table: "carts",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the CASCADE constraints
    await queryInterface.removeConstraint(
      "cart_items",
      "cart_items_cart_id_cascade_fk"
    );
    await queryInterface.removeConstraint(
      "cart_members",
      "cart_members_cart_id_cascade_fk"
    );

    // Add back standard foreign key constraints without CASCADE
    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_items_cart_id_fk",
      references: {
        table: "carts",
        field: "id",
      },
    });

    await queryInterface.addConstraint("cart_members", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_members_cart_id_fk",
      references: {
        table: "carts",
        field: "id",
      },
    });
  },
};
