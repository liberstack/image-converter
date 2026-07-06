export async function loadImage(file) {
  return createImageBitmap(file);
}

export async function convertImage(imageBitmap, format, quality = 1.0) {
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  canvas.getContext("2d").drawImage(imageBitmap, 0, 0);

  return new Promise((res) => canvas.toBlob(res, format, quality));
}

export function generateThumbnail(imageBitmap, width = 300) {
  const canvas = document.createElement("canvas");
  const aspect = imageBitmap.width / imageBitmap.height;
  canvas.width = width;
  canvas.height = Math.round(width / aspect);
  canvas
    .getContext("2d")
    .drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
