const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { 
  cartItemValidationSchema, 
  cartItemUpdateValidationSchema,
  cartItemParamValidationSchema 
} = require('../validation/cartValidation');
const validateRequest = require('../middleware/validationMiddleware');

router.get('/', cartController.getCart);

router.post('/', cartItemValidationSchema, validateRequest, cartController.addToCart);

router.patch('/:productId', 
  cartItemParamValidationSchema, 
  cartItemUpdateValidationSchema, 
  validateRequest, 
  cartController.updateCartItem
);

router.delete('/:productId', 
  cartItemParamValidationSchema, 
  validateRequest, 
  cartController.removeFromCart
);

router.delete('/', cartController.clearCart);

module.exports = router;