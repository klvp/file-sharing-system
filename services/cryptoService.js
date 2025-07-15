const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-cbc';

// Demo key management - replace with secure approach
const key = crypto.scryptSync(process.env.ENCRYPTION_PASSWORD, 'salt', 32);
const iv = Buffer.alloc(16, 0);

function encryptFile(inputPath, outputPath, callback) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    input.pipe(cipher).pipe(output).on('finish', callback);
}

function decryptFile(inputPath, outputPath, callback) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    input.pipe(decipher).pipe(output).on('finish', callback);
}

module.exports = { encryptFile, decryptFile };
