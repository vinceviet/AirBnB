const express = require('express');
const asyncHandler = require('express-async-handler');
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
router.get('/', asyncHandler(async (req, res) => {
    let errors = { message: 'Validation Error', statusCode: 400, errors: {} }
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    const where = {};
    if (!page) page = 1;
    if (!size) size = 20;
    page = Number(page);
    size = Number(size);
    if (isNaN(page) || page <= 0) errors.errors.page = "Page must be greater than or equal to 1";
    if (page > 10) page = 10;
    if (isNaN(size) || size <= 0) errors.errors.size = "Size must be greater than or equal to 1";
    if (size > 20) size = 20;

    minLat = Number(minLat);
    maxLat = Number(maxLat);
    minLng = Number(minLng);
    maxLng = Number(maxLng);
    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);

    if (minLat && minLat >= -90 && minLat <= 90 && maxLat && maxLat >= -90 && maxLat <= 90 && minLat < maxLat) where.lat = { [Op.between]: [minLat, maxLat] };
    else if (minLat > maxLat) errors.errors.minLat = "Minimum latitude is invalid";
    else if (maxLat < minLat) errors.errors.maxLat = "Maximum latitude is invalid";
    else if (minLat && minLat >= -90 && minLat <= 90 && !maxLat) where.lat = { [Op.gte]: minLat };
    else if (minLat) errors.errors.minLat = "Minimum latitude is invalid";
    else if (maxLat && maxLat >= -90 && maxLat <= 90 && !minLat) where.lat = { [Op.lte]: maxLat };
    else if (maxLat) errors.errors.maxLat = "Maximum latitude is invalid";

    if (minLng && minLng >= -180 && minLng <= 180 && maxLng && maxLng >= -180 && maxLng <= 180 && minLng < maxLng) where.lng = { [Op.between]: [minLng, maxLng] };
    else if (minLng > maxLng) errors.errors.minLng = "Minimum longitude is invalid";
    else if (maxLng < minLng) errors.errors.maxLng = "Maximum longitude is invalid";
    else if (minLng && minLng >= -180 && minLng <= 180 && !maxLng) where.lng = { [Op.gte]: minLng };
    else if (minLng) errors.errors.minLng = "Minimum longitude is invalid";
    else if (maxLng && maxLng >= -180 && maxLng <= 180 && !minLng) where.lng = { [Op.lte]: maxLng };
    else if (maxLng) errors.errors.maxLng = "Maximum longitude is invalid";

    if (minPrice && minPrice >= 0 && maxPrice && maxPrice >= 0 && minPrice < maxPrice) where.price = { [Op.between]: [minPrice, maxPrice] };
    else if (minPrice >= maxPrice) errors.errors.minPrice = "Minimum price is invalid";
    else if (maxPrice <= minPrice) errors.errors.maxPrice = "Maximum price is invalid";
    else if (minPrice && minPrice >= 0 && !maxPrice) where.price = { [Op.gte]: minPrice };
    else if (minPrice) errors.errors.minPrice = "Minimum price must be greater than or equal to 0";
    else if (maxPrice && maxPrice >= 0 && !minPrice) where.price = { [Op.lte]: maxPrice };
    else if (maxPrice) errors.errors.maxPrice = "Maximum price must be greater than or equal to 0";

    if (JSON.stringify(errors.errors) === '{}' === false) return res.status(400).json(errors);

    const spotContainer = [];
    const ratingAndImage = {};
    let spots = await Spot.findAll({ where, limit: size, offset: size * (page - 1) });
    for (let spot of spots) {
        const avgRating = await Review.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']],
            where: { spotId: spot.id },
        });
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true },
        });
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
}));

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
            attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating']],
            where: { spotId: spot.id }
        });
        const previewImage = await SpotImage.findOne({
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
router.get('/:spotId', asyncHandler(async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId, {
        include: [{ model: SpotImage },
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
        { model: Review, attributes: [] }]
    });
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const reviewStats = {};
    const avgStarRating = await Review.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgStarRating']],
        where: { spotId: req.params.spotId }
    });
    reviewStats.numReviews = await spot.countReviews();
    reviewStats.avgStarRating = avgStarRating.toJSON().avgStarRating;

    spot = spot.toJSON();
    Object.assign(spot, reviewStats);
    res.json(spot);
}));

// Create a Spot
router.post('/', requireAuth, validateSpotPost, checkIfAddressExists, asyncHandler (async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = await Spot.create({
        address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id
    });
    res.json(newSpot);
}));

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    const { url, preview } = req.body;
    const newImage = await SpotImage.create({ url, preview, spotId: req.params.spotId });
    const scopedImage = await SpotImage.scope('postNewImage').findByPk(newImage.id)
    res.json(scopedImage);
});

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpotPost, asyncHandler (async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price, owerId: req.user.id });
    res.json(updatedSpot);

}));

// Delete a Spot
router.delete('/:spotId', requireAuth, asyncHandler (async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    if (spot.toJSON().ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    await spot.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
}));

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

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const bookingList = {};
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
    const bookingsNonOwner = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: ['spotId', 'startDate', 'endDate']
    });
    const bookingsOwner = await Booking.findAll({
        where: { spotId: req.params.spotId },
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

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateDates, async (req, res) => {
    let spotBookings = await Spot.findByPk(req.params.spotId, {
        attributes: ['ownerId'],
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
        if (Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate)) {
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
