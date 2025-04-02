const { checkSchema } = require('express-validator');

const cartItemValidationSchema = checkSchema({
  product_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'ID produktu jest wymagane.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'ID produktu musi być liczbą całkowitą dodatnią.'
    },
    toInt: true
  },
  quantity: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Ilość jest wymagana.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'Ilość musi być liczbą całkowitą większą lub równą 1.'
    },
    toInt: true
  }
});

const cartItemUpdateValidationSchema = checkSchema({
  quantity: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Ilość jest wymagana.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'Ilość musi być liczbą całkowitą większą lub równą 1.'
    },
    toInt: true
  }
});

const cartItemParamValidationSchema = checkSchema({
  productId: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'ID produktu jest wymagane.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'ID produktu musi być liczbą całkowitą dodatnią.'
    },
    toInt: true
  }
});

module.exports = {
  cartItemValidationSchema,
  cartItemUpdateValidationSchema,
  cartItemParamValidationSchema
};