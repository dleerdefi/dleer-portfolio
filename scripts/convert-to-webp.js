const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function convertToWebP() {
  const inputDir = './public/images';
  const files = await fs.readdir(inputDir);

  console.log('Starting WebP conversion...\n');

  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(inputDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

      try {
        const inputStats = await fs.stat(inputPath);
        const inputSize = (inputStats.size / 1024 / 1024).toFixed(2);

        await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);

        const outputStats = await fs.stat(outputPath);
        const outputSize = (outputStats.size / 1024 / 1024).toFixed(2);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

        console.log(`✓ ${file}`);
        console.log(`  ${inputSize}MB → ${outputSize}MB (${savings}% smaller)\n`);
      } catch (error) {
        console.error(`✗ Failed to convert ${file}:`, error.message);
      }
    }
  }

  console.log('Conversion complete!');
}

convertToWebP().catch(console.error);
