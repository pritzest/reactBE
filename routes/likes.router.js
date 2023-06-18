const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const likesController = require("../controllers/like.controller");

router
	.route("/:blog_id")
	.get(isAuth, likesController.getLike)
	.put(isAuth, likesController.postLike);

module.exports = router;
