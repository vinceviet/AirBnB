const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const reviewList = {};
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    });
    const spotPreviewImage = {};
    for (let spot of reviews) {
        const previewImage = await SpotImage.findOne({
            incldue: { model: Spot },
            attributes: ['url'],
            where: { spotId: spot.id, preview: true }
        });
        spotPreviewImage.previewImage = previewImage.toJSON().url
        spot = spot.toJSON();
        Object.assign(spot.Spot, spotPreviewImage);
        reviewList.Reviews = spot;
    };
    res.json(reviewList);
});

module.exports = router;
