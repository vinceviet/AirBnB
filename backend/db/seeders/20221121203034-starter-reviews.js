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
        review: 'Nice and cozy.',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "The house was bit dirty, lake was really low.",
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Great spot, great people and ducks.',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Great place to get away.',
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: "Not the best, but not the worst place.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Too big, got lost.',
        stars: 3
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Love staying in high places, treehouse was great.',
        stars: 5
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Was hard to find the spot.',
        stars: 2
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Place too big, got lost.',
        stars: 2
      },
      {
        spotId: 5,
        userId: 1,
        review: 'Great lake view.',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'Plenty of space, nice and clean.',
        stars: 4
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Great food and drink options.s',
        stars: 5
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
