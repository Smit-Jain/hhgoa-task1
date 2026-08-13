const { Jimp, intToRGBA } = require('jimp');

async function findExactText() {
  const img = await Jimp.read('public/builder-id.png');
  
  function scanBox(startY, endY, label) {
    let tL = 1000, tR = 0, tT = 1000, tB = 0;
    for (let y = startY; y < endY; y++) {
      for (let x = 400; x < 740; x++) {
        const color = intToRGBA(img.getPixelColor(x, y));
        // Find dark pixels (the dummy text)
        if (color.r < 100 && color.g < 100 && color.b < 100) {
          if (x < tL) tL = x;
          if (x > tR) tR = x;
          if (y < tT) tT = y;
          if (y > tB) tB = y;
        }
      }
    }
    console.log(`${label}: x=${tL}, y=${tT}, w=${tR-tL}, h=${tB-tT}`);
    console.log(`Suggested cover: x=${tL-5}, y=${tT-2}, w=${tR-tL+15}, h=${tB-tT+8}`);
  }
  
  scanBox(215, 270, 'FIELD 1 (Name)');
  scanBox(310, 370, 'FIELD 2 (Role)');
  scanBox(400, 460, 'FIELD 3 (Title)');
  scanBox(490, 560, 'FIELD 4 (Build)');
}

findExactText();
