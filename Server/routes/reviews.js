const express = require("express");
const router = express.Router();
const {
    createReviewByStudioToUser,
    updateReviewByStudioToUser,
    getReviewById,
    getAllReviews,
    deleteReviewByStudioToUser,
} = require("../controllers/reviewByStudioController");

const { isStudio } = require("../middlewares/auth");

// Route protégée qui nécessite le rôle studio
router.post("/studio", isStudio, createReviewByStudioToUser);
router.put("/studio/:reviewId", isStudio, updateReviewByStudioToUser);
router.get("/studio/:reviewId", getReviewById);
router.get("/studio", getAllReviews);
router.delete("/studio/:reviewId", isStudio, deleteReviewByStudioToUser);

module.exports = router;
