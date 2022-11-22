const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
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

module.exports = router;
