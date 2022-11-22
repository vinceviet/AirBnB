'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: '2022-01-01',
        endDate: '2022-01-15'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2022-02-02',
        endDate: '2022-02-15'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2022-03-03',
        endDate: '2022-03-15'
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
