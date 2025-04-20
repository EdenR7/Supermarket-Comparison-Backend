"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cart_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "carts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    });

    // Add a unique constraint to ensure a product is only added once to a cart
    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id", "product_id"],
      type: "unique",
      name: "unique_cart_product",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cart_items");
  },
};
