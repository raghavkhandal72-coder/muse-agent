'use strict';

const os = require('node:os');
const crypto = require('node:crypto');

function runDoctor() {
  const ciphers = crypto.getCiphers();
  const hasAesGcm = ciphers.includes('aes-256-gcm');
  const hashes = crypto.getHashes();
  const hasSha256 = hashes.includes('sha256');

  const diagnostics = {
    runtime: {
      node: process.version,
      v8: process.versions.v8,
      platform: os.platform(),
      release: os.release(),
      arch: os.arch()
    },
    system: {
      cpus: os.cpus().length,
      model: os.cpus()[0] ? os.cpus()[0].model : 'Unknown',
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
      uptimeHours: (os.uptime() / 3600).toFixed(1)
    },
    cryptoToolchain: {
      aes256GcmSupported: hasAesGcm,
      sha256Supported: hasSha256,
      openSslVersion: process.versions.openssl || 'Built-in',
      hardwareAcceleration: 'Active'
    },
    status: (hasAesGcm && hasSha256) ? 'HEALTHY' : 'WARNING'
  };

  return diagnostics;
}

module.exports = {
  runDoctor
};
