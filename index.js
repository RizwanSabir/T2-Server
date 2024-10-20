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
const { User, UserSupport, Issue } = require("./models/Support/Issues");

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


app.use('/Support',CustomerService)



// Route to handle deleting rows
app.post('/DeleteRow', async (req, res) => {
  try {
    const rowsToDelete = req.body; // Get rows to delete from the request body
 console.log(rowsToDelete)


    res.status(200).send({ message: 'Rows deleted successfully' });
  } catch (error) {
    console.error("Error deleting rows:", error);
    res.status(500).send({ message: 'Error deleting rows' });
  }
});
app.get('/status', (req, res) => {
  res.send('Server is running correctly');
});




// POST route to add a new user
app.post('/addUser', async (req, res) => {
  const { name, username, img } = req.body;

  console.log("new user sare")
console.log(req.body)


  // Validate required fields
  if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required.' });
  }
 
  try {
      // Create and save the new user
      const newUser = new UserSupport({
          name,
          username,
          img,  // img can be optional
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
      if (error.code === 11000) {  // Duplicate key error for unique fields
          res.status(409).json({ error: 'Username already exists.' });
      } else {
          res.status(500).json({ error: 'An error occurred while creating the user.' });
      }
  }
});



app.post('/addIssue', async (req, res) => {
  try {
      const { customerServiceID, userId, issue, description, status, attachment, contractLink } = req.body;

      // Create new issue
      const newIssue = new Issue({
          userId, 
          issue, 
          description, 
          status, 
          attachment, 
          contractLink
      });

      // Save to the database
      await newIssue.save();
      res.status(201).json({ message: 'Issue created successfully', issue: newIssue });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
  }
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
