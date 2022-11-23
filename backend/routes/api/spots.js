const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const router = express.Router();

const validatePost = [
    check('address').exists({ checkFalsy: true }).notEmpty().withMessage("Street address is required"),
    check('city').exists({ checkFalsy: true }).withMessage("City is required"),
    check('state').exists({ checkFalsy: true }).withMessage("State is required"),
    check('country').exists({ checkFalsy: true }).withMessage("Country is required"),
    check('lat').exists({ checkFalsy: true }).withMessage("Latitude is not valid"),
    check('lng').exists({ checkFalsy: true }).withMessage("Longitude is not valid"),
    check('name').exists({ checkFalsy: true }).withMessage("Name must be less than 50 characters"),
    check('description').exists({ checkFalsy: true }).withMessage("Description is required"),
    check('price').exists({ checkFalsy: true }).withMessage("Price per day is required"),
    handleValidationErrors
];

const checkIfAddressExists = (req, res, next) => {
    Spot.findOne({ where: { address: req.body.address } }).then(spot => {
        if (spot) {
            res.status(403).json({
                message: "Address already exists",
                statusCode: 403,
                errors: {
                    address: "Spot with that address already exists"
                }
            });
            return;
        };
        next()
    });
};

router.get('/', async (req, res) => {
    const spotContainer = [];
    const ratingAndImage = {};
    let spots = await Spot.findAll();
    for (let spot of spots) {
        const avgRating = await Review.findOne({
            include: { model: Spot },
            attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']],
            where: { spotId: spot.id }
        });
        const previewImage = await SpotImage.findOne({
            incldue: { model: Spot },
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        });
        ratingAndImage.avgRating = avgRating.toJSON().avgRating;
        ratingAndImage.previewImage = previewImage.toJSON().url;
        spot = spot.toJSON();
        Object.assign(spot, ratingAndImage);
        spotContainer.push(spot)
    };
    const spotList = {};
    spotList.Spots = spotContainer;

    res.json(spotList)
});

router.get('/current', requireAuth, async (req, res) => {
    const spotContainer = [];
    const ratingAndImage = {};
    const currentUserSpots = await Spot.findAll({
        incldue: { model: User },
        where: { ownerId: req.user.id }
    });
    for (let spot of currentUserSpots) {
        const avgRating = await Review.findOne({
            include: { model: Spot },
            attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']],
            where: { spotId: spot.id }
        });
        const previewImage = await SpotImage.findOne({
            incldue: { model: Spot },
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        });
        ratingAndImage.avgRating = avgRating.toJSON().avgRating;
        ratingAndImage.previewImage = previewImage.toJSON().url;
        spot = spot.toJSON();
        Object.assign(spot, ratingAndImage);
        spotContainer.push(spot)
    };
    const spotList = {};
    spotList.Spots = spotContainer;

    res.json(spotList)
});

router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId, {
        include: [{ model: SpotImage },
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
        { model: Review, attributes: [] }]
    });
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const reviewStats = {};
    const avgStarRating = await Review.findOne({
        include: { model: Spot },
        attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgStarRating']],
        where: { spotId: req.params.spotId }
    });
    reviewStats.numReviews = await spot.countReviews();
    reviewStats.avgStarRating = avgStarRating.toJSON().avgStarRating;

    spot = spot.toJSON();
    Object.assign(spot, reviewStats);
    res.json(spot);
});

router.post('/', requireAuth, validatePost, checkIfAddressExists, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = await Spot.create({
        address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id
    });
    res.json(newSpot);
});

router.post('/:spotId/images', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const { url, preview } = req.body;
    const newImage = await SpotImage.create({ url, preview, spotId: req.params.spotId });
    const scopedImage = await SpotImage.scope('postNewImage').findByPk(newImage.id)
    res.json(scopedImage);
});

router.put('/:spotId', requireAuth, /*validatePost, checkIfAddressExists,*/ async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price, owerId: req.user.id });
    res.json(updatedSpot);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    await spot.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
});


module.exports = router;
