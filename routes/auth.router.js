const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const multer = require("../middlewares/multer");
const {
    loginValidator,
    signUpValidator,
    updateProfileValidator,
} = require("../validators/auth.validators");

router.route("/login").post(loginValidator, authController.postLogin);

router
    .route("/signup")
    .post(
        multer.single("cover_picture_url"),
        signUpValidator,
        authController.postSignup
    );

router
    .route("/profile")
    .get(authController.getUserProfile)
    .put(isAuth, updateProfileValidator, authController.updateUserProfile)
    .patch(
        isAuth,
        multer.single("profile_picture_url"),
        authController.updateProfilePicture
    );
module.exports = router;
