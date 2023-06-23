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
	body("first_name")
		.trim()
		.not()
		.isEmpty()
		.withMessage('First name is required')
		.isAlpha("en-US", { ignore: " " })
		.withMessage('Please use alphabets only for the first name.	'),
	body("last_name")
		.trim()
		.not()
		.isEmpty()
		.withMessage('Last name is required')
		.isAlpha("en-US", { ignore: " " })
		.withMessage('Please use alphabets only for the last name.'),
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
	body("password")
		.trim()
		.isAlphanumeric()
		.withMessage(
			"Invalid Password. Please enter a password use Alphanumeric Characters only."
		)
		.isLength({ min: 5 })
		.withMessage(
			"Invalid Password. Please enter a password with atleast 5 characters."
		)
		.optional({ nullable: true, checkFalsy: true }),
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
