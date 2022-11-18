'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
    };
  }
  Booking.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
      // add validate dates
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE
      // add validate dates
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
