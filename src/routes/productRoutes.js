const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productValidation = require('../validation/productValidation');
const validateRequest = require('../middleware/validationMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productValidation, validateRequest, productController.addProduct);
router.patch('/:id', productValidation, validateRequest, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;