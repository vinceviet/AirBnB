const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
// const user = require('../../db/models/user');
const router = express.Router();

const validateSpotPost = [
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

const validateReviewPost = [
    check('review').exists({ checkFalsy: true }).notEmpty().withMessage("Review text is required"),
    check('stars').exists({ checkFalsy: true }).notEmpty().withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateDates = [
    check('startDate').exists({ checkFalsy: true }).notEmpty().isDate().withMessage("Invalid date"),
    check('endDate').exists({ checkFalsy: true }).notEmpty().isDate().withMessage("Invalid date"),
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

// Get all spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    page = Number(page);
    size = Number(size);
    if (isNaN(page) || page <= 0) page = 1;
    if (page > 10) page = 10;
    if (isNaN(size) || size <= 0) size = 20;
    if (size > 20) size = 20;

    const spotContainer = [];
    const ratingAndImage = {};
    let spots = await Spot.findAll({ limit: size, offset: size * (page - 1) });
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
        console.log(previewImage)
        if (avgRating !== null) ratingAndImage.avgRating = avgRating.toJSON().avgRating;
        if (previewImage !== null) ratingAndImage.previewImage = previewImage.toJSON().url;
        spot = spot.toJSON();
        Object.assign(spot, ratingAndImage);
        spotContainer.push(spot)
    };
    const spotList = {};
    spotList.Spots = spotContainer;
    spotList.page = page;
    spotList.size = size;

    res.json(spotList)
});

// Get all Spots owned by the Current User
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
        if (avgRating !== null) ratingAndImage.avgRating = avgRating.toJSON().avgRating;
        if (previewImage !== null) ratingAndImage.previewImage = previewImage.toJSON().url;
        spot = spot.toJSON();
        Object.assign(spot, ratingAndImage);
        spotContainer.push(spot)
    };
    const spotList = {};
    spotList.Spots = spotContainer;

    res.json(spotList)
});

// Get details of a Spot from an id
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

// Create a Spot
router.post('/', requireAuth, validateSpotPost, checkIfAddressExists, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = await Spot.create({
        address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id
    });
    res.json(newSpot);
});

// Add an Image to a Spot based on the Spot's id // need auth
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    const { url, preview } = req.body;
    const newImage = await SpotImage.create({ url, preview, spotId: req.params.spotId });
    const scopedImage = await SpotImage.scope('postNewImage').findByPk(newImage.id)
    res.json(scopedImage);
});

// Edit a Spot // need auth
router.put('/:spotId', requireAuth, validateSpotPost, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price, owerId: req.user.id });
    res.json(updatedSpot);

});

// Delete a Spot // need auth
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    await spot.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const spotReviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    });
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const spotReviewList = {};
    spotReviewList.Reviews = spotReviews;
    res.json(spotReviewList);
});

// Create a Review for a Spot based on the the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReviewPost, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId, {
        include: { model: Review }
    });
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    spot = spot.toJSON()
    console.log(spot);
    for (let user of spot.Reviews) {
        if (user.userId == req.user.id) return res.status(403).json({ message: "User already has a review for this spot", statusCode: 403 })
    };
    const { review, stars } = req.body;
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: spot.id,
        review,
        stars
    });
    res.json(newReview);
});

// Get all Bookings for a Spot based on the Spot's id // need auth specifics
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const bookingList = {};
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const bookingsNonOwner = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: ['spotId', 'startDate', 'endDate']
    });
    const bookingsOwner = await Booking.findAll({
        include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
    });
    if (spot.toJSON().ownerId !== req.user.id) {
        bookingList.Bookings = bookingsNonOwner;
        return res.json(bookingList);
    }
    if (spot.toJSON().ownerId === req.user.id) {
        bookingList.Bookings = bookingsOwner;
        return res.json(bookingList);
    };
});

// Create a Booking from a Spot based on the Spot's id // need auth specific
router.post('/:spotId/bookings', requireAuth, validateDates, async (req, res) => {
    let spotBookings = await Spot.findByPk(req.params.spotId, {
        attributes: [],
        include: { model: Booking }
    });
    if (!spotBookings) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spotBookings.toJSON().ownerId === req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });

    const { startDate, endDate } = req.body;
    if (startDate >= endDate) return res.status(400).json({ message: "Validation error", statusCode: 400, errors: { endDate: "endDate cannot be on or before startDate" } });
    let newBooking = await Booking.create({
        spotId: +req.params.spotId, userId: req.user.id, startDate, endDate
    });

    spotBookings = spotBookings.toJSON();
    let bookingList = spotBookings.Bookings;
    for (let booking of bookingList) {
        console.log(booking)
        if (Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate <= Date.parse(booking.endDate))) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specifed dates",
                statusCode: 403,
                errors: { startDate: "Start date conflicts with an existing booking" }
            });
        };
        if (Date.parse(endDate) <= Date.parse(booking.endDate) && Date.parse(startDate) >= Date.parse(booking.startDate)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specifed dates",
                statusCode: 403,
                errors: { endDate: "End date conflicts with an existing booking" }
            });
        };
    };

    res.json(newBooking);
});

module.exports = router;
