const express = require('express');
const { requireAuth } = require('../../utils/auth.js');
const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();

// Delete a Spot Image // need auth
router.delete('/:imageId', requireAuth, async (req, res) => {
    let img = await SpotImage.findByPk(req.params.imageId, {
        include: { model: Spot }
    });
    if (!img) return res.status(404).json({ message: "Spot Image couldn't be found", statusCode: 404 });
    let imgCheck = img.toJSON();
    const ownerId = imgCheck.Spot.ownerId;
    if (ownerId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    await img.destroy();
    res.json({ messsage: "Successfully deleted", statusCode: 200 })
});

module.exports = router;
