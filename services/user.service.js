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
  // find user by id
  async findUserById(id) {
    try {
      const user = await User.findById({ _id: id });
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user by id");
    }
  }
  // find user by email
  async findUserByEmail(userEmail) {
    try {
      const user = await User.findOne({ email: userEmail });
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user by email");
    }
  }
  // find user by any query
  async findBy(query) {
    try {
      const user = await User.findOne(query);
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user");
    }
  }

  // find user by apikey
  async findUserByApikey(apikey) {
    try {
      const user = await User.findOne({ apikey: apikey });
      return user;
    } catch (error) {
      throw new Error("error occured while finding a user by apikey");
    }
  }

  // fetch all users
  async fetch(filter) {
    try {
      return await User.find(filter);
    } catch (error) {
      throw new Error("error occured while fetching users");
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
