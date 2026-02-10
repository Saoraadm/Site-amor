// Contador simples do tempo de namoro
(function () {
  const counterEl = document.getElementById("counter");

  const dateEl = document.getElementById("anniversary-date");
  if (!counterEl || !dateEl) return;

  function parseDateBR(value) {
    const [day, month, year] = value.split("/").map(Number);
    if (!day || !month || !year) return null;

    // Usa horário local para manter coerência com a data exibida na página.
    return new Date(year, month - 1, day, 0, 0, 0);
  }

  const startDate = parseDateBR(dateEl.textContent.trim()) || new Date(2025, 10, 29, 0, 0, 0);

  function plural(value, singular, pluralWord) {
    return `${value} ${value === 1 ? singular : pluralWord}`;
  }

  function updateCounter() {
    const now = new Date();
    let diffMs = now - startDate;

    // Evita mensagens confusas caso o relógio/dispositivo esteja com data anterior.
    if (diffMs < 0) diffMs = 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    counterEl.textContent = `Estamos juntos há ${plural(days, "dia", "dias")}, ${plural(hours, "hora", "horas")}, ${plural(minutes, "minuto", "minutos")} e ${plural(seconds, "segundo", "segundos")}. 💞`;

  }

  updateCounter();
  setInterval(updateCounter, 1000);
})();
