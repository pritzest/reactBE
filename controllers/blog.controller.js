const Blog = require("../models/blog");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.getBlogs = async (req, res, next) => {
    let filterBlogs;
    // const page = req.query.page || 1;
    // const perPage = req.query.perPage || 20;
    const title = req.query.title;
    const regex = new RegExp(title, "i");
    try {
        const blogs = await Blog.find().populate("user_id");
        // .limit(perPage)
        // .skip((page - 1) * perPage);
        if (title) {
            filterBlogs = blogs.filter((blog) => {
                return (
                    blog.deleted_at === null &&
                    blog.is_draft === false &&
                    regex.test(blog.title)
                );
            });
        } else {
            filterBlogs = blogs.filter((blog) => {
                return blog.deleted_at === null && blog.is_draft === false;
            });
        }
        console.log(filterBlogs, title);
        return res.status(200).json({
            message: "Blogs loaded succesfully",
            blogs: filterBlogs,
        });
    } catch (err) {
        next(err);
    }
};

exports.getOneBlog = async (req, res, next) => {
    const { blog_id } = req.params;
    try {
        const blog = await Blog.findOne({
            deleted_at: null,
            id: blog_id,
        }).populate("user_id");
        if (!blog) {
            return res.status(404).json({
                message: "Blog cannot be found",
                blog: {},
            });
        }
        return res.status(200).json({
            message: "Blog succesfully loaded",
            blog,
        });
    } catch (err) {
        next(err);
    }
};
exports.getUserPosts = async (req, res, next) => {
    const title = req.query.title;
    const regex = new RegExp(title, "i");
    try {
        const blogs = await Blog.find({ user_id: req.mongoDB_id }).populate(
            "user_id"
        );
        const deletedBlogs = blogs.filter((blog) => {
            return blog.deleted_at !== null && regex.test(blog.title);
        });
        const draftBlogs = blogs.filter((blog) => {
            return blog.is_draft !== false && blog.deleted_at === null;
        });
        const userBlogs = blogs.filter((blog) => {
            return (
                blog.deleted_at === null &&
                blog.is_draft === false &&
                regex.test(blog.title)
            );
        });
        return res.status(200).json({
            message: "Blogs loaded succesfully",
            deletedBlogs,
            draftBlogs,
            userBlogs,
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
    const { title, description, user_id } = req.body;
    try {
        if (!req.file) {
            const error = new Error("Picture is required.");
            error.statusCode = 422;
            throw error;
        }
        const cover_picture_url = req.file.path.split("\\").join("/");
        const blog = await Blog.create({
            title,
            description,
            cover_picture_url,
            user_id: req.mongoDB_id,
        });
        return res.status(201).json({
            message: "Blog created succesfully",
            blog,
        });
    } catch (err) {
        next(err);
    }
};

exports.postDraft = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
    }
    const { title, description } = req.body;
    try {
        const blog = await Blog.create({
            title,
            description,
            is_draft: true,
            user_id: req.mongoDB_id,
        });
        return res.status(201).json({
            message: "Blog created succesfully",
            blog,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteBlog = async (req, res, next) => {
    const { blog_id } = req.params;
    try {
        const blog = await Blog.findOne({ id: blog_id });
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
        await Blog.updateOne(
            { id: blog.id },
            { $set: { deleted_at: new Date().toISOString() } }
        );
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
