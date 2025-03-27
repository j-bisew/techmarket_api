const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewValidation = require('../validation/reviewValidation');
const validateRequest = require('../middleware/validationMiddleware');

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/product/:productId', reviewController.getReviewsByProductId);
router.get('/user/:userId', reviewController.getReviewsByUserId);
router.post('/', reviewValidation, validateRequest, reviewController.addReview);
router.patch('/:id', reviewValidation, validateRequest, reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;