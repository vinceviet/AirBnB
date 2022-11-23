'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    };
  }
  ReviewImage.init({
    reviewId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
      isUrl: true
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
    scopes: { createImage: { attributes: { exclude: ['reviewId', 'createdAt', 'updatedAt'] } } },
  });
  return ReviewImage;
};
