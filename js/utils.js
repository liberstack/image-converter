const Utils = (() => {
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function reductionPercent(originalBytes, newBytes) {
    if (!originalBytes) return 0;
    const pct = 100 - (newBytes / originalBytes) * 100;
    return Math.max(0, Math.round(pct));
  }

  return { escapeHtml, formatBytes, reductionPercent };
})();
