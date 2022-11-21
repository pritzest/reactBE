const express = require("express");
const blogController = require("../controllers/blog.controller");
const isAuth = require("../middlewares/isAuth");
const multer = require("../middlewares/multer");
const {
  postBlogValidator, draftBlogValidator,
} = require("../validators/blog.validators");

const router = express.Router();

router
  .route("/")
  .get(isAuth,blogController.getBlogs)
  .post(isAuth, multer.single('cover_picture_url'), postBlogValidator, blogController.postBlog);

router.route('/userblogs').post(isAuth, draftBlogValidator, blogController.postDraft).get(isAuth, blogController.getUserPosts)

router
  .route("/:blog_id")
  .get(isAuth, blogController.getOneBlog)
  .delete(isAuth, blogController.deleteBlog)
  .put(isAuth, multer.single('cover_picture_url'), postBlogValidator, blogController.updateBlog);
  

module.exports = router;
