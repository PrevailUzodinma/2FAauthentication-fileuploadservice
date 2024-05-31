const UserService = require("../services/user.service");
const sendEmail = require("../utils/email");
const OtpService = require("../services/otp.service");
const bcrypt = require("bcryptjs");

class UserController {
  async register(req, res) {
    try {
      // extract user details from request body
      const { email, password } = req.body;
      // create new user
      const newUser = await UserService.register(email, password);

      // send a confirmation email

      const confirmationLink = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/confirm/${newUser._id}`;
      const message = `Please confirm your email by clicking the following link: \n \n ${confirmationLink} \n \nBest Regards,\nKryptonia Support`;
      await sendEmail({
        email: newUser.email,
        subject: `Email Confirmation`,
        message: message,
      });

      res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email to confirm.",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async confirm(req, res) {
    try {
      // Retrieve id from request parameters
      const { id } = req.params;

      // Find user by id in the database
      const existingUser = await UserService.findUserById(id);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "Oops! Not Found. User does not exist",
        });
      }

      // Confirm user
      existingUser.confirmed = true;
      await existingUser.save();

      // Send success response
      res.status(200).json({
        success: true,
        message:
          "Congratulations! Your email has been confirmed, you may proceed to login",
      });
    } catch (error) {
      // Handle errors
      res.status(500).send(error.message);
    }
  }

  async login(req, res) {
    try {
      // retrieve email and password from request body
      const { email, password } = req.body;

      // check if user exists and if email is confirmed
      const existingUser = await UserService.findUserByEmail(email);

      if (!existingUser) {
        return res.status(404).json({ message: "User does not exist" });
      } else if (existingUser.confirmed === false) {
        return res.status(400).json({
          message:
            "User email has not been confirmed, please confirm your email before logging in",
        });
      }
      // take user password and compare to entered password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      // Check if a valid OTP already exists for the user (within time frame)
      const existingOTP = await OtpService.findUserById(existingUser._id);

      if (existingOTP) {
        const now = new Date();
        const expiryTime = existingOTP.expiresAt;

        if (now < expiryTime) {
          return res.status(400).json({
            message: "OTP already sent. Please check your email for OTP",
          });
        }
      }
      // No valid OTP found, generate OTP and save it in the DB
      const otp = await OtpService.generateAndSaveOTP(existingUser._id);

      // Send OTP to user's email
      await sendEmail({
        email: existingUser.email,
        subject: `Your OTP Code`,
        message: `Your OTP code is: ${otp}. It will expire in 5 minutes. \n \nBest Regards,\nKryptonia Support`,
      });

      // create and send temporary token, to carry userId in the payload, for use during OTP Validation.
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );
      // Set token as cookie
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        success: "true",
        message: "OTP sent to your email",
        token,
      });
    } catch (error) {
      // Handle errors
      res.status(500).send(error.message);
    }
  }

  async verifyOtp(req, res) {
    try {
      // retrieve userId and otp from req.user and req.body respectively
      const { userId } = req.user;
      const { otp } = req.body;

      // verify OTP
      const otpDoc = await OtpService.findtoverifyOTP(userId);

      // if no OTP found
      if (!otpDoc) {
        return res
          .status(400)
          .json({ message: "OTP not found or has expired" });
      }
      // if OTP does not match
      if (otpDoc.otp !== otp) {
        return res.status(401).json({ message: "Invalid OTP" });
      }
      // if OTP has expired
      if (otpDoc.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // delete otp from database
      await OtpService.deleteOtp(otpDoc._id);

      // create a login token
      const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Set token as cookie
      res.cookie("token", token, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: "OTP verified, login successful",
        token,
      });
    } catch (error) {}
  }

  async fetchAll(req, res) {
    try {
      const fetchedUsers = await UserService.fetch({});

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: fetchedUsers,
      });
    } catch (error) {
      // Handle errors
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      //Check if the user to delete is in the database
      const existingUser = await UserService.findUserById(userId);
      if (!existingUser) {
        return res.status(403).json({
          success: false,
          message: "User to delete does not exist",
        });
      }

      const deletedUser = await UserService.delete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      // Handle errors
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new UserController();
