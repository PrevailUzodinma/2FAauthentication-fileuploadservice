const FileService = require("../services/file.service");

class FileController {
  async uploadFile(req, res) {
    const user = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file part" });
    }

    if (!FileService.allowedFile(file)) {
      return res.status(400).json({ error: "File type not allowed" });
    }

    await FileService.saveFileToUser(user, file);

    res.status(200).json({
      success: true,
      message: "File successfully uploaded and stored",
    });
  }

  // Fetch all uploaded files
  async getAllFiles(req, res) {
    try {
      // Find all users with their uploaded images
      const users = await User.find({ images: { $exists: true, $ne: [] } });

      // Collect all images from all users
      const allImages = users.reduce((images, user) => {
        if (user.images && user.images.length > 0) {
          user.images.forEach((image) => {
            images.push({
              userId: user._id,
              filename: image.filename,
              data: image.data,
              contentType: image.contentType,
            });
          });
        }
        return images;
      }, []);

      res.status(200).json({
        success: true,
        message: "Successfully fetched all images",
        data: allImages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch images",
        error: error.message,
      });
    }
  }
}

module.exports = new FileController();
