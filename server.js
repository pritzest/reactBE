const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    console.log("Connected to the MONGODB Database.").catch((e) => {
      console.log(e);
    })
  );

app.listen('5000', () =>{
    console.log('Connected to Port: 5000')
});
