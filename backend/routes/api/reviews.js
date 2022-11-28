const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

const validateReview = [
    check('review').exists({ checkFalsy: true }).notEmpty().withMessage("Review text is required"),
    check('stars').exists({ checkFalsy: true }).notEmpty().withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

// Get all Reviews of the Current User
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
    const reviewArray = [];
    for (let spot of reviews) {
        const previewImage = await SpotImage.findOne({
            incldue: { model: Spot },
            attributes: ['url'],
            where: { spotId: spot.spotId, preview: true }
        });
        if (previewImage !== null) spotPreviewImage.previewImage = previewImage.toJSON().url
        spot = spot.toJSON();
        Object.assign(spot.Spot, spotPreviewImage);
        reviewArray.push(spot);
    };
    reviewList.Reviews = reviewArray;
    res.json(reviewList);
});

// Add an Image to a Review based on the Review's id // need auth
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    if (review.toJSON().userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });

    const newImage = await ReviewImage.create({
        url: req.body.url,
        reviewId: req.params.reviewId
    });

    const reviewImages = await ReviewImage.count({ where: { reviewId: req.params.reviewId } });
    if (reviewImages > 10) return res.status(403).json({ message: "Maximum number of images for this resource was reached", statusCode: 403 });
    const scopedImage = await ReviewImage.scope('createImage').findByPk(newImage.id);
    res.json(scopedImage);
});

// Edit a Reivew // need auth
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const reviewId = await Review.findByPk(req.params.reviewId);
    if (!reviewId) return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    if (reviewId.toJSON().userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    const { review, stars } = req.body;
    const editedReview = await reviewId.update({ review, stars });
    res.json(editedReview);
});

// Delete a Review // need auth
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    if (review.toJSON().userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    await review.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
});

module.exports = router;
