const fs = require("fs");
const path = require("path");

// An array of allowed file extensions for uploaded files.
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "gif"];

class FileService {
  allowedFile(file) {
    // Extract the file extension from the original file name using path.extname.
    const ext = path.extname(file.originalname).toLowerCase(); // Convert the extension to lowercase to ensure case-insensitive comparison.
    // Check if the extracted extension (without the dot) is included in the ALLOWED_EXTENSIONS array.
    return ALLOWED_EXTENSIONS.includes(ext.substring(1));
  }

  async saveFileToUser(user, file) {
    try {
      // Read the file from the temporary storage location using fs.readFileSync.
      const imgData = fs.readFileSync(file.path);
      // Convert the file data to a Base64 encoded string using imgData.toString('base64').
      const base64Data = imgData.toString("base64");
      // Retrieve the MIME type of the file from file.mimetype.
      const contentType = file.mimetype;
      // Add an object to the user's images array containing file name, data and content type
      user.images.push({
        filename: file.originalname,
        data: base64Data,
        contentType: contentType,
      });

      // Save the updated user document to the database
      await user.save();

      // Deletes the file from the upload folder: the temporary storage location (filesystem)
      fs.unlinkSync(file.path);
      console.log("File deleted successfully");
    } catch (error) {
      // Handle errors during file deletion
      console.error("Error deleting file:", error);
    }
  }
}

module.exports = new FileService();
