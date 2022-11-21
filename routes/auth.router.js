const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const multer = require("../middlewares/multer");
const {
  loginValidator,
  signUpValidator,
} = require("../validators/auth.validators");

router.route("/login").post(loginValidator, authController.postLogin);

router
  .route("/signup")
  .post(
    multer.single("cover_picture_url"),
    signUpValidator,
    authController.postSignup
  );

module.exports = router;
