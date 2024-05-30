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

  async confirm(res, req) {
    try {
      // retrieve id from request parameter
      const { id } = req.params;

      // find user that has that id in the database
      const existingUser = UserService.findUserById(id);

      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "Oops! Not Found. User does not exist",
        });
      }
      existingUser.confirmed = true;
      res.status(200).json({
        success: true,
        message:
          "Congratulations! Your email has been confirmed, you may proceed to login",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new UserController();
