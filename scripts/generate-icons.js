/**
 * Whisper AI Icon Generator
 * 
 * Creates icons from photo-source.png with purple gradient and rounded corners.
 * 
 * Prerequisites:
 *   npm install canvas
 * 
 * Usage:
 *   node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

let createCanvas, loadImage;
try {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
} catch (e) {
  console.log('Canvas module not found.');
  console.log('Run: npm install canvas');
  process.exit(1);
}

const sizes = [16, 32, 48, 128];
const outputDir = path.join(__dirname, '..', 'assets', 'icons');
const photoPath = path.join(outputDir, 'photo-source.png');

// Purple gradient colors (Whisper AI branding)
const GRADIENT_START = '#6366F1';
const GRADIENT_END = '#8B5CF6';

// Helper function to draw rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function generateIcons() {
  console.log('⚡ Generating Whisper AI icons...\n');
  
  // Load source photo
  if (!fs.existsSync(photoPath)) {
    console.log('❌ photo-source.png not found in assets/icons/');
    process.exit(1);
  }
  
  const sourceImage = await loadImage(photoPath);
  console.log(`📷 Loaded photo-source.png (${sourceImage.width}x${sourceImage.height})\n`);
  
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Corner radius scales with size (roughly 20% of size, like the original)
    const cornerRadius = Math.round(size * 0.22);
    
    // Step 1: Create rounded rectangle with gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, GRADIENT_START);
    gradient.addColorStop(1, GRADIENT_END);
    
    ctx.fillStyle = gradient;
    roundRect(ctx, 0, 0, size, size, cornerRadius);
    ctx.fill();
    
    // Step 2: Process source image - replace blue with transparency
    const tempCanvas = createCanvas(sourceImage.width, sourceImage.height);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(sourceImage, 0, 0);
    
    const imageData = tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height);
    const data = imageData.data;
    
    // Replace blue background pixels with transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect blue background - the source uses blue around RGB(66, 133, 244)
      // Check if pixel is "blue-ish" (blue dominant, not white/gray)
      const isBlue = b > 150 && b > r * 1.2 && b > g * 0.9 && !(r > 200 && g > 200 && b > 200);
      
      if (isBlue) {
        data[i + 3] = 0; // Make transparent
      }
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Step 3: Clip to rounded rectangle and draw processed image
    ctx.save();
    roundRect(ctx, 0, 0, size, size, cornerRadius);
    ctx.clip();
    ctx.drawImage(tempCanvas, 0, 0, size, size);
    ctx.restore();
    
    const filename = `icon${size}.png`;
    const filepath = path.join(outputDir, filename);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✓ Generated ${filename} (${size}x${size})`);
  }
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`📁 Output: ${outputDir}`);
}

generateIcons().catch(console.error);
