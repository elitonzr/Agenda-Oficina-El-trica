const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const themeToggle = document.getElementById("themeToggle");

const monthNames = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

let currentDate = new Date();

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

// === NAVEGAÇÃO ENTRE MESES ===
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

// === LEITURA DA PLANILHA CSV ===
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqBpKp63xdD921Hs2xheVfVa1vhhbVya6RFC8IaC0mCli_kia3dHY1QQqpOwiy4f4Hznv4YkilhyYY/pub?gid=0&single=true&output=csv";

async function fetchEventsFromSheet(url) {
  const response = await fetch(url);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const events = lines.slice(1).map(line => {
    const values = line.split(',');
    const event = {};
    headers.forEach((key, i) => {
      event[key] = values[i]?.trim();
    });
    return event;
  });

  return events;
}

// === ATUALIZAR CALENDÁRIO ===
function updateCalendar() {
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  monthTitle.textContent = `${month[0].toUpperCase() + month.slice(1)} ${year}`;

  calendar.innerHTML = "<p>Carregando...</p>";

  fetchEventsFromSheet(csvUrl)
    .then(events => {
      renderWeekHeader();
      renderCalendar(events);
    })
    .catch(() => {
      renderWeekHeader();
      renderCalendar([]);
    });
}

// === CABEÇALHO DOS DIAS ===
function renderWeekHeader() {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const header = document.createElement("div");
  header.className = "calendar-header";
  weekDays.forEach(dia => {
    const cell = document.createElement("div");
    cell.textContent = dia;
    header.appendChild(cell);
  });

  const oldHeader = document.querySelector(".calendar-header");
  if (oldHeader) {
    oldHeader.replaceWith(header);
  } else {
    calendar.before(header);
  }
}

// === RENDERIZAR EVENTOS ===
function renderCalendar(events) {
  calendar.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    const dateStr = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    const todaysEvents = events.filter(ev => ev.data === dateStr);
    todaysEvents.forEach(ev => {
      const eDiv = document.createElement("div");
      eDiv.className = "event";
      eDiv.style.backgroundColor = ev.corfundo || "var(--highlight)";
      eDiv.style.color = ev.cortexto || "black";
      eDiv.innerHTML = `<strong>${ev.titulo}</strong>${ev.hora ? `<br><small>${ev.hora}</small>` : ""}`;
      eDiv.addEventListener("click", () => openModal(ev));
      cell.appendChild(eDiv);
    });

    grid.appendChild(cell);
  }

  calendar.appendChild(grid);
}

// === MODAL ===
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalDetails = document.getElementById("modalDetails");
const modalResponsavel = document.getElementById("modalResponsavel");
const modalObs = document.getElementById("modalObs");
const closeModalBtn = document.getElementById("closeModal");

function openModal(ev) {
  modalTitle.textContent = ev.titulo || "Evento";
  modalDate.textContent = ev.data || "Sem data";
  modalDetails.textContent = ev.hora ? `Horário: ${ev.hora}` : "";
  modalResponsavel.textContent = ev.responsavel ? `Responsável: ${ev.responsavel}` : "";
  modalObs.textContent = ev.obs ? `Obs: ${ev.obs}` : "";
  modalOverlay.style.display = "flex";
}

function closeModal() {
  modalOverlay.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// === INICIALIZAÇÃO ===
updateCalendar();
