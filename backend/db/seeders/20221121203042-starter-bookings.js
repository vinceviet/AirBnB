'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const startDate1 = new Date(2023, 01, 01);
const endDate1 = new Date(2023, 01, 15);
const startDate2 = new Date(2023, 02, 02);
const endDate2 = new Date(2023, 02, 15);
const startDate3 = new Date(2023, 03, 03);
const endDate3 = new Date(2023, 03, 15);
const startDate4 = new Date(2023, 04, 04);
const endDate4 = new Date(2023, 04, 15);
const startDate5 = new Date(2023, 05, 05);
const endDate5 = new Date(2023, 05, 15);
const startDate6 = new Date(2023, 06, 06);
const endDate6 = new Date(2023, 06, 15);

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
      {
        spotId: 1,
        userId: 2,
        startDate: startDate4,
        endDate: endDate4
      },
      {
        spotId: 2,
        userId: 2,
        startDate: startDate5,
        endDate: endDate5
      },
      {
        spotId: 3,
        userId: 2,
        startDate: startDate6,
        endDate: endDate6
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
