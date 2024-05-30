const UserService = require("../services/user.service");
const redisClient = require("../config/redis.config")
const sendEmail = require("../utils/email");
const generateOtp = require("../services/otp.service")

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
      const message = `Please confirm your email by clicking the following link: \n \n ${confirmationLink}`;
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
        return res
          .status(400)
          .json({
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

      // Generate OTP and save it in Redis with a 5-minute expiration
      const otp = generateOtp();
      await redisClient.setex(`otp:${existingUser._id}`, 300, otp); // 300 seconds = 5 minutes

       // Send OTP to user's email
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error occurred while login", error: error });
    }
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
      console.error("Error creating user:", error);
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
      const existingUser = await UserService.findUserById({
        _id: userId,
      });
      if (!existingUser) {
        res.status(403).json({
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
      console.error("Error creating user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new UserController();
