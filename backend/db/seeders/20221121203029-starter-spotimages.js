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
        url: 'https://a0.muscache.com/im/pictures/be1c6bbb-09f4-4f62-9648-65815496c68c.jpg?im_w=720',
        preview: true
      },
      {
        spotId: 3,
        url: 'spotplaceholder3.comhttps://a0.muscache.com/im/pictures/2d55ea64-3219-4839-a30c-96b0805c881f.jpg?im_w=720',
        preview: true
      },
      {
        spotId: 4,
        url: 'spotplaceholder4.comhttps://a0.muscache.com/im/pictures/3b78d9b5-712b-4482-b0d3-aedf94ef5acb.jpg?im_w=720',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-619648648726300172/original/a46428b5-0f2b-41cf-9aff-d9922d12e4c1.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 6,
        url: 'spotplaceholder6.comhttps://a0.muscache.com/im/pictures/8b49998c-569b-498d-8946-820a1a9f8633.jpg?im_w=720',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17109396/original/fae85a2e-e222-4d79-b1c0-569725d90f14.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-34446612/original/298e2f93-d382-44d9-a5a7-b69658b234c2.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://a0.muscache.com/im/pictures/37425e33-8fd5-4869-8ea9-e5b2cb5db9f9.jpg?im_w=720',
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
