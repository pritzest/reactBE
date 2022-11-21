const express = require("express");
const app = express();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.router");
const blogRoutes = require("./routes/blog.router");

require("dotenv").config();

app.use(express.json());
app.use('/public', express.static('public'))

app.use(authRoutes);
app.use("/blog", blogRoutes);

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
    console.log("Connected to Database");
    app.listen(`${process.env.PORT}`, () => {
      console.log(`Connected to  PORT:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    throw err;
  });
