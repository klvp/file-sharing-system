const path = require('path');
const fs = require('fs');
const {
    encryptFile,
    decryptFile
} = require('../services/cryptoService');

exports.handleFileUpload = (req, res) => {
    try {
        const tempPath = req.file.path;
        const encryptedPath = path.join('uploads', req.file.filename + '.enc');

        encryptFile(tempPath, encryptedPath, () => {
            fs.unlinkSync(tempPath); // delete original
            res.status(200).json({ message: 'File uploaded and encrypted', filename: req.file.filename + '.enc' });
        });
    } catch (error) {
        console.error(error)
        res.json({ message: error.message })
    }
};

exports.handleFileDownload = (req, res) => {
    try {
        const encryptedPath = path.join('uploads', req.params.filename);
        const decryptedPath = path.join('decrypted', req.params.filename.replace('.enc', ''));

        decryptFile(encryptedPath, decryptedPath, () => {
            res.download(decryptedPath, err => {
                if (err) console.error(err);
                fs.unlinkSync(decryptedPath); // clean up
            });
        });
    } catch (error) {
        console.error(error)
        res.json({ message: error.message })
    }
};
