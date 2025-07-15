const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    handleFileUpload,
    handleFileDownload
} = require('../controllers/fileController');

const storage = multer.diskStorage({
    destination: 'temp/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), handleFileUpload);
router.get('/download/:filename', handleFileDownload);

module.exports = router;
