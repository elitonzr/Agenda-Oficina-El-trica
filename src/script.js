// script.js atualizado com suporte ao filtro por tipo e melhorias visuais

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const themeToggle = document.getElementById("themeToggle");
const tipoSelect = document.getElementById("tipoFiltro");

const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

let currentDate = new Date();
let allEvents = [];

// === TEMA ===
function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  themeToggle.textContent = theme === "dark" ? "🌙" : "🌞";
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
});

(function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
})();

// === NAVEGAÇÃO ===
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderAll();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderAll();
});

if (tipoSelect) {
  tipoSelect.addEventListener("change", renderAll);
}

// === PLANILHA CSV ===
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqBpKp63xdD921Hs2xheVfVa1vhhbVya6RFC8IaC0mCli_kia3dHY1QQqpOwiy4f4Hznv4YkilhyYY/pub?gid=0&single=true&output=csv";

async function fetchEvents() {
  const res = await fetch(csvUrl);
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const ev = {};
    headers.forEach((h, i) => (ev[h] = values[i]?.trim()));
    return ev;
  });
}

// === ATUALIZAR CALENDÁRIO ===
function renderAll() {
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  monthTitle.textContent = `${month[0].toUpperCase() + month.slice(1)} ${year}`;

  const tipo = tipoSelect?.value || "";
  const filtered =
    tipo && tipo !== ""
      ? allEvents.filter((ev) => ev.tipo === tipo)
      : allEvents;
  renderCalendar(filtered);
}

function renderCalendar(events) {
  calendar.innerHTML = "";

  const y = currentDate.getFullYear(),
        m = currentDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const lastDay = new Date(y, m, totalDays).getDay();

  // Cabeçalho com dias da semana
  const header = document.createElement("div");
  header.className = "calendar-header";
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "day-header";
    dayHeader.textContent = day;
    dayHeader.style.color = dayHeader.textContent == "Dom" ? "var(--text-dom)" : "inherit";
    header.appendChild(dayHeader);
  });
  calendar.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // Espaços antes do primeiro dia
  for (let i = 0; i < firstDay; i++)
    grid.appendChild(document.createElement("div"));

  const todayStr = `${String(new Date().getDate()).padStart(2, "0")}/${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}/${new Date().getFullYear()}`;

  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    const dateStr = `${String(d).padStart(2, "0")}/${String(m + 1).padStart(
      2,
      "0"
    )}/${y}`;

    if (dateStr === todayStr) {
      cell.classList.add("today");
    }

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = d;
    cell.appendChild(dayNumber);

    const dayEvents = events.filter((ev) => ev.data === dateStr);
    dayEvents.forEach((ev) => {
      const eDiv = document.createElement("div");
      eDiv.className = "event";
      eDiv.style.backgroundColor = ev.corfundo || "var(--highlight)";
      eDiv.style.color = ev.cortexto || "black";
      eDiv.innerHTML = `<strong>${ev.tipo || ""}</strong>${
        ev.titulo ? `<br><small>${ev.titulo}</small>` : ""
      }`;
      eDiv.addEventListener("click", () => openModal(ev));
      cell.appendChild(eDiv);
    });

    grid.appendChild(cell);
  }

  // Espaços depois do último dia para completar a grade
  for (let i = lastDay; i < 6; i++) {
    grid.appendChild(document.createElement("div"));
  }

  calendar.appendChild(grid);
}


// === MODAL ===
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalTipo = document.getElementById("modalTipo");
const modalDate = document.getElementById("modalDate");
const modalDetails = document.getElementById("modalDetails");
const modalResponsavel = document.getElementById("modalResponsavel");
const modalObs = document.getElementById("modalObs");

function openModal(ev) {
  modalTipo.textContent = ev.tipo || "Sem Tipo";
  modalTipo.style.backgroundColor = ev.corfundo || "var(--highlight)";
  modalTipo.style.color = ev.cortexto || "var(--text-light)";
  modalTitle.textContent = ev.titulo ? `Evento: ${ev.titulo}` : "";
  modalResponsavel.textContent = ev.responsavel
    ? `Responsável: ${ev.responsavel}`
    : "";
  modalDate.textContent = ev.data ? `Data: ${ev.data}` : "";
  modalDetails.textContent = ev.hora ? `Horário: ${ev.hora}` : "";
  modalObs.textContent = ev.obs ? `Obs: ${ev.obs}` : "";
  modalOverlay.style.display = "flex";
}

function closeModal() {
  modalOverlay.style.display = "none";
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.style.display === "flex") {
    closeModal();
  }
});

// === INICIALIZAÇÃO ===
fetchEvents().then((events) => {
  allEvents = events;
  const tiposUnicos = [...new Set(events.map((e) => e.tipo).filter(Boolean))];
  if (tipoSelect) {
    tipoSelect.innerHTML =
      '<option value="">Todos</option>' +
      tiposUnicos.map((t) => `<option value="${t}">${t}</option>`).join("");
  }
  renderAll();
});
