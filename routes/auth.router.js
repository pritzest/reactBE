const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const {
	loginValidator,
	signUpValidator,
	updateProfileValidator,
} = require("../validators/auth.validators");

router.route("/login").post(loginValidator, authController.postLogin);

router
	.route("/signup")
	.post(
		signUpValidator,
		authController.postSignup
	);

router
	.route("/profile")
	.put(isAuth, updateProfileValidator, authController.updateUserProfile)
	.patch(isAuth, authController.updateProfilePicture);

router.route("/profile/:id").get(isAuth, authController.getUserProfile);

module.exports = router;
