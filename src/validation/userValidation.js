const { checkSchema } = require('express-validator');

const userValidationSchema = checkSchema({
  username: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Nazwa użytkownika jest wymagana.'
    },
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage: 'Nazwa użytkownika musi mieć od 3 do 30 znaków.'
    },
    matches: {
      options: /^[a-zA-Z0-9_]+$/,
      errorMessage: 'Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia.'
    }
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Email jest wymagany.'
    },
    isEmail: {
      errorMessage: 'Podaj prawidłowy adres email.'
    },
    normalizeEmail: true
  },
  password: {
    in: ['body'],
    notEmpty: {
      if: (_value, { req }) => req.method === 'POST',
      errorMessage: 'Hasło jest wymagane.'
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Hasło musi mieć co najmniej 6 znaków.'
    }
  },
  first_name: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { max: 50 },
      errorMessage: 'Imię nie może przekraczać 50 znaków.'
    }
  },
  last_name: {
    in: ['body'],
    optional: true,
    trim: true,
    isLength: {
      options: { max: 50 },
      errorMessage: 'Nazwisko nie może przekraczać 50 znaków.'
    }
  }
});

module.exports = userValidationSchema;