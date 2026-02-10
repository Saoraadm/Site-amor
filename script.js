// Contador simples do tempo de namoro
(function () {
  const counterEl = document.getElementById("counter");
  if (!counterEl) return;

  // Defina aqui a data de início do namoro (ano, mês-1, dia)
  const startDate = new Date(2022, 5, 12, 0, 0, 0);

  function updateCounter() {
    const now = new Date();
    const diffMs = now - startDate;

    if (diffMs < 0) {
      counterEl.textContent = "Nosso amor começa em breve!";
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    counterEl.textContent = `Estamos juntos há ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos. 💞`;
  }

  updateCounter();
  setInterval(updateCounter, 1000);
})();
