const ReviewModel = require("../models/reviewModel");

const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.getAllReviews();
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

const getReviewById = async (req, res, next) => {
    try {
        const review = await ReviewModel.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(review);
    } catch (err) {
        next(err);
    }
};

const getReviewsByProductId = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.getReviewsByProductId(req.params.productId);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

const getReviewsByUserId = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.getReviewsByUserId(req.params.userId);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

const addReview = async (req, res, next) => {
    try {
        const newReview = await ReviewModel.addReview(req.body);
        res.status(201).json(newReview);
    } catch (err) {
        if (err.message === "User has already reviewed this product") {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        });
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }
        
        if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        
        const updatedReview = await ReviewModel.updateReview(req.params.id, updates);
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(updatedReview);
    } catch (err) {
        next(err);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const deleted = await ReviewModel.deleteReview(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({
            message: "Review deleted successfully",
            id: req.params.id
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByProductId,
    getReviewsByUserId,
    addReview,
    updateReview,
    deleteReview
};