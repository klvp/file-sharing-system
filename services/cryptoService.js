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
    let called = false;
    function done(err) {
        if (!called) {
            called = true;
            callback(err);
        }
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.on('error', done);
    output.on('error', done);
    decipher.on('error', done);
    output.on('finish', () => done(null));

    input.pipe(decipher).pipe(output);
}

function getFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

module.exports = { encryptFile, decryptFile, getFileHash };
