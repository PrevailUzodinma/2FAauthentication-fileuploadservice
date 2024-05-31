const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL index with 5 minutes expiration
  },
  expiresAt: {
    type: Date,
    expires: 300, // TTL index for automatic expiration after 5 minutes
    default: Date.now() + 300000, // 5 minutes from now
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
