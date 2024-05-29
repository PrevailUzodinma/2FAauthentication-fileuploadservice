const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class UserService {
  async createUser(email, password, apiKey) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedpassword = await bcrypt.hash(password, salt);
      apiKey = uuidv4();
      const newUser = await User.create({
        email,
        password: hashedpassword,
        apiKey,
      });
      return newUser;
    } catch (error) {
      throw new Error("error occured while creating user");
    }
  }
}
