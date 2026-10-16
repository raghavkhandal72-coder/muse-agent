'use strict';

const crypto = require('node:crypto');

class Processor {
  static hash(content) {
    if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
      throw new TypeError('Content to hash must be a string or Buffer');
    }
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  static encrypt(plaintext, secretKey) {
    if (typeof plaintext !== 'string' || plaintext.length === 0) {
      throw new TypeError('Plaintext must be a non-empty string');
    }
    if (typeof secretKey !== 'string' || secretKey.length === 0) {
      throw new TypeError('Secret key must be a non-empty string');
    }
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv, { authTagLength: 16 });

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      tag: authTag
    };
  }

  static decrypt(encryptedPayload, secretKey) {
    if (!encryptedPayload || typeof encryptedPayload !== 'object') {
      throw new Error('Encrypted payload must be a valid object');
    }
    const { ciphertext, iv, tag } = encryptedPayload;
    if (typeof ciphertext !== 'string' || !iv || !tag) {
      throw new Error('Encrypted payload must contain ciphertext, iv, and tag');
    }
    if (typeof secretKey !== 'string' || secretKey.length === 0) {
      throw new TypeError('Secret key must be a non-empty string');
    }

    const ivBuf = Buffer.from(iv, 'hex');
    const tagBuf = Buffer.from(tag, 'hex');
    if (ivBuf.length !== 12) {
      throw new Error('Invalid IV length: AES-256-GCM requires a 12-byte (24 hex chars) IV');
    }
    if (tagBuf.length !== 16) {
      throw new Error('Invalid authentication tag length: AES-256-GCM requires a 16-byte (32 hex chars) tag');
    }

    const key = crypto.createHash('sha256').update(secretKey).digest();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuf, { authTagLength: 16 });
    decipher.setAuthTag(tagBuf);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = Processor;
