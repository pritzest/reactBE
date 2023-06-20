const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const commentController = require("../controllers/comment.controller");

router
	.route("/:blog_id")
	.get(isAuth, commentController.getComment)
	.post(isAuth, commentController.postComment);

module.exports = router;
