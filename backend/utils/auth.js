const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot } = require('../db/models');
const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });
    return token;
};

const restoreUser = (req, res, next) => {
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            res.clearCookie('token');
            return next();
        }
        if (!req.user) res.clearCookie('token');

        return next();
    });
};

const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error("Authentication required");
    // err.title = 'Unauthorized';
    // err.errors = ['Unauthorized'];
    err.status = 401;
    return next(err);
};

// const ownerCheck = (req, _res, next) => {
//     let user = User.findByPk(req.user.id, {
//         include: { model: Spot }
//     });
//     user = user.toJSON();
//     const spotDetails = user.Spot
//     if (spotDetails.ownerId == req.user.id) return next()
//     const err = new Error("Forbidden");
//     err.status = 403;
//     return next(err);
// };

module.exports = { setTokenCookie, restoreUser, requireAuth };
