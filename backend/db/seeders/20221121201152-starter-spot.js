'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '345 Cabin Lane',
        city: 'Occidental',
        state: 'California',
        country: 'United States',
        lat: 45.123124,
        lng: 95.2532352,
        name: 'Occidental Cabin',
        description: 'Rustic yet luxurious cabin in the Redwoods.',
        price: 500
      },
      {
        ownerId: 1,
        address: '123 Grove Ave',
        city: 'Groveland',
        state: 'California',
        country: 'United States',
        lat: 55.234234,
        lng: 85.23424,
        name: 'Lakeside House',
        description: 'Family lakehouse with private dock!',
        price: 695
      },
      {
        ownerId: 1,
        address: '789 Clear Way',
        city: 'Clearlake Oaks',
        state: 'California',
        country: 'United States',
        lat: -50.1866,
        lng: 89.49312,
        name: 'Lakeside Loveshack',
        description: 'Modern and cozy with firepit.',
        price: 299
      },
      {
        ownerId: 2,
        address: '987 Tree Lane',
        city: 'San Jose',
        state: 'California',
        country: 'United States',
        lat: -66.1866,
        lng: 77.49312,
        name: 'Treehouse',
        description: 'Spend a relaxing time in a tree!',
        price: 500
      },
      {
        ownerId: 2,
        address: '2983 Woods Ave',
        city: 'Stateline',
        state: 'Nevada',
        country: 'United States',
        lat: -65.1866,
        lng: -65.49312,
        name: 'Tahoe Beach Club',
        description: 'Entire condo by the lakefront!',
        price: 299
      },
      {
        ownerId: 2,
        address: '1245 Lakeside Lane',
        city: 'South Lake Tahoe',
        state: 'California',
        country: 'United States',
        lat: 70.1866,
        lng: 79.49312,
        name: 'Lakefront',
        description: 'Enjoy a stay near the lake.',
        price: 299
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['United States'] }
    }, {});
  }
};
