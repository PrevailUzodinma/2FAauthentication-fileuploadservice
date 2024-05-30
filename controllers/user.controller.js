const UserService = require("../services/user.service");
const sendEmail = require("../utils/email");

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
        message: "Congratulations! Your email has been confirmed, you may proceed to login",
      });
    } catch (error) {
      // Handle errors
      res.status(500).send(error.message);
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
