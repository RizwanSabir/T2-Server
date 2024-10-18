const router = require("express").Router();
const { EamilSchema, validate, PasswordResetTokens } = require("../models/Authentication/EamilSchema");
const bcrypt = require("bcrypt");
const emailVerificationTokens = require('../models/Authentication/emailVerificationTokens');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { Brand, Influencer, Auidence } = require('../models/Authentication/BaseSchema');
const LoginToken = require('../models/Authentication/LoginToken')

router.post("/", async (req, res) => {
    try {
       console.log("Request boby in user"+req.body);
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await EamilSchema.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = await new EamilSchema({
            ...req.body
            , password: hashPassword
        }).save();


        switch (req.body.role) {
            case "Brand":
                await new Brand({ userId: user._id }).save();
                break;
            case "Influencer":
                await new Influencer({ userId: user._id }).save();
                break;
            case "User":
                await new Auidence({ userId: user._id }).save();
                break;
            default:
                throw new Error("Invalid role");
        }


        const token = await new emailVerificationTokens({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();

        const url = `${process.env.REACT_APP_BASE_URL}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({ message: `An Email sent to please Verify `,email:user.email });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" + error });
    }
});

router.get('/:id/verify/:token', async (req, res) => {
    try {
        console.log(req.params);
        
        // Find the user by ID
        const user = await EamilSchema.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid user link", check: "" });

        // Check if the user is already verified
        if (user.verified) {
            return res.status(200).send({ message: "Email already verified", check: "already_verified" });
        }

        // Find the token
        const token = await emailVerificationTokens.findOne({
            userId: user._id,
            token: req.params.token
        });

        if (!token) return res.status(400).send({ message: "Invalid token link", check: "" });

        // Update the user's verification status
        await EamilSchema.updateOne({ _id: user._id }, { verified: true });
        // Delete the token
        await emailVerificationTokens.findByIdAndDelete(token._id);
        res.status(200).send({ message: "Email verified successfully", check: "1" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



router.get('/completedProfile/:LoginToken', async (req, res) => {
    try {
        // Extract login token from request parameters
        let tokenvalue = await LoginToken.findOne({ token: req.params.LoginToken });
        if (!tokenvalue) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

        // Fetch the user associated with the login token
        const user = await EamilSchema.findOne({ _id: tokenvalue.userId });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Update profileCompleted to true (1)
        user.profileCompleted = true;
        await user.save();

        
    
        
        // Setting new cookies with appropriate values
        res.cookie("token", tokenvalue.token, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
        res.cookie("pC", user.profileCompleted ? '1' : '0', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
        res.cookie("U", user.role[0], { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });


        // Send success response
        res.status(200).send({ message: "Profile Completed Successfully" });
    } catch (error) {
        console.error("Error during profile completion:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.post("/resend", async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Email is"+email);

        // Find the user by email
        const user = await EamilSchema.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User with given email does not exist!" });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).send({ message: "This email has already been verified." });
        }

        // Generate a new token or reuse existing unexpired token
        let token = await emailVerificationTokens.findOne({ userId: user._id });
        if (!token) {
            token = await new emailVerificationTokens({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();
        }

        // Create verification URL
        const url = `${process.env.REACT_APP_BASE_URL}/users/${user._id}/verify/${token.token}`;
        
        // Send email
        await sendEmail(user.email, "Resend Email Verification", url);

        res.status(200).send({ message: "Verification email has been resent.", email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.post('/reset', async (req, res) => {
    req.body.password="$$098765rizwanR"
    req.body.role='Brand'
    try {
        const { error } = validate(req.body);
        console.log("in reset body");
        console.log(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let user = await EamilSchema.findOne({ email: req.body.email });
        console.log(user);
    
        if (!user)
            return res.status(404).send({ message: "User with given email does not exist!" });

        // Generate a password reset token
        const token = await new PasswordResetTokens({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();

        const url = `${process.env.REACT_APP_BASE_URL}/users/${user._id}/reset-password/${token.token}`;
        await sendEmail(user.email, "Reset Your Password", url);

        res.status(200).send({ message: `Password reset email sent to ${user.email}` });
    } catch (error) {
        console.error("Internal Server Error: ", error); // Improved error logging
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Endpoint to validate the reset token
router.get('/validate-reset-token/:token', async (req, res) => {
   
    const {token}=req.params

    if (!token) {
        return res.status(400).send({ error: 'Token is required.' });
    }

    try {
        // Find the token in the database
        const resetToken = await PasswordResetTokens.findOne({ token });

        if (!resetToken) {
            return res.status(400).send({ valid: false, error: 'Invalid token.' });
        }

       

        // If token is valid and user exists
        res.status(200).send({ valid: true });
    } catch (err) {
        console.error('Error validating token:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});





router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ error: 'Token and new password are required.' });
    }

    try {
        // Find the reset token in the database
        const resetToken = await PasswordResetTokens.findOne({ token });

        if (!resetToken) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        // Find the user associated with the token
        const user = await EamilSchema.findById(resetToken.userId);

        if (!user) {
            return res.status(400).send({ message: 'User not found.' });
        }

        // Set and hash the new password
        await user.setPassword(newPassword);
        await user.save();

        // Remove the used token from the database
        await PasswordResetTokens.deleteOne({ token });

        res.status(200).send({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;
