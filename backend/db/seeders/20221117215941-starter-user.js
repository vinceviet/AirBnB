'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
        firstName: 'Luffy',
        lastName: 'Monkey',
        email: 'kaizokunoou@grandline.com',
        username: 'Mugiwara',
        hashedPassword: bcrypt.hashSync('nakama4life')
      },
      {
        firstName: 'Zoro',
        lastName: 'Roronoa',
        email: 'santoryu@grandline.com',
        username: 'Santoryu',
        hashedPassword: bcrypt.hashSync('iamlost')
      },
      {
        firstName: 'Robin',
        lastName: 'Nico',
        email: 'historybuff@grandline.com',
        username: 'Hanahana',
        hashedPassword: bcrypt.hashSync('oharalives')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, options, {
      username: { [Op.in]: ['Mugiwara', 'Santoryu', 'Hanahana'] }
    }, {});
  }
};
