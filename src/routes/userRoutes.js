const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidation = require('../validation/userValidation');
const validateRequest = require('../middleware/validationMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/reviews', userController.getUserWithReviews);
router.post('/register', userValidation, validateRequest, userController.registerUser);
router.patch('/:id', userValidation, validateRequest, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;