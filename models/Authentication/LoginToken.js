const mongoose = require("mongoose");

const loginTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // TTL index for expiration
});

const LoginToken = mongoose.model("LoginToken", loginTokenSchema);

module.exports = LoginToken;
