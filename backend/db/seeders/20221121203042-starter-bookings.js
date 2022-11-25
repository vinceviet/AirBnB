'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const startDate1 = new Date(2022, 1, 1);
const endDate1 = new Date(2022, 1, 15);
const startDate2 = new Date(2022, 2, 2);
const endDate2 = new Date(2022, 2, 15);
const startDate3 = new Date(2022, 3, 3);
const endDate3 = new Date(2022, 3, 15);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: startDate1,
        endDate: endDate1
      },
      {
        spotId: 2,
        userId: 3,
        startDate: startDate2,
        endDate: endDate2
      },
      {
        spotId: 3,
        userId: 3,
        startDate: startDate3,
        endDate: endDate3
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
