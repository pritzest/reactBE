const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile_picture_url: {
      type: String,
      required:true
    },
    password_chances: {
      type: Number,
      default: 0,
    },
    deleted_at: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
