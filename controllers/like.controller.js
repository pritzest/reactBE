const Like = require("../models/likes.model");

exports.getLike = async (req, res, next) => {
	const { blog_id } = req.params;
	try {
		const like = await Like.count({ blogId: blog_id });
		return res.json({ like });
	} catch (err) {
		next(err);
	}
};
exports.postLike = async (req, res, next) => {
	const { blog_id } = req.params;
	const { isLiked } = req.body;
	try {
		if (!isLiked) {
			await Like.updateOne(
				{
					blogId: blog_id,
					userId: req.mongoDB_id,
				},
				{
					userId: req.mongoDB_id,
					blogId: blog_id,
				},
				{ upsert: true }
			);
		} else {
			await Like.deleteOne({ blogId: blog_id, userId: req.mongoDB_id });
		}

		res.json({ message: "Post liked succesfully" });
	} catch (err) {
		next(err);
	}
};
