const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // to store APIkey generated during registration
  apikey: {
    type: String,
    required: true,
    unique: true,
  },
  // to track the confirmation status of a user
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
