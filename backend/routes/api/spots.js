const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');
const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    const ratingAndImage = {};
    const avgRating = await Review.findOne({
        include: { model: Spot, attributes: ['id'] },
        attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']],
        where: { spotId: spots.id }
    });
    console.log(avgRating);

    res.json(spots)
});

module.exports = router;
