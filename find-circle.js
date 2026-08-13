const { Jimp, intToRGBA } = require('jimp');

async function findCircle() {
  const img = await Jimp.read('public/pfp-frame.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  let left = w, right = 0, top = h, bottom = 0;
  
  // Find bounding box of pure white pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      if (color.r > 250 && color.g > 250 && color.b > 250) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const radius = (right - left) / 2;
  
  console.log(`White Circle Bounding Box: left=${left}, right=${right}, top=${top}, bottom=${bottom}`);
  console.log(`Center: (${cx}, ${cy}), Radius: ${radius}`);
}

findCircle();
