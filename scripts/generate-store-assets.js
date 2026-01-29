const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const assets = [
  { file: 'promo-small-440x280.html', width: 440, height: 280, output: 'promo-small-440x280.png' },
  { file: 'promo-marquee-1400x560.html', width: 1400, height: 560, output: 'promo-marquee-1400x560.png' },
  { file: 'screenshot-1-1280x800.html', width: 1280, height: 800, output: 'screenshot-1-1280x800.png' },
  { file: 'screenshot-2-1280x800.html', width: 1280, height: 800, output: 'screenshot-2-1280x800.png' },
  { file: 'screenshot-3-1280x800.html', width: 1280, height: 800, output: 'screenshot-3-1280x800.png' },
];

const storeDir = path.join(__dirname, '..', 'assets', 'store');

async function generateAssets() {
  console.log('🚀 Starting asset generation...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const asset of assets) {
    const htmlPath = path.join(storeDir, asset.file);
    const outputPath = path.join(storeDir, asset.output);
    
    if (!fs.existsSync(htmlPath)) {
      console.log(`❌ File not found: ${asset.file}`);
      continue;
    }

    const page = await browser.newPage();
    // Set exact viewport size with deviceScaleFactor 1 for exact pixel dimensions
    await page.setViewport({ 
      width: asset.width, 
      height: asset.height, 
      deviceScaleFactor: 1 
    });
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take a full page screenshot with exact clip dimensions
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { 
        x: 0, 
        y: 0, 
        width: asset.width, 
        height: asset.height 
      }
    });
    
    console.log(`✅ Created: ${asset.output} (${asset.width}x${asset.height})`);
    
    await page.close();
  }

  await browser.close();
  console.log('\n🎉 All assets generated in assets/store/');
}

generateAssets().catch(console.error);
