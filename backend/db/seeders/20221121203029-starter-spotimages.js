'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-21605015/original/e914d980-5585-4fbe-a0ef-21b8d0b1cf8c.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 2,
        url: 'spotplaceholder2.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'spotplaceholder3.com',
        preview: true
      },
      {
        spotId: 4,
        url: 'spotplaceholder4.com',
        preview: true
      },
      {
        spotId: 5,
        url: 'spotplaceholder5.com',
        preview: true
      },
      {
        spotId: 6,
        url: 'spotplaceholder6.com',
        preview: true
      },
      {
        spotId: 7,
        url: 'spotplaceholder7.com',
        preview: true
      },
      {
        spotId: 8,
        url: 'spotplaceholder8.com',
        preview: true
      },
      {
        spotId: 9,
        url: 'spotplaceholder9.com',
        preview: true
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};
