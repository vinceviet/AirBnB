const express = require('express');
const { requireAuth } = require('../../utils/auth.js');
const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    let img = await ReviewImage.findByPk(req.params.imageId, {
        include: { model: Review }
    });
    if (!img) return res.status(404).json({ message: "Review Image couldn't be found", statusCode: 404 });
    let imgCheck = img.toJSON()
    const userId = imgCheck.Review.userId;
    if (userId !== req.user.id) return res.status(403).json({ messsage: 'Forbidden', statusCode: 403 });
    await img.destroy();
    res.json({ messsage: "Successfully deleted", statusCode: 200 })
});

module.exports = router;
