const { Jimp, intToRGBA } = require('jimp');

async function findCoords() {
  const img = await Jimp.read('public/builder-id.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // 1. Find PHOTO square. It's the huge white thing on the left.
  let pL = w, pR = 0, pT = h, pB = 0;
  for (let y = h*0.2; y < h*0.8; y++) {
    for (let x = 0; x < w*0.5; x++) { // Look in left half
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r > 245 && color.g > 245 && color.b > 245) {
        if (x < pL) pL = x;
        if (x > pR) pR = x;
        if (y < pT) pT = y;
        if (y > pB) pB = y;
      }
    }
  }
  
  console.log(`PHOTO SQUARE: x=${pL}, y=${pT}, w=${pR-pL}, h=${pB-pT}`);

  // 2. Find exactly where the dummy text starts.
  // The pink labels are e.g. "NAME" (which is pink) and "Aary Garge" (which is black).
  // We want to find the bounding boxes of the BLACK text only, so we know exactly where to put white rectangles.
  let blackTextRects = [];
  let currentY = null;
  for (let y = pT; y < pB; y++) {
    let hasBlack = false;
    let minX = w, maxX = 0;
    
    for (let x = w*0.4; x < w*0.8; x++) { // Text is in right half
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r < 50 && color.g < 50 && color.b < 50) {
        hasBlack = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    
    if (hasBlack) {
      if (!currentY) {
        currentY = { top: y, bottom: y, left: minX, right: maxX };
      } else {
        currentY.bottom = y;
        if (minX < currentY.left) currentY.left = minX;
        if (maxX > currentY.right) currentY.right = maxX;
      }
    } else {
      if (currentY) {
        // Only keep blocks that are tall enough to be text
        if (currentY.bottom - currentY.top > 10) {
          blackTextRects.push(currentY);
        }
        currentY = null;
      }
    }
  }
  
  blackTextRects.forEach((rect, i) => {
    console.log(`TEXT ${i+1}: x=${rect.left}, y=${rect.top}, w=${rect.right-rect.left}, h=${rect.bottom-rect.top}`);
  });
}

findCoords();
