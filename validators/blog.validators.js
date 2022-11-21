const { body } = require("express-validator");

postBlogValidator = [
  body("title", 'Title should be at least 5 characters long').trim().isLength({min:5}),
  body(
    "description",
    "The description should be at least 10 characets long."
  ).isLength({ min: 10 }),
];

draftBlogValidator = [
  body("title").trim(),
  body(
    "description",
  ).trim(),
];

module.exports = { postBlogValidator, draftBlogValidator };
