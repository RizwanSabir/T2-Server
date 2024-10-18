const router = require("express").Router();
const { EamilSchema } = require("../models/Authentication/EamilSchema");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token =require('../models/Authentication/emailVerificationTokens')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto');
const LoginToken = require("../models/Authentication/LoginToken");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		
		const user = await EamilSchema.findOne({ email: req.body.email ,role:req.body.role});
		console.log("request body is :");
		console.log(req.body);
		console.log(user);
		if (!user)
			return res.status(401).send({ message: "Invalid Email, Password or Role" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);

		
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });
		
		if(!user.verified){
			let token =await Token.findOne({userId:user._id})

			if(!token){
				 token=await new Token({
					userId:user._id,
					token:crypto.randomBytes(32).toString('hex')
		
				}).save()
				const url=`${process.env.REACT_APP_BASE_URL}/users/${user._id}/verify/${token.token}`
				await sendEmail(user.email,"Verify Email",url)
				return res.status(400).send({message:"Email is sent to your email. Please Verify"})
			}

			return res.status(400).send({message:"Email was sent to your email. Please Verify"})
		}
		


		let loginToken = await LoginToken.findOne({ userId: user._id });
		if (loginToken) {
			// Token exists, send the existing token as a cookie
			res.cookie("token", loginToken.token, {  maxAge: 7 * 24 * 60 * 60 * 1000 ,sameSite: 'strict',});
			res.cookie("pC", user.profileCompleted ? '1' : '0', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
			res.cookie("U",user.role[0] , { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });

			return res.status(200).send({ data: loginToken.token, message: "Logged in successfully" });
		  }

		  const token = user.generateAuthToken();
		  loginToken = await LoginToken.create({ token, userId: user._id });
		
		  // Send the new token as a cookie
		  res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict',  });
		  res.cookie("pC", user.profileCompleted ? '1' : '0', {  maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
		  res.cookie("U",user.role[0] , {  maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });
 
		  res.status(200).send({ data: loginToken.token, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
		role: Joi.string().valid("Brand", "User", "Influencer").required().label("Role"),
	});
	return schema.validate(data);
};

module.exports = router;
