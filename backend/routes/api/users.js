const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

const validateSignup = [
    check('email').exists({ checkFalsy: true }).isEmail()
        .withMessage('Please provide a valid email.'),
    check('username').exists({ checkFalsy: true }).isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username').not().isEmail()
        .withMessage('Username cannot be an email.'),
    check('password').exists({ checkFalsy: true }).isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    // if (User.findOne({ where: { email } })) res.status(403).json({ message: "User already exists", statusCode: 403, errors: { email: 'User with that email already exists' } });
    // else if (User.findOne({ where: { username } })) res.status(403).json({ message: "User already exists", statusCode: 403, errors: { email: 'User with that username already exists' } });

    let user = await User.signup({ firstName, lastName, email, username, password });
    let token = setTokenCookie(res, user);
    const tokenContainer = {};
    tokenContainer.token = token;
    user = user.toJSON();
    Object.assign(user, tokenContainer)
    return res.json({ user });
});

module.exports = router;
