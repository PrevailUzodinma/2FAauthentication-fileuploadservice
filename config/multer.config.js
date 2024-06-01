
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Define the upload folder path
const UPLOAD_FOLDER = path.join(__dirname, '..', 'uploads');

// Ensure the upload folder exists
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;