const { Jimp, intToRGBA } = require('jimp');

async function analyzeNewFrame() {
  const img = await Jimp.read('public/pfp-frame.png');
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  console.log(`IMAGE SIZE: ${w}x${h}`);

  // Find inner hole by scanning from the center
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  
  let left = cx;
  while(left > 0 && intToRGBA(img.getPixelColor(left, cy)).a < 10) left--;
  
  let right = cx;
  while(right < w && intToRGBA(img.getPixelColor(right, cy)).a < 10) right++;
  
  let top = cy;
  while(top > 0 && intToRGBA(img.getPixelColor(cx, top)).a < 10) top--;
  
  let bottom = cy;
  while(bottom < h && intToRGBA(img.getPixelColor(cx, bottom)).a < 10) bottom++;
  
  console.log(`INNER HOLE (approx): x=${left}, y=${top}, w=${right-left}, h=${bottom-top}`);
  console.log(`CENTER: cx=${Math.floor((left+right)/2)}, cy=${Math.floor((top+bottom)/2)}`);
  console.log(`RADII: rx=${Math.floor((right-left)/2)}, ry=${Math.floor((bottom-top)/2)}`);
}

analyzeNewFrame();
