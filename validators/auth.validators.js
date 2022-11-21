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
    body("first_name", "Please use alphabets only for the first name.")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .not()
        .isEmpty(),
    body("last_name", "Please use alphabets only for the last name.")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .not()
        .isEmpty(),
    body("email", "Please use a valid stratpoint email.")
        .trim()
        .normalizeEmail()
        .isEmail()
        .isAlphanumeric("en-US", { ignore: " @." })
        .custom((value, { req }) => {
            if (value.split("@")[1] === "stratpoint.com") return true;
            return false;
        })
        .custom((value, { req }) => {
            if (value.split("@")[0].length >= 3) return true;
            return false;
        }),
];

const updateProfileValidator = [
    body("username").trim().isAlphanumeric().not().isEmpty().optional(),
    body("password")
        .trim()
        .optional()
        .isAlphanumeric()
        .withMessage(
            "Invalid Password. Please enter a password use Alphanumeric Characters only."
        )
        .isLength({ min: 5 })
        .withMessage(
            "Invalid Password. Please enter a password with atleast 5 characters."
        ),
    body("first_name", "Please use alphabets only for the first name.")
        .trim()
        .optional()
        .isAlpha("en-US", { ignore: " " })
        .not()
        .isEmpty(),
    body("last_name", "Please use alphabets only for the last name.")
        .trim()
        .optional()
        .isAlpha("en-US", { ignore: " " })
        .not()
        .isEmpty(),
    body("email", "Please use a valid stratpoint email.")
        .trim()
        .optional()
        .normalizeEmail()
        .isEmail()
        .isAlphanumeric("en-US", { ignore: " @." })
        .custom((value, { req }) => {
            if (value.split("@")[1] === "stratpoint.com") return true;
            return false;
        })
        .custom((value, { req }) => {
            if (value.split("@")[0].length >= 3) return true;
            return false;
        }),
];

module.exports = { loginValidator, signUpValidator, updateProfileValidator };
