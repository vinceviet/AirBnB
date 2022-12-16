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
        review: 'Nice and cozy. There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "The house was bit dirty, lake was really low. There was a leak in the boat.",
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Great spot, great people and ducks. There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Great place to get away. There was a leak in the boat.',
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: "Not the best, but not the worst place. There was a leak in the boat.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Too big, got lost.There was a leak in the boat.',
        stars: 3
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Love staying in high places, treehouse was great.There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Was hard to find the spot.There was a leak in the boat.',
        stars: 2
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Place too big, got lost.There was a leak in the boat.',
        stars: 2
      },
      {
        spotId: 5,
        userId: 1,
        review: 'Great lake view.There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'Plenty of space, nice and clean.There was a leak in the boat.',
        stars: 4
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Great food and drink options.There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 7,
        userId: 1,
        review: 'Great open space, great county.There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 7,
        userId: 2,
        review: 'Not enough amenities.There was a leak in the boat.',
        stars: 3
      },
      {
        spotId: 8,
        userId: 2,
        review: 'Very quiet, perfect place to read.There was a leak in the boat.',
        stars: 5
      },
      {
        spotId: 8,
        userId: 1,
        review: 'Too quiet, not enough action.There was a leak in the boat.',
        stars: 2
      },
      {
        spotId: 9,
        userId: 1,
        review: "Forgot I can't swim, almost drowned.There was a leak in the boat.",
        stars: 1
      },
      {
        spotId: 9,
        userId: 2,
        review: "Place was nice but too many drowning people, had to play lifegaurd.There was a leak in the boat.",
        stars: 4
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};
