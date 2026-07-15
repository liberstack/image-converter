const ImageService = (() => {
  const OUTPUT_FORMAT = "image/jpeg";

  async function loadImage(file) {
    return createImageBitmap(file);
  }

  async function convertToJpg(imageBitmap, quality = 0.8) {
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext("2d");

    // JPG não tem canal alpha — pinta um fundo branco antes de desenhar,
    // senão transparência de PNG/WebP vira preto na conversão.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageBitmap, 0, 0);

    return new Promise((res) => canvas.toBlob(res, OUTPUT_FORMAT, quality));
  }

  function generateThumbnail(imageBitmap, width = 300) {
    const canvas = document.createElement("canvas");
    const aspect = imageBitmap.width / imageBitmap.height;
    canvas.width = width;
    canvas.height = Math.round(width / aspect);
    canvas
      .getContext("2d")
      .drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  return { loadImage, convertToJpg, generateThumbnail };
})();
