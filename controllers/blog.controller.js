const Blog = require("../models/blog");
const Like = require("../models/likes.model");
const Comment = require("../models/comments.model");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.getBlogs = async (req, res, next) => {
	try {
		const postsData = [];
		const blogs = await Blog.find()
			.sort({ createdAt: -1 })
			.populate("user_id");

		for await (const blog of blogs) {
			const likes = [];
			const comments = [];

			const userLikes = await Like.find({
				blogId: blog._id,
				// action: true,
			}).select("userId _id");

			const userComments = await Comment.find({
				blogId: blog._id,
			})
				.sort({ createdAt: 1 })

				.populate("userId")
				.select("userId _id description createdAt");

			userLikes.forEach(function (like) {
				likes.push(like.userId);
			});

			userComments.forEach(function (comment) {
				comments.push({
					id: comment._id,
					userId: comment.userId,
					description: comment.description,
					createdAt: comment.createdAt,
				});
			});

			const updatedPostData = {
				...blog._doc,
				likes,
				comments,
			};

			postsData.push(updatedPostData);
		}

		return res.status(200).json({
			message: "Post loaded succesfully",
			postsData,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.getOneBlog = async (req, res, next) => {
	const { blog_id } = req.params;
	try {
		const blog = await Blog.findOne({
			_id: blog_id,
		}).populate({
			path: "user_id",
			select: "-password",
		});
		const likes = [];
		const comments = [];

		const userLikes = await Like.find({
			blogId: blog._id,
			// action: true,
		}).select("userId _id");

		const userComments = await Comment.find({
			blogId: blog._id,
		})
			.sort({ createdAt: 1 })

			.populate("userId")
			.select("userId _id description createdAt");

		userLikes.forEach(function (like) {
			likes.push(like.userId);
		});

		userComments.forEach(function (comment) {
			comments.push({
				id: comment._id,
				userId: comment.userId,
				description: comment.description,
				createdAt: comment.createdAt,
			});
		});

		const updatedPostData = {
			...blog._doc,
			likes,
			comments,
		};

		if (!blog) {
			return res.status(404).json({
				message: "Post cannot be found",
				blog: {},
			});
		}

		return res.status(200).json({
			message: "Post succesfully loaded",
			blog: updatedPostData,
		});
	} catch (err) {
		next(err);
	}
};
exports.getUserPosts = async (req, res, next) => {
	const { id } = req.params;

	try {
		const postsData = [];
		const blogs = await Blog.find({ user_id: id })
			.sort({ createdAt: -1 })
			.populate("user_id");

		for await (const blog of blogs) {
			const likes = [];
			const comments = [];

			const userLikes = await Like.find({
				blogId: blog._id,
				// action: true,
			}).select("userId _id");

			const userComments = await Comment.find({
				blogId: blog._id,
			})
				.sort({ createdAt: 1 })

				.populate("userId")
				.select("userId _id description createdAt");

			userLikes.forEach(function (like) {
				likes.push(like.userId);
			});

			userComments.forEach(function (comment) {
				comments.push({
					id: comment._id,
					userId: comment.userId,
					description: comment.description,
					createdAt: comment.createdAt,
				});
			});

			const updatedPostData = {
				...blog._doc,
				likes,
				comments,
			};

			postsData.push(updatedPostData);
		}

		return res.status(200).json({
			message: "Post loaded succesfully",
			postsData,
		});
	} catch (err) {
		next(err);
	}
};

exports.postBlog = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ message: errors.array() });
	}
	const { description } = req.body;
	try {
		const blog = await Blog.create({
			description,
			user_id: req.mongoDB_id,
		});

		await blog.populate({ path: "user_id", select: "-password" });

		return res.status(201).json({
			message: "Post created succesfully",
			blog,
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteBlog = async (req, res, next) => {
	const { blog_id } = req.params;
	try {
		const blog = await Blog.findOne({ _id: blog_id });
		if (!blog) {
			const error = new Error("Blog cannot be found");
			error.statusCode = 404;
			throw error;
		}
		if (blog.user_id.toString() !== req.mongoDB_id) {
			const error = new Error("Forbidden. Cannot delete");
			error.statusCode = 403;
			throw error;
		}
		await Blog.deleteOne({ _id: blog_id });
		await Comment.deleteMany({
			blogId: blog_id,
		});
		return res.status(200).json({
			message: "Blog successfully deleted",
		});
	} catch (err) {
		next(err);
	}
};

exports.updateBlog = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ message: errors.array() });
	}
	const { title, description } = req.body;
	const { blog_id } = req.params;
	try {
		const blog = await Blog.findOne({ id: blog_id });
		if (!blog) {
			const error = new Error("Unauthorized Access");
			error.statusCode = 401;
			throw error;
		}
		if (blog.user_id.toString() !== req.mongoDB_id) {
			const error = new Error("Forbidden. Cannot update");
			error.statusCode = 403;
			throw error;
		}
		let cover_picture_url = blog.cover_picture_url;
		console.log(cover_picture_url);
		if (req.file) {
			if (cover_picture_url) {
				fs.unlink(
					path.join(require.main.path, cover_picture_url),
					(err) => {
						if (err && err.code === "ENOENT")
							console.log("No image to unlink. Proceeding");
						else if (err) console.log("An error occured");
						else console.log("Image updated.");
					}
				);
			}

			cover_picture_url = req.file.path.split("\\").join("/");
		}
		await Blog.updateOne(
			{ id: blog.id },
			{ $set: { title, description, cover_picture_url, is_draft: false } }
		);
		return res.status(201).json({
			message: "Blog updated",
		});
	} catch (err) {
		next(err);
	}
};
