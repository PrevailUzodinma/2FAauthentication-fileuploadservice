const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class UserService {
  async register(email, password) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedpassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        email,
        password: hashedpassword,
      });
      return newUser;
    } catch (error) {
      throw new Error("Error occured while creating user in database");
    }
  }

  async findUserById(id) {
    try {
      const user = await User.findById({ _id: id });
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user by id");
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("error occured while deleting this user");
    }
  }
}

module.exports = new UserService();
