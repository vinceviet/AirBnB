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
        url: 'reviewplaceholder1.com'
      },
      {
        reviewId: 2,
        url: 'reviewplaceholder2.com'
      },
      {
        reviewId: 3,
        url: 'reviewplaceholder3.com'
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
