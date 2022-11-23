const User = require("../models/user");
const md5 = require("md5");
const JWTSign = require("../utils/jwt-sign");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog");

//username, password, first_name, last_name, email, profile_picture_url
exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: errors.array() });
    }
    const { username, password, first_name, last_name, email } = req.body;
    try {
        const isExisting = await User.findOne({
            $or: [{ username }, { email }],
        });
        //Check if a user already exists either using username or email
        if (isExisting) {
            const error = new Error("User already exists.");
            error.statusCode = 403;
            throw error;
        }
        if (!req.file) {
            const error = new Error("Picture is required.");
            error.statusCode = 422;
            throw error;
        }
        const profile_picture_url = req.file.path.split("\\").join("/");
        //Hashing password using md5 before saving in the database
        const hashedPassword = md5(password);
        const newUser = new User({
            username,
            password: hashedPassword,
            first_name,
            last_name,
            email,
            profile_picture_url,
        });
        await newUser.save();
        return res.status(201).json({
            message: "User created succesfully.",
        });
    } catch (err) {
        next(err);
    }
};

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist.");
            error.statusCode = 403;
            throw error;
        }
        if (md5(password) !== user.password) {
            const error = new Error("Password doesn't match.");
            error.statusCode = 403;
            throw error;
        }
        const token = JWTSign({
            id: user.id,
            name: user.username,
            email: user.email,
            _id: user._id,
        });
        return res.status(200).json({
            message: "Login Succesful",
            token,
            _id: user._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.mongoDB_id).select("-password");
        if (!user) {
            const error = new Error("User does not exist.");
            error.statusCode = 403;
            throw error;
        }
        const blogs = await Blog.find({ user_id: req.mongoDB_id });
        const deletedBlogs = blogs.filter((blog) => {
            return blog.deleted_at !== null;
        });
        const draftBlogs = blogs.filter((blog) => {
            return blog.is_draft !== false;
        });
        const userBlogs = blogs.filter((blog) => {
            return blog.deleted_at === null && blog.is_draft === false;
        });
        return res.status(200).json({
            message: "User succesfully retrieved",
            user,
            deletedBlogs: deletedBlogs.length,
            draftBlogs: draftBlogs.length,
            userBlogs: userBlogs.length,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
    }
    let { username, first_name, last_name, email, password } = req.body;
    try {
        const user = await User.findById(req.mongoDB_id);
        if (!user) {
            const error = new Error("User does not exist.");
            error.statusCode = 403;
            throw error;
        }
        const exists = await User.findOne({
            $or: [{ email }, { username }],
            _id: { $ne: req.mongoDB_id },
        });
        if (exists) {
            const error = new Error(
                "User with that email/username already exists."
            );
            error.statusCode = 403;
            throw error;
        }
        // console.log(password, user.password);
        console.log(password, user.password);
        console.log(username, first_name, last_name, email);
        if (password && md5(password) !== user.password) {
            if (user.password_chances >= 3) {
                const error = new Error(
                    "Password limit reached. You cannot change your password anymore."
                );
                error.statusCode = 403;
                throw error;
            }
            await User.updateOne(
                { _id: req.mongoDB_id },
                {
                    $set: {
                        username,
                        first_name,
                        last_name,
                        email,
                        password: md5(password),
                        password_chances: user.password_chances + 1,
                    },
                }
            );
        } else {
            await User.updateOne(
                { _id: req.mongoDB_id },
                {
                    $set: {
                        username,
                        first_name,
                        last_name,
                        email,
                        password: user.password,
                    },
                }
            );
        }
        return res.status(201).json({
            message: "User updated",
        });
    } catch (err) {
        next(err);
    }
};
exports.updateProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("Picture is required.");
            error.statusCode = 422;
            throw error;
        }
        const profile_picture_url = req.file.path.split("\\").join("/");
        await User.updateOne(
            { _id: req.mongoDB_id },
            { $set: { profile_picture_url } }
        );
        return res.status(201).json({
            message: "Profile Picture updated succesfully.",
        });
    } catch (err) {
        next(err);
    }
};
