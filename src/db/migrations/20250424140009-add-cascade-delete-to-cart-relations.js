"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop existing foreign key constraints
    await queryInterface.removeConstraint(
      "cart_items",
      "cart_items_cart_id_fkey"
    );
    await queryInterface.removeConstraint(
      "cart_members",
      "cart_members_cart_id_fkey"
    );

    // Add new constraints with CASCADE
    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_items_cart_id_fkey",
      references: {
        table: "carts",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("cart_members", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_members_cart_id_fkey",
      references: {
        table: "carts",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to original constraints without CASCADE
    await queryInterface.removeConstraint(
      "cart_items",
      "cart_items_cart_id_fkey"
    );
    await queryInterface.removeConstraint(
      "cart_members",
      "cart_members_cart_id_fkey"
    );

    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_items_cart_id_fkey",
      references: {
        table: "carts",
        field: "id",
      },
    });

    await queryInterface.addConstraint("cart_members", {
      fields: ["cart_id"],
      type: "foreign key",
      name: "cart_members_cart_id_fkey",
      references: {
        table: "carts",
        field: "id",
      },
    });
  },
};
