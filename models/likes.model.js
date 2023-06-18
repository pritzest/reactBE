const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
	userId: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	blogId: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "Blog",
	},
});

module.exports = mongoose.model("Like", likeSchema);
