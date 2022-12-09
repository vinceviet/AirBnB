const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateLogin = [
    check('credential').exists({ checkFalsy: true }).notEmpty()
        .withMessage({ credential: "Email or username is required" }),
    check('password').exists({ checkFalsy: true })
        .withMessage("Password is required"),
    handleValidationErrors
];

// Login
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;
    let user = await User.login({ credential, password });

    if (!user) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        // err.title = 'Login failed';
        // err.errors = ['The provided credentials were invalid.'];
        return next(err);
    }
    let token = setTokenCookie(res, user);
    const tokenContainer = {};
    tokenContainer.token = token;
    user = user.toJSON();
    Object.assign(user, tokenContainer)
    return res.json({ user });
});

// Logout
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

// Restore session user/Get Current User
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    if(user) return res.json(user.toSafeObject());
    else return res.json({user: null});
});

module.exports = router;
