const screens = {
  login: {
    title: "Login do paciente",
    subtitle: "Entrada para a jornada preventiva orientada por dados."
  },
  "patient-dashboard": {
    title: "Dashboard do paciente",
    subtitle: "Health Score, insights e próximas ações preventivas."
  },
  "patient-recommendations": {
    title: "Recomendações preventivas",
    subtitle: "Exames, consultas e orientações priorizadas."
  },
  "patient-wearables": {
    title: "Wearables e estilo de vida",
    subtitle: "Atividade, sono, frequência cardíaca e estresse."
  },
  "patient-scheduling": {
    title: "Agendamento",
    subtitle: "Consulta de disponibilidade e marcação de exames ou consultas."
  },
  "patient-history": {
    title: "Histórico do paciente",
    subtitle: "Linha do tempo clínica e preventiva."
  },
  "doctor-dashboard": {
    title: "Dashboard médico",
    subtitle: "Agenda, pacientes prioritários e alertas clínicos."
  },
  "doctor-patients": {
    title: "Pacientes",
    subtitle: "Lista de pacientes com score e risco principal."
  },
  "doctor-record": {
    title: "Ficha clínica",
    subtitle: "Resumo clínico, risco preditivo e recomendações."
  },
  "doctor-lifestyle": {
    title: "Padrões de estilo de vida",
    subtitle: "Leitura assistida dos dados comportamentais do paciente."
  },
  "doctor-consultation": {
    title: "Consulta com apoio da IA",
    subtitle: "Resumo analítico para apoio à anamnese."
  }
};

const screenEls = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav__item");
const roleButtons = document.querySelectorAll(".role-btn");
const patientNav = document.getElementById("patient-nav");
const doctorNav = document.getElementById("doctor-nav");
const titleEl = document.getElementById("screen-title");
const subtitleEl = document.getElementById("screen-subtitle");

function showScreen(id) {
  screenEls.forEach(el => el.classList.toggle("active", el.id === id));
  navButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.screen === id));
  titleEl.textContent = screens[id].title;
  subtitleEl.textContent = screens[id].subtitle;
}

function setRole(role) {
  roleButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.role === role));
  patientNav.classList.toggle("hidden", role !== "patient");
  doctorNav.classList.toggle("hidden", role !== "doctor");
  showScreen(role === "patient" ? "login" : "doctor-dashboard");
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.screen));
});

roleButtons.forEach(btn => {
  btn.addEventListener("click", () => setRole(btn.dataset.role));
});

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.go;
    if (target.startsWith("doctor")) {
      setRole("doctor");
    } else {
      setRole("patient");
    }
    showScreen(target);
  });
});
