#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Dynamically locate index and rea-inspector whether installed flat or nested
let indexMod;
const tryPathsIndex = [
  path.join(__dirname, '../src/index'),
  path.join(__dirname, '../../src/index'),
  path.join(__dirname, '../src/index.js'),
  path.join(__dirname, '../../src/index.js')
];
for (const p of tryPathsIndex) {
  try {
    indexMod = require(p);
    break;
  } catch (e) {}
}
if (!indexMod) {
  console.error('[Error] Could not locate src/index.js');
  process.exit(1);
}

const { Validator, Processor, Store, version } = indexMod;

let BinaryInspector, AppInspector, runDoctor;
const tryPathsInspector = [
  path.join(__dirname, '../../rea-inspector/lib/binary_inspector'),
  path.join(__dirname, '../rea-inspector/lib/binary_inspector')
];
for (const p of tryPathsInspector) {
  try {
    BinaryInspector = require(p);
    AppInspector = require(path.join(path.dirname(p), 'app_inspector'));
    const runner = require(path.join(path.dirname(p), 'rea_runner'));
    runDoctor = runner.runDoctor;
    break;
  } catch (e) {}
}

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
===========================================================
  Muse / REA App CLI v${version}
===========================================================
Usage:
  app hash <text>                           - Generate SHA-256 hash
  app sanitize <string>                     - Sanitize HTML/special chars
  app encrypt <text> <key>                  - Encrypt text with AES-256-GCM (12B IV, 16B Tag)
  app decrypt <jsonPayload> <key>           - Decrypt JSON payload with key
  app store-test                            - Run live store test with SHA-256 hash-chained audit trail
  app inspect [file-or-dir]                 - Inspect binary (.exe/ELF/Mach-O/APK) or package Evidence-v2.0
  app doctor                                - Run REA System & Toolchain Doctor diagnostics
  app version                               - Show application version
===========================================================
`);
}

switch (command) {
  case 'hash': {
    const text = args.slice(1).join(' ');
    if (!text) {
      console.error('[Error] Missing text to hash. Example: app hash "Hello Muse"');
      process.exit(1);
    }
    const digest = Processor.hash(text);
    console.log(`[SHA-256 Digest]: ${digest}`);
    break;
  }

  case 'sanitize': {
    const text = args.slice(1).join(' ');
    if (!text) {
      console.error('[Error] Missing string to sanitize. Example: app sanitize "<script>alert(1)</script>"');
      process.exit(1);
    }
    const sanitized = Validator.sanitize(text);
    console.log(`[Sanitized Output]: ${sanitized}`);
    break;
  }

  case 'encrypt': {
    const text = args[1];
    const key = args[2];
    if (!text || !key) {
      console.error('[Error] Usage: app encrypt <text> <key>');
      process.exit(1);
    }
    const result = Processor.encrypt(text, key);
    console.log('[AES-256-GCM Encrypted Payload]:');
    console.log(JSON.stringify(result, null, 2));
    break;
  }

  case 'decrypt': {
    const payloadArg = args[1];
    const key = args[2];
    if (!payloadArg || !key) {
      console.error('[Error] Usage: app decrypt <jsonPayload> <key>');
      process.exit(1);
    }
    try {
      const payload = JSON.parse(payloadArg);
      const plaintext = Processor.decrypt(payload, key);
      console.log(`[Decrypted Plaintext]: ${plaintext}`);
    } catch (e) {
      console.error(`[Decryption Failed]: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  case 'store-test': {
    console.log('--- Initializing Hash-Chained Audited Store ---');
    const store = new Store();
    store.set('user:001', { name: 'Raghav', role: 'Architect' });
    store.set('meta:session', { active: true, channel: 'Muse-V2' });
    store.set('crypto:policy', { cipher: 'aes-256-gcm', ivLen: 12, tagLen: 16 });
    store.delete('meta:session');

    console.log(`Store items count: ${store.size()}`);
    const audit = store.getAuditTrail();
    console.log(`Audit log records count: ${audit.length}`);
    console.log('Sample audit block:', audit[0]);

    console.log('\n[Verifying Chain Integrity...]');
    const check1 = store.verifyAuditIntegrity();
    console.log('Original Chain Result:', check1);

    console.log('\n[Testing Tamper Detection (Simulating Attack)]');
    // Tamper test
    store.auditLog[1].timestamp = '2020-01-01T00:00:00.000Z';
    const check2 = store.verifyAuditIntegrity();
    console.log('Tampered Chain Result:', check2);

    if (!check2.valid && check1.valid) {
      console.log('\n>>> SUCCESS: Store cryptographic audit chaining correctly detected tampering! <<<');
    }
    break;
  }

  case 'inspect': {
    const target = args[1] || process.cwd();
    if (!AppInspector) {
      console.error('[Error] BinaryInspector/AppInspector module not loaded');
      process.exit(1);
    }
    try {
      console.log(`--- Inspecting Target: ${target} ---`);
      const report = AppInspector.inspect(target);
      console.log(JSON.stringify(report, null, 2));
    } catch (e) {
      console.error(`[Inspection Failed]: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  case 'doctor': {
    if (!runDoctor) {
      console.error('[Error] runDoctor module not loaded');
      process.exit(1);
    }
    console.log('--- REA System & Toolchain Doctor Diagnostics ---');
    const diag = runDoctor();
    console.log(JSON.stringify(diag, null, 2));
    break;
  }

  case 'version':
  case '-v':
  case '--version': {
    console.log(`Muse / REA App v${version}`);
    break;
  }

  default: {
    printHelp();
    break;
  }
}
