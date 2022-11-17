'use strict';
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // returns user instance info that is safe to save
    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
    };
    // returns true if there is a match with the instance password
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    };
    // uses the currentUser scope to return user with that Id
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
      const password = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        password
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
    password: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      valiate: { len: [60, 60] }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: { attributes: { exclude: ['password', 'email', 'createdAt', 'updatedAt'] } },
    scopes: {
      currentUser: { attributes: { exclude: ['password'] } },
      loginUser: { attributes: {} }
    }
  });
  return User;
};
