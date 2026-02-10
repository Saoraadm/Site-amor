import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

(function () {
  const inputEl = document.getElementById("photo-input");
  const galleryEl = document.getElementById("gallery");
  const feedbackEl = document.getElementById("upload-feedback");
  const uploadBtn = document.getElementById("upload-photo");

  if (!inputEl || !galleryEl || !feedbackEl || !uploadBtn) return;

  function isFirebaseConfigured(config) {
    return Boolean(
      config &&
        config.apiKey &&
        !config.apiKey.includes("SUA_") &&
        config.projectId &&
        !config.projectId.includes("SEU_") &&
        config.storageBucket &&
        !config.storageBucket.includes("SEU_")
    );
  }

  function createFigure(src, altText) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = altText;
    img.loading = "lazy";

    figure.appendChild(img);
    return figure;
  }

  function renderEmptyState(message) {
    galleryEl.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "upload-feedback";
    empty.textContent = message;
    galleryEl.appendChild(empty);
  }

  if (!isFirebaseConfigured(firebaseConfig)) {
    feedbackEl.textContent =
      "Configure o arquivo firebase-config.js para ativar o mural com Firebase.";
    uploadBtn.disabled = true;
    renderEmptyState("Mural indisponível até configurar o Firebase.");
    return;
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const photosCollection = collection(db, "photoWall");

  async function uploadSelectedPhoto() {
    const file = inputEl.files && inputEl.files[0];

    if (!file) {
      feedbackEl.textContent = "Selecione uma imagem antes de enviar. 💡";
      return;
    }

    if (!file.type.startsWith("image/")) {
      feedbackEl.textContent = "Apenas imagens são permitidas.";
      return;
    }

    uploadBtn.disabled = true;
    feedbackEl.textContent = "Enviando foto para o mural...";

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `photo-wall/${Date.now()}-${safeName}`;
      const imageRef = ref(storage, filePath);

      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      await addDoc(photosCollection, {
        imageUrl: downloadURL,
        filePath,
        fileName: file.name,
        createdAt: serverTimestamp()
      });

      feedbackEl.textContent = "Foto enviada com sucesso! 💖";
      inputEl.value = "";
    } catch (error) {
      feedbackEl.textContent = "Não foi possível enviar a foto. Verifique a configuração do Firebase.";
    } finally {
      uploadBtn.disabled = false;
    }
  }

  uploadBtn.addEventListener("click", uploadSelectedPhoto);

  const photosQuery = query(photosCollection, orderBy("createdAt", "desc"));

  onSnapshot(
    photosQuery,
    (snapshot) => {
      galleryEl.innerHTML = "";

      if (snapshot.empty) {
        renderEmptyState("Nenhuma foto no mural ainda. Envie a primeira! ✨");
        return;
      }

      snapshot.forEach((docItem, index) => {
        const data = docItem.data();
        if (!data.imageUrl) return;

        const altText = data.fileName
          ? `Foto do mural: ${data.fileName}`
          : `Foto do mural ${index + 1}`;

        galleryEl.appendChild(createFigure(data.imageUrl, altText));
      });
    },
    () => {
      renderEmptyState("Não foi possível carregar o mural agora.");
    }
  );
})();
