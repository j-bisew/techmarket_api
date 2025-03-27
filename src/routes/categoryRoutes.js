const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const categoryValidation = require('../validation/categoryValidation');
const validateRequest = require('../middleware/validationMiddleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getCategoryWithProducts);
router.post('/', categoryValidation, validateRequest, categoryController.addCategory);
router.patch('/:id', categoryValidation, validateRequest, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;