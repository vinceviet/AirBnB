'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (validator.isEmail(value)) throw new Error("Cannot be an email.");
        }
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [3, 256], isEmail: true }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      valiate: { len: [60, 60] }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
