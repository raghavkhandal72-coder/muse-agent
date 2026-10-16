'use strict';

const fs = require('node:fs');
const os = require('node:os');
const { execSync } = require('node:child_process');

class ReaDoctor {
  static runDiagnostics() {
    const report = { timestamp: new Date().toISOString(), overallStatus: 'PASS', checks: [] };

    // Node check
    const major = parseInt(process.version.replace('v', '').split('.')[0], 10);
    report.checks.push({ category: 'Runtime', name: 'Node.js Version', status: major >= 20 ? 'PASS' : 'WARN', details: process.version });

    // OS check
    report.checks.push({ category: 'System', name: 'OS & CPU', status: 'PASS', details: `${os.platform()} (${os.arch()})` });

    // Memory
    const freeMB = Math.round(os.freemem() / (1024 * 1024));
    report.checks.push({ category: 'Resources', name: 'System Memory', status: 'PASS', details: `${freeMB} MB Free` });

    // Writable check
    let fsOk = true;
    try {
      const tmp = path_temp_check();
      fs.writeFileSync(tmp, 'ok');
      fs.unlinkSync(tmp);
    } catch { fsOk = false; }
    report.checks.push({ category: 'Filesystem', name: 'Workspace Permissions', status: fsOk ? 'PASS' : 'FAIL', details: fsOk ? 'Read/Write OK' : 'No Access' });

    // Python / Engines
    let py = 'Not found';
    try {
      py = execSync('python --version 2>&1', { encoding: 'utf8' }).trim();
    } catch {
      try { py = execSync('python3 --version 2>&1', { encoding: 'utf8' }).trim(); } catch {}
    }
    report.checks.push({ category: 'Engines', name: 'Analysis Engines', status: 'PASS', details: { python: py } });

    return report;
  }
}

function path_temp_check() {
  const tmpDir = os.tmpdir();
  return require('node:path').join(tmpDir, `rea_test_${Date.now()}.tmp`);
}

module.exports = ReaDoctor;
