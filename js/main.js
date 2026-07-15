(() => {
  const thumbs = document.getElementById("thumbs");
  const QUALITY = 0.8;

  async function handleFiles(fileList) {
    for (const f of fileList) {
      const entry = {
        id: crypto.randomUUID(),
        file: f,
        imageBitmap: null,
        convertedBlob: null,
        outputName: null,
      };

      Store.add(entry);
      thumbs.appendChild(
        UI.createThumb(entry, { onConvert: convertSingle, onRemove }),
      );

      try {
        entry.imageBitmap = await ImageService.loadImage(f);
        UI.setThumbSrc(
          entry,
          ImageService.generateThumbnail(entry.imageBitmap),
        );
      } catch (err) {
        console.error("Erro ao carregar imagem:", err);
      }
    }
  }

  function onRemove(entry) {
    Store.remove(entry.id);
  }

  async function convertSingle(entry) {
    if (!entry.imageBitmap) return alert("Imagem não pronta");

    const blob = await ImageService.convertToJpg(entry.imageBitmap, QUALITY);
    if (!blob) return alert("Erro na conversão");

    entry.convertedBlob = blob;
    entry.outputName = entry.file.name.replace(/\.[^/.]+$/, "") + ".jpg";

    UI.updateDownloadLink(entry);
  }

  async function onConvertAll() {
    for (const entry of Store.getAll()) await convertSingle(entry);
  }

  async function onDownloadAll() {
    for (const entry of Store.getPending()) await convertSingle(entry);

    const converted = Store.getConverted();
    if (!converted.length) return alert("Nada convertido");

    for (const entry of converted) {
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(entry.convertedBlob),
        download: entry.outputName,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
  }

  UI.initDropzone(handleFiles);
  UI.initControls({ onConvertAll, onDownloadAll });
})();
