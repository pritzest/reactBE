const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.router");
const blogRoutes = require("./routes/blog.router");
const commentRoutes = require("./routes/comments.router");
const likesRoutes = require("./routes/likes.router");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

app.use(authRoutes);
app.use("/blog", blogRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likesRoutes);

app.use((err, req, res, next) => {
	let { statusCode, message } = err;
	statusCode = statusCode || 500;
	return res.status(statusCode).json({
		message,
	});
});

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		console.log("Connected to Databasehaha");
		app.listen(process.env.PORT || 8000, () => {
			console.log(`Connected to  PORT:${process.env.PORT}`);
		});
	})
	.catch((err) => {
		throw err;
	});
