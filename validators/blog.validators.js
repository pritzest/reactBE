const { body } = require("express-validator");

postBlogValidator = [
	body("description", "The description should be at least 3 characters long.")
		.trim()
		.isLength({ min: 3 }),
];

module.exports = { postBlogValidator };
