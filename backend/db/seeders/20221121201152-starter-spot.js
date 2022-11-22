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
        address: '429 Shanks Ave',
        city: 'Foosha Village',
        state: 'Goa Kingdom',
        country: 'East Blue',
        lat: 45.123124,
        lng: 95.2532352,
        name: 'Thousand Sunny',
        description: 'Ship of the future pirate king!',
        price: 134.11
      },
      {
        ownerId: 1,
        address: '10671 One Way Lane',
        city: 'World Government',
        state: 'Paradise',
        country: 'Grand Line',
        lat: 55.234234,
        lng: 85.23424,
        name: 'Enies Lobby',
        description: 'Check out the big door that leads to Impel Down!',
        price: 234.22
      },
      {
        ownerId: 1,
        address: '333 Desert Lane',
        city: 'Arabasta',
        state: 'Paradise',
        country: 'Grand Line',
        lat: -50.1866,
        lng: 89.49312,
        name: "Vivi's Palce",
        description: 'Enjoy a luxurious stay in the country palace!',
        price: 764.33
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, options, {
      country: { [Op.in]: ['Grand Line', 'East Blue'] }
    }, {});
  }
};