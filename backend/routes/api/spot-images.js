const express = require('express');
const { requireAuth } = require('../../utils/auth.js');
const { SpotImage } = require('../../db/models');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const img = await SpotImage.findByPk(req.params.imageId);
    if (!img) return res.status(404).json({ message: "Spot Image couldn't be found", statusCode: 404 });
    await img.destroy();
    res.json({ messsage: "Successfully deleted", statusCode: 200 })
});

module.exports = router;
