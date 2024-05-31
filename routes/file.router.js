const router = require ("express").Router();
const multer = require('multer');
const FileController = require('../controllers/file.controller');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), FileController.uploadFile);

module.exports = router;
