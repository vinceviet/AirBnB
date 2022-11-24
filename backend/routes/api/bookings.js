const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Booking, Spot, SpotImage, User, Review, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const bookingList = {};
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } }
    });
    console.log(await Booking.findByPk(1));
    const spotPreviewImage = {};
    const bookingArray = [];
    for (let spot of bookings) {
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.spotId, preview: true }
        });
        spotPreviewImage.previewImage = previewImage.toJSON().url
        spot = spot.toJSON();
        Object.assign(spot.Spot, spotPreviewImage);
        bookingArray.push(spot);
    };
    bookingList.Bookings = bookingArray;
    res.json(bookingList);
});


module.exports = router;
