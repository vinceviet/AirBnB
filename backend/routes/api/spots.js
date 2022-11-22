const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, User } = require('../../db/models');
const router = express.Router();

module.exports = router;
