// Upload simples de fotos na página de galeria (sem backend).
(function () {
  const inputEl = document.getElementById("photo-input");
  const galleryEl = document.getElementById("gallery");
  const feedbackEl = document.getElementById("upload-feedback");
  const clearBtn = document.getElementById("clear-photos");

  if (!inputEl || !galleryEl || !feedbackEl || !clearBtn) return;

  const STORAGE_KEY = "site-amor-uploaded-photos";
  const MAX_FILES = 12;

  function createFigure(src, altText) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item gallery-item-uploaded";

    const img = document.createElement("img");
    img.src = src;
    img.alt = altText;

    figure.appendChild(img);
    return figure;
  }

  function saveUploadedPhotos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function loadUploadedPhotos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function renderUploadedPhotos() {
    galleryEl.querySelectorAll(".gallery-item-uploaded").forEach((node) => node.remove());

    const uploaded = loadUploadedPhotos();
    uploaded.forEach((item, index) => {
      galleryEl.appendChild(createFigure(item.src, item.alt || `Foto enviada ${index + 1}`));
    });
  }

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Falha ao ler imagem"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    const images = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (!images.length) {
      feedbackEl.textContent = "Selecione arquivos de imagem para enviar. 💡";
      return;
    }

    const existing = loadUploadedPhotos();
    const availableSlots = Math.max(MAX_FILES - existing.length, 0);

    if (availableSlots <= 0) {
      feedbackEl.textContent = `Você já atingiu o limite de ${MAX_FILES} fotos enviadas.`;
      return;
    }

    const selected = images.slice(0, availableSlots);
    const uploaded = [];

    for (const file of selected) {
      try {
        const src = await toDataUrl(file);
        uploaded.push({ src, alt: `Foto enviada: ${file.name}` });
      } catch (error) {
        // Se falhar uma imagem, segue com as demais.
      }
    }

    const nextList = [...existing, ...uploaded];
    saveUploadedPhotos(nextList);
    renderUploadedPhotos();

    const ignoredCount = images.length - selected.length;
    feedbackEl.textContent =
      ignoredCount > 0
        ? `Adicionamos ${uploaded.length} foto(s)! ${ignoredCount} foi(ram) ignorada(s) por limite.`
        : `Adicionamos ${uploaded.length} foto(s) com sucesso! 💖`;
  }

  inputEl.addEventListener("change", (event) => {
    handleFiles(event.target.files);
    inputEl.value = "";
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderUploadedPhotos();
    feedbackEl.textContent = "As fotos enviadas foram removidas deste navegador.";
  });

  renderUploadedPhotos();
})();
