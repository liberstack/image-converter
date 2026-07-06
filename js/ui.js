import { escapeHtml, formatBytes } from "./utils.js";

// ── thumb ──

export function createThumb(entry, { onConvert, onRemove }) {
  const el = document.createElement("div");
  el.className = "thumb";
  el.dataset.id = entry.id;

  el.innerHTML = `
    <img class="preview" alt="${escapeHtml(entry.file.name)}">
    <div class="meta">
      <strong>${escapeHtml(entry.file.name)}</strong>
      <div>${formatBytes(entry.file.size)}</div>
    </div>
    <div class="thumb-actions">
      <button class="thumb-btn convert">Converter</button>
      <a class="thumb-btn download" style="display:none">Baixar</a>
      <button class="thumb-btn remove">Remover</button>
    </div>
  `;

  entry._el = el;

  el.querySelector(".convert").addEventListener("click", () =>
    onConvert(entry),
  );
  el.querySelector(".remove").addEventListener("click", () => {
    onRemove(entry);
    el.remove();
  });

  return el;
}

export function setThumbSrc(entry, dataUrl) {
  if (!entry._el) return;
  entry._el.querySelector(".preview").src = dataUrl;
}

export function updateDownloadLink(entry) {
  if (!entry._el) return;
  const link = entry._el.querySelector(".download");
  link.href = URL.createObjectURL(entry.convertedBlob);
  link.download = entry.outputName;
  link.style.display = "";
}

// ── dropzone ──

export function initDropzone(onFiles) {
  const input = document.getElementById("file");
  const drop = document.getElementById("drop");

  input.addEventListener("change", (e) => {
    onFiles(e.target.files);
    input.value = "";
  });

  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.classList.add("dragover");
  });

  drop.addEventListener("dragleave", () => drop.classList.remove("dragover"));

  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("dragover");
    onFiles(e.dataTransfer.files);
  });
}

// ── controls ──

export function initControls({ onConvertAll, onDownloadAll }) {
  document.getElementById("convert").addEventListener("click", onConvertAll);
  document
    .getElementById("downloadAll")
    .addEventListener("click", onDownloadAll);
}
