const User = require("../models/user");
const md5 = require("md5");
const JWTSign = require("../utils/jwt-sign");
const { validationResult } = require("express-validator");

//username, password, first_name, last_name, email, profile_picture_url
exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  const {
    username,
    password,
    first_name,
    last_name,
    email,
  } = req.body;
  try {
    const isExisting = await User.findOne({ $or: [{ username }, { email }] });
    //Check if a user already exists either using username or email
    if (isExisting) {
      const error = new Error("User already exists.");
      error.statusCode = 403;
      throw error;
    }
    if (!req.file){
      const error = new Error("Picture is required.");
      error.statusCode = 422;
      throw error;
    }
    const profile_picture_url = req.file.path.split('\\').join('/');
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
    return res.status(422).json({ message: errors.array()[0].msg });
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
      _id: user._id
    });
    return res.status(200).json({
      message: "Login Succesful",
      token,
    });
  } catch (err) {
    next(err);
  }
};
// exports.postSignout = async(req,res,next)=>{
//   req.id = null;
//   return res.status(200).json({
//     message:'Signout Succesful'
//   })
// }
