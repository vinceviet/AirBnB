'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: 'Best pirate ship ever!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "Worst place ever, the empolyee's tried to arrest me.",
        stars: 1
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Great spot, great people and ducks.',
        stars: 5
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
