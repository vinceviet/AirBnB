const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Booking, Spot, SpotImage, User, Review, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const bookingList = {};
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } }
    });
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

// Edit a Booking // need auth
router.put('/:bookingId', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking couldn't be found", statusCode: 404 });
    if (booking.toJSON().userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });

    const { startDate, endDate } = req.body;
    if (Date.parse(startDate) >= Date.parse(endDate)) return res.status(400).json({ message: "Validation error", statusCode: 400, errors: { endDate: "endDate cannot be on or before startDate" } });
    if (Date.parse(endDate) < Date.now()) return res.status(403).json({ messsage: "Past bookings can't be modified", statusCode: 403 });

    let spot = await Spot.findByPk(booking.spotId, {
        include: { model: Booking }
    });
    spot = spot.toJSON();
    let bookingList = spot.Bookings;
    for (let booking of bookingList) {
        if (Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(endDate) <= Date.parse(booking.endDate)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specifed dates",
                statusCode: 403,
                errors: { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" }
            });
        };
    };
    const updateBooking = await booking.update({ startDate, endDate });
    res.json(updateBooking);
});

// Delete a Booking // need auth
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking couldn't be found", statusCode: 404 });
    if (booking.toJSON().userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    if (Date.parse(Booking.startDate) > Date.now()) return res.status(403).json({ message: "Bookings that have been started can't be deleted", statusCode: 403 });
    await booking.destroy();
    res.json({ message: "Successfully deleted", statusCode: 200 });
});


module.exports = router;
