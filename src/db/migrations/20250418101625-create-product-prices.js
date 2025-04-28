"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("product_prices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      supermarket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "supermarkets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add a unique constraint to ensure a product has only one price per supermarket
    await queryInterface.addConstraint("product_prices", {
      fields: ["product_id", "supermarket_id"],
      type: "unique",
      name: "unique_product_supermarket",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("product_prices");
  },
};
