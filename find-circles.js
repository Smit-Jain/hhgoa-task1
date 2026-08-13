const { Jimp, intToRGBA } = require('jimp');

async function findCircles() {
  const img = await Jimp.read('public/pfp-frame.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  // INNER WHITE CIRCLE
  let iw_left = w, iw_right = 0, iw_top = h, iw_bottom = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r > 250 && color.g > 250 && color.b > 250) {
        // Is it the inner circle? (Centerish)
        if (x > w/4 && x < w*3/4 && y > h/4 && y < h*3/4) {
          if (x < iw_left) iw_left = x;
          if (x > iw_right) iw_right = x;
          if (y < iw_top) iw_top = y;
          if (y > iw_bottom) iw_bottom = y;
        }
      }
    }
  }
  
  // OUTER GREEN CIRCLE
  let og_left = w, og_right = 0, og_top = h, og_bottom = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      // Is it green?
      if (color.r < 100 && color.g > 60 && color.b < 100) {
        if (x < og_left) og_left = x;
        if (x > og_right) og_right = x;
        if (y < og_top) og_top = y;
        if (y > og_bottom) og_bottom = y;
      }
    }
  }
  
  console.log(`INNER WHITE: L=${iw_left}, R=${iw_right}, T=${iw_top}, B=${iw_bottom}`);
  console.log(`  -> cx=${(iw_left+iw_right)/2}, cy=${(iw_top+iw_bottom)/2}, rx=${(iw_right-iw_left)/2}, ry=${(iw_bottom-iw_top)/2}`);
  
  console.log(`OUTER GREEN: L=${og_left}, R=${og_right}, T=${og_top}, B=${og_bottom}`);
  console.log(`  -> cx=${(og_left+og_right)/2}, cy=${(og_top+og_bottom)/2}, rx=${(og_right-og_left)/2}, ry=${(og_bottom-og_top)/2}`);
}

findCircles();
