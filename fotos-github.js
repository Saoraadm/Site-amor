(function () {
  const STORAGE_KEY = "siteAmorGithubGallery";

  const textareaEl = document.getElementById("github-images-input");
  const saveBtn = document.getElementById("save-github-images");
  const resetBtn = document.getElementById("reset-github-images");
  const feedbackEl = document.getElementById("github-feedback");
  const galleryEl = document.getElementById("github-gallery");

  if (!textareaEl || !saveBtn || !resetBtn || !feedbackEl || !galleryEl) return;

  const defaultLines = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80 | O dia que eu estive em um tribunal"
  ];

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseLines(rawValue) {
    return rawValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [urlPart, ...captionParts] = line.split("|");
        return {
          url: (urlPart || "").trim(),
          caption: captionParts.join("|").trim() || "Sem legenda"
        };
      })
      .filter((item) => item.url);
  }

  function renderGallery(items) {
    galleryEl.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "upload-feedback";
      empty.textContent = "Nenhuma imagem configurada ainda. Cole ao menos uma URL para montar a galeria.";
      galleryEl.appendChild(empty);
      return;
    }

    const html = items
      .map(
        (item) => `
          <figure class="gallery-item">
            <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.caption)}" loading="lazy" referrerpolicy="no-referrer" />
            <figcaption>${escapeHtml(item.caption)}</figcaption>
          </figure>
        `
      )
      .join("");

    galleryEl.innerHTML = html;
  }

  function loadSavedText() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && saved.trim() ? saved : defaultLines.join("\n");
  }

  function saveAndRender() {
    const value = textareaEl.value.trim();
    const parsed = parseLines(value);

    if (!parsed.length) {
      feedbackEl.textContent = "Adicione pelo menos uma linha no formato URL | LEGENDA.";
      renderGallery([]);
      return;
    }

    localStorage.setItem(STORAGE_KEY, value);
    renderGallery(parsed);
    feedbackEl.textContent = "Galeria atualizada com sucesso! 💖";
  }

  function resetExample() {
    const defaultText = defaultLines.join("\n");
    textareaEl.value = defaultText;
    localStorage.setItem(STORAGE_KEY, defaultText);
    renderGallery(parseLines(defaultText));
    feedbackEl.textContent = "Exemplo restaurado.";
  }

  textareaEl.value = loadSavedText();
  renderGallery(parseLines(textareaEl.value));

  saveBtn.addEventListener("click", saveAndRender);
  resetBtn.addEventListener("click", resetExample);
})();
