const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		userId: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		description: {
			type: String,
			required: true,
		},
		blogId: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: "Blog",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Comment", commentSchema);
