'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsToMany(models.User, { through: models.Booking, foreignKey: 'spotId' });
      Spot.belongsToMany(models.User, { through: models.Review, foreignKey: 'spotId' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId' })
    };
  }
  Spot.init({
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 50], isAlpha: true }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 50], isAlpha: true }
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 50], isAlpha: true }
    },
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: { min: -90, max: 90 }
    },
    lng: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: { min: -180, max: 180 }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 50] }
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 225] }
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: { min: 0 }
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
