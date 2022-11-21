const { body } = require("express-validator");

const loginValidator = [
  body("email").trim().isEmail().withMessage("Please use a valid email."),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage(
      "Invalid Password. Please enter a password use Alphanumeric Characters only."
    )
    .isLength({ min: 5 })
    .withMessage(
      "Invalid Password. Please enter a password with atleast 5 characters."
    ),
];
const signUpValidator = [
  body("username").trim().isAlphanumeric().not().isEmpty(),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage(
      "Invalid Password. Please enter a password use Alphanumeric Characters only."
    )
    .isLength({ min: 5 })
    .withMessage(
      "Invalid Password. Please enter a password with atleast 5 characters."
    ),
  body("first_name", 'Please use alphabets only for the first name.').trim().isAlpha('en-US', { ignore: ' ' }).not().isEmpty(),
  body("last_name", 'Please use alphabets only for the last name.').trim().isAlpha('en-US', { ignore: ' ' }).not().isEmpty(),
  body("email").trim().isEmail().withMessage("Please use a valid email."),
];

module.exports = { loginValidator, signUpValidator};
