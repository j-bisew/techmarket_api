const { checkSchema } = require('express-validator');

const categoryValidationSchema = checkSchema({
  name: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Nazwa kategorii jest wymagana.'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Nazwa kategorii musi mieć od 2 do 50 znaków.'
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
  }
});

module.exports = categoryValidationSchema;