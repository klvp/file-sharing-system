const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');
const {
    handleFileUpload,
    handleFileDownload
} = require('../controllers/fileController');

// Storage config
const storage = multer.diskStorage({
    destination: 'temp/',
    filename: (req, file, cb) => {
        cb(null, sanitize(file.originalname));
    }
});

// File type filter
function fileFilter(req, file, cb) {
    const allowedTypes = ['.pdf', '.txt', '.png', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, TXT, JPG and PNG files are allowed'), false);
    }
}

// Final multer config
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5 MB
    },
    fileFilter
});

router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        next();
    });
}, handleFileUpload);
router.get('/download/:filename', handleFileDownload);

module.exports = router;
