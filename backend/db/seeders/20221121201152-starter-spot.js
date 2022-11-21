'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '429 Shanks Ave',
        city: 'Foosha Village',
        state: 'Goa Kingdom',
        country: 'East Blue',
        lat: 45,
        lng: 95,
        name: 'Thousand Sunny',
        description: 'Ship of the future pirate king!',
        price: 134
      },
      {
        ownerId: 1,
        address: '10671 One Way Lane',
        city: 'World Government',
        state: 'Paradise',
        country: 'Grand Line',
        lat: 55,
        lng: 85,
        name: 'Enies Lobby',
        description: 'Check out the big door that leads to Impel Down!',
        price: 234
      },
      {
        ownerId: 1,
        address: '333 Desert Lane',
        city: 'Arabasta',
        state: 'Paradise',
        country: 'Grand Line',
        lat: -50,
        lng: 89,
        name: "Vivi's Palce",
        description: 'Enjoy a luxurious stay in the country palace!',
        price: 764
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['Grand Line', 'East Blue'] }
    }, {});
  }
};
