require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const CustomerService = require("./routes/Support/Support");
const BrandSignUp = require("./Api/Brand/SignUp");
const InfluencerSignUp = require("./Api/Influencer/SignUp");
const AuidenceSignUp = require("./Api/Auidence/SignUp");
const mongoose = require("mongoose");
const { Brand, Influencer } = require("./models/Authentication/BaseSchema");
const { authenticateToken } = require("./middleware/authTokenVerification");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

// middlewares
app.use(express.json());

const allowedOrigins = [
  'http://influencerharbor.live',
  'http://13.49.254.91',
  'http://localhost'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use('/api/users/Brand/CompleteProfile', BrandSignUp)
app.use('/api/users/Influnencer/CompleteProfile', InfluencerSignUp)
app.use('/api/users/Auidence/CompleteProfile', AuidenceSignUp)




// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


app.use('/CustomerService',CustomerService)


app.get('/status', (req, res) => {
  res.send('Server is running correctly');
});

// database connection and server start
connection()
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
  });
