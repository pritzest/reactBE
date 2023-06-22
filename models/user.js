const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
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
		bio: {
			type: String,
			required: true,
		},
		birthday: {
			type: Date,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		profile_picture_url: {
			type: String,
		},
		password_chances: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
