/**
 * Whisper AI Icon Generator
 * 
 * This script generates PNG icons for the Chrome extension.
 * 
 * Prerequisites:
 *   npm install canvas
 * 
 * Usage:
 *   node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Try to load canvas, provide fallback instructions if not available
let createCanvas;
try {
  createCanvas = require('canvas').createCanvas;
} catch (e) {
  console.log('Canvas module not found. Installing...');
  console.log('Run: npm install canvas');
  console.log('\nAlternatively, open scripts/generate-icons.html in a browser to download icons.');
  process.exit(1);
}

const sizes = [16, 32, 48, 128];
const outputDir = path.join(__dirname, '..', 'assets', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawIcon(ctx, size) {
  const scale = size / 128;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366F1');
  gradient.addColorStop(1, '#8B5CF6');
  
  // Circle background
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Lightning bolt
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(68 * scale, 28 * scale);
  ctx.lineTo(38 * scale, 68 * scale);
  ctx.lineTo(58 * scale, 68 * scale);
  ctx.lineTo(54 * scale, 100 * scale);
  ctx.lineTo(88 * scale, 56 * scale);
  ctx.lineTo(66 * scale, 56 * scale);
  ctx.closePath();
  ctx.fill();
}

console.log('⚡ Generating Whisper AI icons...\n');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  drawIcon(ctx, size);
  
  const filename = `icon${size}.png`;
  const filepath = path.join(outputDir, filename);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  
  console.log(`✓ Generated ${filename} (${size}x${size})`);
});

console.log('\n✅ All icons generated successfully!');
console.log(`📁 Output: ${outputDir}`);
