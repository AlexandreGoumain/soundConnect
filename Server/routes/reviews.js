const express = require("express");
const router = express.Router();
const { isArtist, isStudio } = require("../middlewares/auth");

// Import des contrôleurs
const {
    createReviewByStudioToUser,
    updateReviewByStudioToUser,
    deleteReviewByStudioToUser,
    getAllReviewsMadeByStudioToUser,
    getReviewsByStudio,
} = require("../controllers/reviewByStudioController");

const {
    createReviewByUserToStudio,
    updateReviewByUserToStudio,
    deleteReviewByUserToStudio,
    getAllReviewsMadeByUserToStudio,
    getReviewsByUser,
} = require("../controllers/reviewByUserController");

const {
    getReviewById,
    getAllReviews,
} = require("../controllers/reviewController");

// Routes générales
router.get("/", getAllReviews);
router.get("/:reviewId", getReviewById);

// Routes pour les avis des studios sur les utilisateurs
router.post("/studio", isStudio, createReviewByStudioToUser);
router.put("/studio/:reviewId", isStudio, updateReviewByStudioToUser);
router.delete("/studio/:reviewId", isStudio, deleteReviewByStudioToUser);
router.get("/studio", getAllReviewsMadeByStudioToUser);

// Routes pour les avis des utilisateurs sur les studios
router.post("/user", isArtist, createReviewByUserToStudio);
router.put("/user/:reviewId", isArtist, updateReviewByUserToStudio);
router.delete("/user/:reviewId", isArtist, deleteReviewByUserToStudio);
router.get("/user", getAllReviewsMadeByUserToStudio);
router.get("/user/:userId", getReviewsByUser);

module.exports = router;
