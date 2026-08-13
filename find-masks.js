const { Jimp, intToRGBA } = require('jimp');

async function findMasks() {
  const img = await Jimp.read('public/pfp-frame.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // Create an output image to visualize our detection
  const out = new Jimp({ width: w, height: h, color: 0x000000ff });
  
  let iL = w, iR = 0, iT = h, iB = 0;
  let oL = w, oR = 0, oT = h, oB = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      
      // Background is cream (#fffbe8 approx).
      const isCream = (color.r > 240 && color.g > 240 && color.b > 220 && Math.abs(color.r - color.g) < 15);
      
      // Inner is pure white (#ffffff approx).
      const isWhite = (color.r > 250 && color.g > 250 && color.b > 250);
      
      if (isWhite && x > w/4 && x < w*3/4 && y > h/4 && y < h*3/4) {
        // Inner white circle
        out.setPixelColor(0xffffffff, x, y);
        if (x < iL) iL = x;
        if (x > iR) iR = x;
        if (y < iT) iT = y;
        if (y > iB) iB = y;
      } else if (!isCream) {
        // Outer green/colorful frame
        out.setPixelColor(0x00ff00ff, x, y);
        if (x < oL) oL = x;
        if (x > oR) oR = x;
        if (y < oT) oT = y;
        if (y > oB) oB = y;
      }
    }
  }
  
  console.log(`INNER WHITE: L=${iL}, R=${iR}, T=${iT}, B=${iB}`);
  console.log(`  -> cx=${(iL+iR)/2}, cy=${(iT+iB)/2}, rx=${(iR-iL)/2}, ry=${(iB-iT)/2}`);
  
  console.log(`OUTER BOUND: L=${oL}, R=${oR}, T=${oT}, B=${oB}`);
  console.log(`  -> cx=${(oL+oR)/2}, cy=${(oT+oB)/2}, rx=${(oR-oL)/2}, ry=${(oB-oT)/2}`);
  
  await out.write('public/detection.png');
}

findMasks();
