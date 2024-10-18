const router = require("express").Router();
const mongoose = require("mongoose");
const { Brand } = require("../../models/Authentication/BaseSchema");
const multer = require("multer");
const { authenticateToken } = require("../../middleware/authTokenVerification");
const path = require('path');
const fs = require('fs');
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




router.post('/create-brand', authenticateToken, upload.single('image'), async (req, res) => {
  console.log(req.body.companyDetails);
  const basicDetails = JSON.parse(req.body.basicDetails);
  const companyDetails = JSON.parse(req.body.companyDetails);
  try {

    const updatedBrand = await Brand.findOneAndUpdate(
      { userId: req.user._id }, // Filter by userId
      {
        brandName: companyDetails.brandName,
        basicDetails: basicDetails,  // Use the parsed object here
        companyDetails: companyDetails,  // Use the parsed object here
        imageUrl: req.file ? req.file.path : null,
      }, // Update fields
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const ObjectId = mongoose.Types.ObjectId;
    const userId = ObjectId(req.user._id);
    
    // Update the Email collection's CompleteProfile field
    const emailUpdate = await EamilSchema.findOneAndUpdate(
      { _id: userId  }, // Filter by userId
      {
        profileCompleted: true
      }, // Set CompleteProfile to true
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    if (!emailUpdate) {
      return res.status(404).json({ message: 'Email record not found' });
    }
  
    const profileCompleted = emailUpdate.profileCompleted;
    console.log("profile Completed is "+ profileCompleted); // Assuming you want to use the updated value
    res.cookie("pC", profileCompleted ? '1' : '0', {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: 'strict'
    });




    res.status(201).json({ message: 'Brand created successfully' });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
});


router.post('/check-brandName', async (req, res) => {
  const { brandName } = req.body;

  try {
    // Check if the brand name exists in the database
    const brand = await Brand.findOne({ brandName });
    if (brand) {
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