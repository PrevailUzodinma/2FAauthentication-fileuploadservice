const mongoose = require("mongoose");
const imageSchema = require("./image.model");

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
  apikey: String,
  // to track the confirmation status of a user
  confirmed: {
    type: Boolean,
    default: false,
  },
  images: [imageSchema],
  // modifying my user.js model to include an apiKeyInvalidated field.
  apiKeyInvalidated: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
