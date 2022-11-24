const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');

const spotImagesRouter = require('./spot-images');
const reviewImagesRouter = require('./review-images');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

// router.use(requireAuth);
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);

router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});


module.exports = router;
