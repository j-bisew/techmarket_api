const { checkSchema } = require('express-validator');

const reviewValidationSchema = checkSchema({
  product_id: {
    in: ['body'],
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'ID produktu jest wymagane.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'ID produktu musi być liczbą całkowitą dodatnią.'
    },
    toInt: true
  },
  user_id: {
    in: ['body'],
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'ID użytkownika jest wymagane.'
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'ID użytkownika musi być liczbą całkowitą dodatnią.'
    },
    toInt: true
  },
  rating: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Ocena jest wymagana.'
    },
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: 'Ocena musi być liczbą całkowitą od 1 do 5.'
    },
    toInt: true
  },
  comment: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { max: 1000 },
      errorMessage: 'Komentarz nie może przekraczać 1000 znaków.'
    }
  }
});

module.exports = reviewValidationSchema;