const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { authenticateToken } = require("../../middleware/authTokenVerification");
const path = require('path');
const fs = require('fs');
const { Influencer } = require("../../models/Authentication/BaseSchema");
const { EamilSchema } = require("../../models/Authentication/EamilSchema");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Store files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    },
  });

  const upload = multer({ storage })



  router.post('/submitData', authenticateToken,upload.single('image'), async (req, res) => {
    try {
      // Extract form data
      const { fullName, userName, gender, age, category } = req.body;
      console.log({...req.body});
  
      const updatedBrand = await Influencer.findOneAndUpdate(
        { userId:req.user._id }, // Filter by userId
        { 
          fullName:fullName,
           userName:userName,
            gender:gender,
             age:age,
              category:category,
              imageUrl: req.file ? req.file.path : null,
         }, // Update fields
        { new: true, runValidators: true } // Options: return the updated document and run validators
      );
  
    
      if (!updatedBrand) {
        return res.status(404).json({ message: 'Influncer not sucessfull' });
      }
      console.log("user id is "+req.user._id);
      const ObjectId = mongoose.Types.ObjectId;
      const userId = ObjectId(req.user._id);
      
      const emailUpdate = await EamilSchema.findOneAndUpdate(
        { _id: userId }, // Filter by userId
        {
          profileCompleted: true
        }, // Set CompleteProfile to true
        { new: true, runValidators: true } // Options: return the updated document and run validators
      );
      console.log("Email update is "+emailUpdate);
  
      if (!emailUpdate) {
        return res.status(404).json({ message: 'Email record not found' });
      }
    
      const profileCompleted = emailUpdate.profileCompleted;
      console.log("profile Completed is "+ profileCompleted); // Assuming you want to use the updated value
      res.cookie("pC", profileCompleted ? '1' : '0', {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        sameSite: 'strict'
      });
  
  
      res.status(201).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


router.post('/check-InfluencerName', async (req, res) => {
    const { userName } = req.body;
    console.log('userName is'+userName);
  
    try {
      // Check if the brand name exists in the database
      const user = await Influencer.findOne({ userName });

      if (user) {
        // Brand name exists
        return res.status(200).json({ exists: true });
      } else {
        // Brand name does not exist
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking brand name:', error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
  });


  module.exports = router;