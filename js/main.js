import { store } from "./store.js";
import { loadImage, convertImage, generateThumbnail } from "./imageService.js";
import {
  createThumb,
  updateDownloadLink,
  setThumbSrc,
  initDropzone,
  initControls,
} from "./ui.js";

const thumbs = document.getElementById("thumbs");
const formatSelect = document.getElementById("format");

async function handleFiles(fileList) {
  for (const f of fileList) {
    const entry = {
      id: crypto.randomUUID(),
      file: f,
      imageBitmap: null,
      convertedBlob: null,
      outputName: null,
    };

    store.add(entry);
    thumbs.appendChild(
      createThumb(entry, { onConvert: convertSingle, onRemove }),
    );

    try {
      entry.imageBitmap = await loadImage(f);
      setThumbSrc(entry, generateThumbnail(entry.imageBitmap));
    } catch (err) {
      console.error("Erro ao carregar imagem:", err);
    }
  }
}

function onRemove(entry) {
  store.remove(entry.id);
}

async function convertSingle(entry) {
  if (!entry.imageBitmap) return alert("Imagem não pronta");

  const blob = await convertImage(entry.imageBitmap, formatSelect.value, 1.0);
  if (!blob) return alert("Erro na conversão");

  const ext = formatSelect.value.split("/")[1];
  entry.convertedBlob = blob;
  entry.outputName = entry.file.name.replace(/\.[^/.]+$/, "") + "." + ext;

  updateDownloadLink(entry);
}

async function onConvertAll() {
  for (const entry of store.getAll()) await convertSingle(entry);
}

async function onDownloadAll() {
  for (const entry of store.getPending()) await convertSingle(entry);

  const converted = store.getConverted();
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

initDropzone(handleFiles);
initControls({ onConvertAll, onDownloadAll });
