const router = require ("express").Router();
const multer = require('multer');
const validateApiKey = require("../middlewares/validateApikey.middleware")
const FileController = require('../controllers/file.controller');
const upload = require('../config/multer.config'); // Import the Multer configuration

router.post('/upload', upload.single('file'), validateApiKey, FileController.uploadFile);

module.exports = router;
