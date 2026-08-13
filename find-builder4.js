const { Jimp, intToRGBA } = require('jimp');

async function findExactWhiteBox() {
  const img = await Jimp.read('public/builder-id.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // Find EXACT bounding box of the solid white area on the left
  let pL = w, pR = 0, pT = h, pB = 0;
  for (let y = 150; y < 600; y++) {
    for (let x = 10; x < 380; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      // strict white check
      if (color.r > 248 && color.g > 248 && color.b > 248) {
        if (x < pL) pL = x;
        if (x > pR) pR = x;
        if (y < pT) pT = y;
        if (y > pB) pB = y;
      }
    }
  }
  
  console.log(`EXACT WHITE BOX: x=${pL}, y=${pT}, w=${pR-pL}, h=${pB-pT}`);
  console.log(`RIGHT BOUND = ${pR}`);
}

findExactWhiteBox();
