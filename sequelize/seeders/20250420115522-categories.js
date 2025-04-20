"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Extract unique categories from the product data
    const categories = [
      { name: "Milk and Eggs" },
      { name: "Fruits and Vegetables" },
      { name: "Sweets" },
      { name: "Drinks" },
      { name: "Meat and Fish" },
      { name: "Frozens" },
    ];

    return queryInterface.bulkInsert("categories", categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
