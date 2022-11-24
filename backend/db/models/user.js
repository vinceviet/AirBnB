'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    toSafeObject() {
      const { id, firstName, lastName, username, email } = this;
      return { id, firstName, lastName, username, email };
    };

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    };

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    };

    static async login({ credential, password }) {
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    };

    static async signup({ firstName, lastName, username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    };

    static associate(models) {
      User.hasMany(models.Spot, { as: 'Owner', foreignKey: 'ownerId' });
      // User.belongsToMany(models.Spot, { through: models.Booking, foreignKey: 'userId' });
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'cascade' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    };
  }

  User.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 15], isAlpha: true }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [1, 15], isAlpha: true }
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) throw new Error("Cannot be an email.");
        }
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [3, 256], isEmail: true }
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      valiate: { len: [60, 60] }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: { attributes: { exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'] } },
    scopes: {
      currentUser: { attributes: { exclude: ['hashedPassword', 'createdAt', 'updatedAt'] } },
      loginUser: { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    }
  });
  return User;
};
