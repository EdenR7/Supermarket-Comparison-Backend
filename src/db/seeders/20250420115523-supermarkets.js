"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const supermarkets = [
      { name: "Shufersal", brand_img: null },
      { name: "Yohananof", brand_img: null },
      { name: "Rami Levy", brand_img: null },
    ];

    return queryInterface.bulkInsert("supermarkets", supermarkets, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("supermarkets", null, {});
  },
};
