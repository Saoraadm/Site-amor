// Contador simples do tempo de namoro
(function () {
  const counterEl = document.getElementById("counter");
  const nextMonthCounterEl = document.getElementById("next-month-counter");
  const dateEl = document.getElementById("anniversary-date");
  if (!counterEl || !nextMonthCounterEl || !dateEl) return;

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

  function getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function createMonthiversaryDate(year, monthIndex) {
    const day = Math.min(startDate.getDate(), getDaysInMonth(year, monthIndex));
    return new Date(year, monthIndex, day, 0, 0, 0, 0);
  }

  function getNextMonthiversary(now) {
    let target = createMonthiversaryDate(now.getFullYear(), now.getMonth());

    if (target <= now) {
      target = createMonthiversaryDate(now.getFullYear(), now.getMonth() + 1);
    }

    return target;
  }

  function updateCounter() {
    const now = new Date();

    let togetherDiffMs = now - startDate;
    if (togetherDiffMs < 0) togetherDiffMs = 0;

    const totalSeconds = Math.floor(togetherDiffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    counterEl.textContent = `Estamos juntos há ${plural(days, "dia", "dias")}, ${plural(hours, "hora", "horas")}, ${plural(minutes, "minuto", "minutos")} e ${plural(seconds, "segundo", "segundos")}. 💞`;

    const nextMonthiversary = getNextMonthiversary(now);
    const remainingMs = Math.max(nextMonthiversary - now, 0);
    const remainingSeconds = Math.floor(remainingMs / 1000);
    const remainingDays = Math.floor(remainingSeconds / 86400);
    const remainingHours = Math.floor((remainingSeconds % 86400) / 3600);
    const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
    const remainingSecondsOnly = remainingSeconds % 60;

    nextMonthCounterEl.textContent = `Falta ${plural(remainingDays, "dia", "dias")}, ${plural(remainingHours, "hora", "horas")}, ${plural(remainingMinutes, "minuto", "minutos")} e ${plural(remainingSecondsOnly, "segundo", "segundos")} para fazermos mais um mês juntos. 🗓️💗`;
  }

  updateCounter();
  setInterval(updateCounter, 1000);
})();
