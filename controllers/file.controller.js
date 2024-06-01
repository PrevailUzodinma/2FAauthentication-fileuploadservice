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
}

module.exports = new FileController();
