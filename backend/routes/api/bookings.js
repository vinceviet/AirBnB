const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Booking, Spot, User, Review, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();


module.exports = router;
