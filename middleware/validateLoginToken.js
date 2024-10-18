const { EamilSchema } = require("../models/Authentication/EamilSchema");
const LoginToken = require("../models/Authentication/LoginToken");

const authenticate = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send("Access denied");
  
    // Check if the token exists in the LoginToken collection
    const loginToken = await LoginToken.findOne({ token });
    if (!loginToken) return res.status(401).send("Invalid token");
  
    // Attach user info to the request
    req.user = await EamilSchema.findById(loginToken.userId);
    if (!req.user) return res.status(401).send("User not found");
  
    next();
  };
  
  module.exports = authenticate;
  