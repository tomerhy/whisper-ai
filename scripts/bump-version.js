#!/usr/bin/env node

/**
 * Whisper AI Version Bump Script
 * 
 * Usage:
 *   node scripts/bump-version.js patch    # 1.0.0 -> 1.0.1
 *   node scripts/bump-version.js minor    # 1.0.0 -> 1.1.0
 *   node scripts/bump-version.js major    # 1.0.0 -> 2.0.0
 *   node scripts/bump-version.js 2.0.0    # Set specific version
 * 
 * Or use npm scripts:
 *   npm run version:patch
 *   npm run version:minor
 *   npm run version:major
 */

const fs = require('fs');
const path = require('path');

// Files to update
const FILES = {
  manifest: path.join(__dirname, '..', 'manifest.json'),
  package: path.join(__dirname, '..', 'package.json'),
  popupHtml: path.join(__dirname, '..', 'popup', 'popup.html')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentVersion() {
  const manifest = JSON.parse(fs.readFileSync(FILES.manifest, 'utf8'));
  return manifest.version;
}

function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0
  };
}

function bumpVersion(current, type) {
  const v = parseVersion(current);
  
  switch (type) {
    case 'major':
      return `${v.major + 1}.0.0`;
    case 'minor':
      return `${v.major}.${v.minor + 1}.0`;
    case 'patch':
      return `${v.major}.${v.minor}.${v.patch + 1}`;
    default:
      // Assume it's a specific version string
      if (/^\d+\.\d+\.\d+$/.test(type)) {
        return type;
      }
      throw new Error(`Invalid version type: ${type}`);
  }
}

function updateManifest(newVersion) {
  const manifest = JSON.parse(fs.readFileSync(FILES.manifest, 'utf8'));
  manifest.version = newVersion;
  fs.writeFileSync(FILES.manifest, JSON.stringify(manifest, null, 2) + '\n');
  log(`  ✓ manifest.json`, 'green');
}

function updatePackageJson(newVersion) {
  const pkg = JSON.parse(fs.readFileSync(FILES.package, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(FILES.package, JSON.stringify(pkg, null, 2) + '\n');
  log(`  ✓ package.json`, 'green');
}

function updatePopupHtml(newVersion) {
  let html = fs.readFileSync(FILES.popupHtml, 'utf8');
  // Update version badge: <span class="version-badge">v1.0.0</span>
  html = html.replace(
    /<span class="version-badge">v[\d.]+<\/span>/,
    `<span class="version-badge">v${newVersion}</span>`
  );
  fs.writeFileSync(FILES.popupHtml, html);
  log(`  ✓ popup/popup.html`, 'green');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('\n⚡ Whisper AI Version Bump\n', 'blue');
    log('Usage:', 'yellow');
    log('  node scripts/bump-version.js <patch|minor|major|x.x.x>\n', 'dim');
    log('Examples:', 'yellow');
    log('  node scripts/bump-version.js patch    # 1.0.0 -> 1.0.1', 'dim');
    log('  node scripts/bump-version.js minor    # 1.0.0 -> 1.1.0', 'dim');
    log('  node scripts/bump-version.js major    # 1.0.0 -> 2.0.0', 'dim');
    log('  node scripts/bump-version.js 2.0.0    # Set to 2.0.0\n', 'dim');
    
    const currentVersion = getCurrentVersion();
    log(`Current version: ${currentVersion}\n`, 'blue');
    return;
  }
  
  const type = args[0];
  const currentVersion = getCurrentVersion();
  
  try {
    const newVersion = bumpVersion(currentVersion, type);
    
    log(`\n⚡ Bumping version: ${currentVersion} → ${newVersion}\n`, 'blue');
    
    log('Updating files:', 'yellow');
    updateManifest(newVersion);
    updatePackageJson(newVersion);
    updatePopupHtml(newVersion);
    
    log(`\n✅ Version bumped to ${newVersion}!\n`, 'green');
    log('Next steps:', 'yellow');
    log(`  git add .`, 'dim');
    log(`  git commit -m "🔖 Bump version to ${newVersion}"`, 'dim');
    log(`  git tag v${newVersion}`, 'dim');
    log(`  git push && git push --tags\n`, 'dim');
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

main();
