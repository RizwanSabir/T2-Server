
const jwt = require('jsonwebtoken'); 
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      console.log("user us ");
      console.log({...user});
      req.body.user = {...user};
      req.user=user
      next();
    });
  };


  module.exports ={authenticateToken}