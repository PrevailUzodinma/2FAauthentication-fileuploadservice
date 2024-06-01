const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: String, required: true },
  contentType: { type: String, required: true },
});

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
