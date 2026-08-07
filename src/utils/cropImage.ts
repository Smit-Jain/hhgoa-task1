export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // set width to double image size to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = image.width * 2;
  canvas.height = image.height * 2;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(image.width, image.height);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-image.width, -image.height);

  // draw image
  ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

  const data = ctx.getImageData(
    canvas.width / 2 - image.width / 2 + pixelCrop.x,
    canvas.height / 2 - image.height / 2 + pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(data, 0, 0);

  // As a blob URL
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) resolve(URL.createObjectURL(file));
    }, "image/png");
  });
}
