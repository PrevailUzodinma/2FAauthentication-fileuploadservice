const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");

const UPLOAD_FOLDER = "./uploads/";
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "gif"];

class FileService {

  allowedFile(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext.substring(1));
  }

  async saveFileToUser(user, file) {
    const imgData = fs.readFileSync(file.path);
    const base64Data = imgData.toString("base64");
    const contentType = file.mimetype;

    user.images.push({
      filename: file.originalname,
      data: base64Data,
      contentType: contentType,
    });

    await user.save();

    // Delete file from filesystem
    fs.unlinkSync(file.path);
  }
}

module.exports = new FileService();
