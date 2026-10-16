'use strict';

const fs = require('node:fs');
const path = require('node:path');
const BinaryInspector = require('./binary_inspector');

class AppInspector {
  static inspect(targetPath) {
    if (!fs.existsSync(targetPath)) {
      throw new Error(`Target path not found: ${targetPath}`);
    }
    const stat = fs.statSync(targetPath);
    if (stat.isFile()) {
      return BinaryInspector.inspect(targetPath);
    }

    // Inspect directory / package
    const items = fs.readdirSync(targetPath);
    const summary = {
      directory: targetPath,
      totalEntries: items.length,
      hasPackageJson: items.includes('package.json'),
      hasAppJson: items.includes('app.json'),
      hasMainPy: items.includes('main.py'),
      hasGit: items.includes('.git'),
      manifests: {},
      binariesFound: []
    };

    if (summary.hasPackageJson) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(targetPath, 'package.json'), 'utf8'));
        summary.manifests.packageJson = {
          name: pkg.name,
          version: pkg.version,
          dependencies: Object.keys(pkg.dependencies || {})
        };
      } catch (e) {}
    }

    if (summary.hasAppJson) {
      try {
        const app = JSON.parse(fs.readFileSync(path.join(targetPath, 'app.json'), 'utf8'));
        summary.manifests.appJson = app.expo ? {
          name: app.expo.name,
          slug: app.expo.slug,
          version: app.expo.version,
          platforms: app.expo.platforms
        } : app;
      } catch (e) {}
    }

    for (const item of items) {
      const ext = path.extname(item).toLowerCase();
      if (['.exe', '.apk', '.bin', '.elf', '.dylib', '.so'].includes(ext)) {
        try {
          const bInfo = BinaryInspector.inspect(path.join(targetPath, item));
          summary.binariesFound.push({
            file: item,
            format: bInfo.format,
            sizeMB: bInfo.sizeMB,
            entropy: bInfo.entropy
          });
        } catch (e) {}
      }
    }

    return summary;
  }
}

module.exports = AppInspector;
