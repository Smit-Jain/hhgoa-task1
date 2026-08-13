const { Jimp, intToRGBA } = require('jimp');

async function findText() {
  const img = await Jimp.read('public/builder-id.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // We'll look for dark/black pixels in the right half of the image
  // Since the user said "Aary Garge" is the placeholder text.
  let textBounds = [];
  let currentBlock = null;
  
  for (let y = 180; y < 650; y++) {
    let hasBlack = false;
    for (let x = 400; x < 800; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r < 50 && color.g < 50 && color.b < 50) {
        hasBlack = true;
        break;
      }
    }
    
    if (hasBlack && !currentBlock) {
      currentBlock = { top: y };
    } else if (!hasBlack && currentBlock) {
      currentBlock.bottom = y;
      if (currentBlock.bottom - currentBlock.top > 10) {
        textBounds.push(currentBlock);
      }
      currentBlock = null;
    }
  }
  
  textBounds.forEach((b, i) => {
    // Find left and right bounds
    let left = 800, right = 400;
    for (let y = b.top; y <= b.bottom; y++) {
      for (let x = 400; x < 800; x++) {
        const color = intToRGBA(img.getPixelColor(x, y));
        if (color.r < 50 && color.g < 50 && color.b < 50) {
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }
    console.log(`BLACK TEXT ${i+1}: x=${left} to ${right}, y=${b.top} to ${b.bottom} (w=${right-left}, h=${b.bottom-b.top})`);
  });
}

findText();
