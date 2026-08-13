const { Jimp, intToRGBA } = require('jimp');

async function findBuilderRegions() {
  const img = await Jimp.read('public/builder-id.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // Find PHOTO square (left side, bounded between x=0 and 380 roughly)
  let pL = w, pR = 0, pT = h, pB = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < 380; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r > 240 && color.g > 240 && color.b > 240) {
        if (x < pL) pL = x;
        if (x > pR) pR = x;
        if (y < pT) pT = y;
        if (y > pB) pB = y;
      }
    }
  }
  
  console.log(`PHOTO SQUARE: x=${pL}, y=${pT}, w=${pR-pL}, h=${pB-pT}`);

  // Find TEXT FIELDS on the right side.
  // There are 4 fields. They are white rectangles with pink labels on their left.
  // We can just scan a column at x=500 and record continuous segments of white.
  const fields = [];
  let inField = false;
  let top = 0;
  for (let y = 0; y < h; y++) {
    const color = intToRGBA(img.getPixelColor(600, y));
    const isWhite = color.r > 230 && color.g > 230 && color.b > 230;
    
    if (isWhite && !inField) {
      inField = true;
      top = y;
    } else if (!isWhite && inField) {
      inField = false;
      if (y - top > 20) {
        fields.push({ top, bottom: y, height: y - top });
      }
    }
  }
  
  // For each field, find its left/right boundary starting from x=600
  fields.forEach((f, i) => {
    const midY = Math.round((f.top + f.bottom) / 2);
    let left = 600, right = 600;
    while (left > 350) {
      const c = intToRGBA(img.getPixelColor(left-1, midY));
      if (c.r < 230 || c.g < 230 || c.b < 230) break;
      left--;
    }
    while (right < w - 20) {
      const c = intToRGBA(img.getPixelColor(right+1, midY));
      if (c.r < 230 || c.g < 230 || c.b < 230) break;
      right++;
    }
    f.left = left;
    f.right = right;
    f.width = right - left;
    console.log(`FIELD ${i+1}: x=${f.left}, y=${f.top}, w=${f.width}, h=${f.height}`);
  });
}

findBuilderRegions();
