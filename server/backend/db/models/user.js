'use strict';
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
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

    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    };

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
      currentUser: { attributes: { exclude: ['hashedPassword'] } },
      loginUser: { attributes: {} }
    }
  });
  return User;
};