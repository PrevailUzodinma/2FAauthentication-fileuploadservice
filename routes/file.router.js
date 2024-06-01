const router = require ("express").Router();
const multer = require('multer');
const verifyApikey = require("../middlewares/verifyApikey.middleware")
const FileController = require('../controllers/file.controller');
const upload = require('../config/multer.config'); // Import the Multer configuration

// Route to upload file
router.post('/upload', verifyApikey, upload.single('file'), FileController.uploadFile);

// Route to get all files
router.get("/", FileController.getAllFiles);

// Route to get a single file by its id
router.get("/:id", FileController.getFileById);

module.exports = router;
