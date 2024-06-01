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

  async findtoverifyOTP(userId) {
    try {
      const otpDoc = await OTP.findOne({ userId }).sort({ expiresAt: -1 });
      return otpDoc;
    } catch (error) {
      throw new Error("error occured while verifying otp");
    }
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

  async deleteOtp(id){
    try {
        return await OTP.deleteOne({ _id: id });
      } catch (error) {
        throw new Error("error deleting otp");
      }
    }
  }


module.exports = new OtpService();
