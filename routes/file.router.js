const router = require ("express").Router();
const multer = require('multer');
const validateApiKey = require("../middlewares/validateApikey.middleware")
const FileController = require('../controllers/file.controller');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), validateApiKey, FileController.uploadFile);

module.exports = router;
