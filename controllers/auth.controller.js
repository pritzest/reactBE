const User = require("../models/user");
const md5 = require("md5");
const JWTSign = require("../utils/jwt-sign");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog");
const { v2: cloudinary } = require("cloudinary");

//username, password, first_name, last_name, email, profile_picture_url
exports.postSignup = async (req, res, next) => {
	//used validationResult to return the errors in res.status (can be accessed in frotnend)
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return res.status(422).json({ message: errors.array() });
	}

	const { birthday, bio, password, first_name, last_name, email } = req.body;
	try {
		const isExisting = await User.findOne({ email });
		//Check if a user already exists either using username or email
		if (isExisting) {
			const error = new Error("User already exists.");
			error.statusCode = 403;
			throw error;
		}
		// if no file/profile picture has been uploaded
		// if (!req.file) {
		// 	const error = new Error("Picture is required.");
		// 	error.statusCode = 422;
		// 	throw error;
		// }
		// const profile_picture_url = req.file.path.split("\\").join("/");
		//Hashing password using md5 before saving in the database
		const hashedPassword = md5(password);
		const newUser = new User({
			bio,
			birthday: new Date(birthday),
			password: hashedPassword,
			first_name,
			last_name,
			email,
		});
		const user = await newUser.save();
		const token = JWTSign({
			id: user.id,
			name: user.first_name + " " + user.last_name,
			email: user.email,
			_id: user._id,
			profilePicture: user.profile_picture_url,
			firstName: user.first_name,
			lastName: user.last_name,
			birthday: user.birthday,
			bio: user.bio,
		});
		return res.status(201).json({
			message: "User created succesfully.",
			token,
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
			name: user.first_name + " " + user.last_name,
			email: user.email,
			_id: user._id,
			profilePicture: user.profile_picture_url,
			firstName: user.first_name,
			lastName: user.last_name,
			birthday: user.birthday,
			bio: user.bio,
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
	const { id } = req.params;
	try {
		const user = await User.findById(id).select("-password");
		if (!user) {
			const error = new Error("User does not exist.");
			error.statusCode = 403;
			throw error;
		}
		const blogs = await Blog.find({ user_id: req.mongoDB_id });

		return res.status(200).json({
			message: "User succesfully retrieved",
			user,
			blogs,
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
	let { firstName, lastName, bio, birthday } = req.body;
	try {
		const user = await User.findById(req.mongoDB_id);
		if (!user) {
			const error = new Error("User does not exist.");
			error.statusCode = 403;
			throw error;
		}
		const email = "dummy@stratpoint.com";
		const exists = await User.findOne({
			$or: [{ email }],
			_id: { $ne: req.mongoDB_id },
		});
		if (exists) {
			const error = new Error("User with that email already exists.");
			error.statusCode = 403;
			throw error;
		}

		user.first_name = firstName;
		user.last_name = lastName;
		user.birthday = birthday;
		user.bio = bio;

		const updatedUser = await user.save();

		console.log(updatedUser);

		const token = JWTSign({
			id: updatedUser.id,
			name: updatedUser.first_name + " " + updatedUser.last_name,
			email: updatedUser.email,
			_id: updatedUser._id,
			profilePicture: updatedUser.profile_picture_url,
			firstName: updatedUser.first_name,
			lastName: updatedUser.last_name,
			birthday: updatedUser.birthday,
			bio: updatedUser.bio,
		});

		return res.status(200).json({
			message: "User updated",
			token,
		});
	} catch (err) {
		next(err);
	}
};
exports.updateProfilePicture = async (req, res, next) => {
	try {
		const profilePicture = req.body.profile_picture_url;
		
		if (!profilePicture) {
			const error = new Error("Picture is required.");
			error.statusCode = 422;
			throw error;
		}

		const uploadedPic = await cloudinary.uploader.upload(
			profilePicture,
		);


		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.mongoDB_id },
			{
				profile_picture_url: uploadedPic.url,
			},
			{ new: true }
		);


		const token = JWTSign({
			id: updatedUser.id,
			name: updatedUser.first_name + " " + updatedUser.last_name,
			email: updatedUser.email,
			_id: updatedUser._id,
			profilePicture: uploadedPic.url,
			firstName: updatedUser.first_name,
			lastName: updatedUser.last_name,
			birthday: updatedUser.birthday,
			bio: updatedUser.bio,
		});


		return res.status(200).json({
			message: "User profile picture saved",
			token,
		});
	} catch (err) {
		console.log(err);
	}
};
