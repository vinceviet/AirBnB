const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const router = express.Router();

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

module.exports = router;
