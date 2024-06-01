const FileService = require("../services/file.service");
const UserService = require("../services/user.service");


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
      const users = await UserService.fetch({ images: { $exists: true, $ne: [] } });

      // Collect all images from all users
      const allImages = users.reduce((images, user) => {
        if (user.images && user.images.length > 0) {
          user.images.forEach((image) => {
            images.push({
              id: image._id,
              filename: image.filename,
              imageData: image.data,
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

  // Fetch a single uploaded file by its filename
  async getFileById(req, res) {
    try {
      const { id } = req.params;

      // Find user by id
      const user = await UserService.findBy({ "images._id": id });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      // Find the specific image
      const image = user.images.id(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Image fetched successfully",
        data: image,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch the image",
        error: error.message,
      });
    }
  }
}

module.exports = new FileController();
