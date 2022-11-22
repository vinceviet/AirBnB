const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

const validateSignup = [
    check('email').exists({ checkFalsy: true }).isEmail()
        .withMessage('Invalid email'),
    check('username').exists({ checkFalsy: true }).isLength({ min: 4, max: 30 })
        .withMessage("Username is required"),
    check('username').not().isEmail()
        .withMessage('Username cannot be an email.'),
    check('password').exists({ checkFalsy: true }).isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName').exists({ checkFalsy: true })
        .withMessage("First Name is required"),
    check('lastName').exists({ checkFalsy: true })
        .withMessage("Last Name is required"),
    handleValidationErrors
];

const checkIfEmailOrUsernameExists = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            res.status(403).json({
                message: "User already exists",
                statusCode: 403,
                errors: {
                    email: "User with that email already exists"
                }
            });
            return;
        };
        User.findOne({ where: { username: req.body.username } }).then(user => {
            if (user) {
                res.status(403).json({
                    message: "User already exists",
                    statusCode: 403,
                    errors: {
                        username: "User with that username already exists"
                    }
                });
                return;
            };
            next();
        });
    });
};

// Sign up
router.post('/', [validateSignup, checkIfEmailOrUsernameExists], async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    let user = await User.signup({ firstName, lastName, email, username, password });
    let token = setTokenCookie(res, user);
    const tokenContainer = {};
    tokenContainer.token = token;
    user = user.toJSON();
    Object.assign(user, tokenContainer)
    return res.json({ user });
});

module.exports = router;
