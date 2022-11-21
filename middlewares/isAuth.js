const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  try {
    if (!token) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
    req.id = decodedToken.id;
    req.mongoDB_id = decodedToken._id;
    next();
  } catch (err) {
    next(err);
  }
};
