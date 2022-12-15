'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://a0.muscache.com/im/pictures/60488858/e4d0124b_original.jpg?im_w=960'
      },
      {
        reviewId: 2,
        url: 'https://a0.muscache.com/im/pictures/60488793/a6b3d128_original.jpg?im_w=720'
      },
      {
        reviewId: 3,
        url: 'https://a0.muscache.com/im/pictures/60488974/fc5433e4_original.jpg?im_w=720'
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
