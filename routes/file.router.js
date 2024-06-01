const router = require ("express").Router();
const multer = require('multer');
const verifyApikey = require("../middlewares/verifyApikey.middleware")
const FileController = require('../controllers/file.controller');
const upload = require('../config/multer.config'); // Import the Multer configuration

router.post('/upload', upload.single('file'), verifyApikey, FileController.uploadFile);

module.exports = router;
