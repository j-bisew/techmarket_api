const { checkSchema } = require('express-validator');

const productValidationSchema = checkSchema({
  name: {
    in: ['body'],
    trim: true,
    notEmpty: {
        if: (_value, { req }) => req.method === 'POST',
        errorMessage: 'Nazwa produktu jest wymagana.'
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Nazwa produktu musi mieć od 2 do 100 znaków.'
    }
  },
  category: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Kategoria produktu jest wymagana.'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Kategoria musi mieć od 2 do 50 znaków.'
    }
  },
  description: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { max: 500 },
      errorMessage: 'Opis nie może przekraczać 500 znaków.'
    }
  },
  price: {
    in: ['body'],
    optional: { options: { nullable: true } }, // Opcjonalne dla PATCH
    isFloat: {
      options: { min: 0.01 },
      errorMessage: 'Cena musi być liczbą większą od 0.'
    },
    toFloat: true
  },
  stock_count: {
    in: ['body'],
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Ilość produktów na stanie jest wymagana.'
    },
    isInt: {
      options: { min: 0 },
      errorMessage: 'Ilość na stanie musi być liczbą całkowitą nieujemną.'
    },
    toInt: true
  },
  brand: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { max: 50 },
      errorMessage: 'Nazwa marki nie może przekraczać 50 znaków.'
    }
  },
  image_url: {
    in: ['body'],
    optional: true,
    trim: true,
    isURL: {
      errorMessage: 'Adres URL obrazu jest nieprawidłowy.'
    }
  },
  is_available: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: 'Status dostępności musi być wartością logiczną (true/false).'
    },
    toBoolean: true
  }
});

module.exports = productValidationSchema;