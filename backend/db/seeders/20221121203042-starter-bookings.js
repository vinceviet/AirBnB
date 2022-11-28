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
        startDate: new Date('2023,01,01').toDateString(),
        endDate: new Date('2023,01,15').toDateString()
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023,02,02').toDateString(),
        endDate: new Date('2023,02,15').toDateString()
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023,03,03').toDateString(),
        endDate: new Date('2023,03,15').toDateString()
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023,04,04').toDateString(),
        endDate: new Date('2023,04,15').toDateString()
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023,05,05').toDateString(),
        endDate: new Date('2023,05,15').toDateString()
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2023,06,06').toDateString(),
        endDate: new Date('2023,06,15').toDateString()
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
