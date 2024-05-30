const UserService = require("../services/user.service");
const sendTransactionalEmails = require("../utils/email");

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
      await sendEmail(email, confirmationLink);
      res.status(201).send("Registration successful! Please check your email to confirm.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new UserController();