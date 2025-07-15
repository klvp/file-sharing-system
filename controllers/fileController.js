const path = require('path');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const {
    encryptFile,
    decryptFile,
    getFileHash,
} = require('../services/cryptoService');

exports.handleFileUpload = (req, res) => {
    try {
        const tempPath = req.file.path;
        const encryptedPath = path.join('uploads', req.file.filename + '.enc');

        encryptFile(tempPath, encryptedPath, async () => {
            const fileHash = await getFileHash(tempPath);
            console.log("🚀 ~ encryptFile ~ fileHash:", fileHash)
            fs.unlinkSync(tempPath); // delete original
            res.status(200).json({
                message: 'File uploaded and encrypted',
                filename: req.file.filename + '.enc',
                fileHash: fileHash,
            });
        });
    } catch (error) {
        console.error(error)
        res.json({ message: error.message })
    }
};

exports.handleFileDownload = (req, res) => {
    try {
        const encryptedPath = path.join('uploads', req.params.filename + '.enc');
        const decryptedPath = path.join('decrypted', req.params.filename.replace('.enc', ''));

        decryptFile(encryptedPath, decryptedPath, () => {
            res.download(decryptedPath, async err => {
                if (err) {
                    console.error(err);
                    res.json({ message: err.message })
                };
                const fileHash = await getFileHash(decryptedPath);
                console.log("🚀 ~ decryptFile ~ fileHash:", fileHash)
                fs.unlinkSync(decryptedPath); // clean up
            });
        });
    } catch (error) {
        console.error(error)
        res.json({ message: error.message })
    }
};
