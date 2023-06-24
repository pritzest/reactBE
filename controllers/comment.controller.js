const Comment = require("../models/comments.model");

exports.getComment = async (req, res, next) => {
	const { blog_id } = req.params;
	try {
		const comments = await Comment.find({ blogId: blog_id });
		return res.json({ comments });
	} catch (err) {
		next(err);
	}
};
exports.postComment = async (req, res, next) => {
	const { blog_id } = req.params;
	const { description } = req.body;
	try {
		const comment = await Comment.create({
			userId: req.mongoDB_id,
			blogId: blog_id,
			description,
		});

		const newComment = await comment.populate("userId");
		console.log(newComment);
		res.json({ comment: newComment });
	} catch (err) {
		next(err);
	}
};
