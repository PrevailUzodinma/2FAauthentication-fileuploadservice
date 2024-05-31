const OTP = require("../models/otp.model");

class OtpService {
  async generateOTP() {
    // Generate a 6-digit OTP
    return await Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateAndSaveOTP(userId) {
    const otp = await this.generateOTP();
    const expiresAt = new Date(Date.now() + 300000); // 5 minutes from now

    const newOTP = OTP.create({
      userId,
      otp,
      expiresAt,
    });
    return otp;
  }

  async verifyOTP(userId, otpAttempt) {
    const otpDoc = await OTP.findOne({ userId }).sort({ expiresAt: -1 });

    if (!otpDoc || otpDoc.otp !== otpAttempt) {
      return false; // OTP not found or doesn't match
    }

    if (otpDoc.expiresAt < new Date()) {
      return false; // OTP has expired
    }

    // OTP is valid
    return true;
  }

  // find user by id
  async findUserById(id) {
    try {
      const user = await OTP.findOne({ userId: id });
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user by id");
    }
  }
}

module.exports = new OtpService();
