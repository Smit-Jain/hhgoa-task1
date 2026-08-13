const { Jimp, intToRGBA } = require('jimp');

async function findBuilderRegions() {
  const img = await Jimp.read('public/builder-id.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // Find the large white square on the left (Photo area)
  let pL = w, pR = 0, pT = h, pB = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w/2; x++) { // Only look on left half
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r > 245 && color.g > 245 && color.b > 245) {
        if (x < pL) pL = x;
        if (x > pR) pR = x;
        if (y < pT) pT = y;
        if (y > pB) pB = y;
      }
    }
  }
  
  console.log(`PHOTO SQUARE: L=${pL}, R=${pR}, T=${pT}, B=${pB}`);
  console.log(`  -> w=${pR-pL}, h=${pB-pT}, x=${pL}, y=${pT}`);

  // Find the 4 text fields on the right. 
  // We'll scan a vertical line on the right side (e.g. x = 600) to find the top/bottom bounds of the white fields.
  let fields = [];
  let inField = false;
  let currentField = null;
  const scanX = w * 0.55; // 55% across
  for (let y = 0; y < h; y++) {
    const color = intToRGBA(img.getPixelColor(scanX, y));
    const isWhite = color.r > 230 && color.g > 230 && color.b > 230;
    
    if (isWhite && !inField) {
      inField = true;
      currentField = { top: y, bottom: y };
    } else if (isWhite && inField) {
      currentField.bottom = y;
    } else if (!isWhite && inField) {
      inField = false;
      // Filter out small noise
      if (currentField.bottom - currentField.top > 20) {
        // Find left and right bounds by scanning horizontally
        let fL = w, fR = 0;
        let midY = (currentField.top + currentField.bottom) / 2;
        for (let x = w/3; x < w*0.8; x++) {
          const c2 = intToRGBA(img.getPixelColor(x, midY));
          if (c2.r > 230 && c2.g > 230 && c2.b > 230) {
            if (x < fL) fL = x;
            if (x > fR) fR = x;
          }
        }
        currentField.left = fL;
        currentField.right = fR;
        fields.push(currentField);
      }
    }
  }
  
  fields.forEach((f, i) => {
    console.log(`FIELD ${i+1}: y=${f.top} to ${f.bottom} (h=${f.bottom-f.top}), x=${f.left} to ${f.right} (w=${f.right-f.left})`);
  });
}

findBuilderRegions();
