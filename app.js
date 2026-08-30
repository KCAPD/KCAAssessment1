const CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbybuU0_1A_uzcP9k_N71JkQ459gomBSA9yXt1CRD1MJzsKC-E_DNd4EH3BIh0aSZKJLfQ/exec",
  thresholds: {
    expected: 80,
    developing: 60
  }
};

const DATA = {
  yearGroups: {
    "1": [
      ["Autumn 1", "Why is it so important to know where our food comes from?"],
      ["Autumn 2", "What makes every person and family unique?"],
      ["Spring 1", "How do inventors keep going when solving problems?"],
      ["Spring 2", "How can we care for the world around us?"],
      ["Summer 1", "How do people show courage?"],
      ["Summer 2", "How can we make our local area an even better place?"]
    ],
    "2": [
      ["Autumn 1", "How do our experiences shape who we become?"],
      ["Autumn 2", "How does food connect people and culture?"],
      ["Spring 1", "How did determination change Victorian Britain?"],
      ["Spring 2", "How can learning about other cultures help us show kindness?"],
      ["Summer 1", "How does exploring our world help us grow?"],
      ["Summer 2", "How can learning from the past help us shape the future?"]
    ],
    "3": [
      ["Autumn 1", "How has London's past shaped the city we know today?"],
      ["Autumn 2", "How do journeys help us understand the world and each other?"],
      ["Spring 1", "How did people survive and thrive in the Stone Age?"],
      ["Spring 2", "How does water bring people together?"],
      ["Summer 1", "How do people adapt to life in different climates?"],
      ["Summer 2", "What can the achievements of Ancient Egypt inspire us to do?"]
    ],
    "4": [
      ["Autumn 1", "Why is it our responsibility to care for the natural world?"],
      ["Autumn 2", "Why should we protect the world's rainforests?"],
      ["Spring 1", "How have people overcome challenges to build new lives?"],
      ["Spring 2", "What can Ancient Greece teach us about living well together?"],
      ["Summer 1", "How did the Romans change Britain?"],
      ["Summer 2", "How can our food choices change the world?"]
    ],
    "5": [
      ["Autumn 1", "How can understanding our planet help us make responsible choices?"],
      ["Autumn 2", "How did the Anglo-Saxons shape the Britain we know today?"],
      ["Spring 1", "What can animals teach us about survival and resilience?"],
      ["Spring 2", "What can the Vikings teach us about kindness and community?"],
      ["Summer 1", "How does exploring the unknown change what we know?"],
      ["Summer 2", "What can we learn from the Tudors about power, ambition and change?"]
    ],
    "6": [
      ["Autumn 1", "How can learning from history help us challenge injustice?"],
      ["Autumn 2", "What makes people feel they belong?"],
      ["Spring 1", "What can we learn from the resilience of those in World War 1?"],
      ["Spring 2", "How can ordinary people make an extraordinary difference?"],
      ["Summer 1", "How can ordinary people make an extraordinary difference?"],
      ["Summer 2", "How can I become the person I aspire to be?"]
    ]
  },
  forms: {
    "6-Autumn 1": "https://docs.google.com/forms/d/e/1FAIpQLSchGMshv86yrDTVqOzHoRNx0nhR5ssNOdNy4jF8wHPwFedI3A/viewform?usp=share_link&ouid=102874721147473405086"
  }
};

const TERM_CODES = {
  "Autumn 1": "A1",
  "Autumn 2": "A2",
  "Spring 1": "S1",
  "Spring 2": "S2",
  "Summer 1": "SU1",
  "Summer 2": "SU2"
};

const SUBJECT_ORDER = [
  "Science", "History", "Geography", "Art", "DT", "Music", "RE", "Computing", "French", "PE", "Previous Knowledge"
];

const yearsView = document.getElementById("yearsView");
const assessmentsView = document.getElementById("assessmentsView");
const teacherView = document.getElementById("teacherView");
const yearGrid = document.getElementById("yearGrid");
const assessmentGrid = document.getElementById("assessmentGrid");
const dashboardBody = document.getElementById("dashboardBody");
const dashboardTerm = document.getElementById("dashboardTerm");
const dashboardStatus = document.getElementById("dashboardStatus");

let dashboardData = null;

function show(view) {
  [yearsView, assessmentsView, teacherView].forEach(v => v.classList.remove("active"));
  view.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderYears() {
  yearGrid.innerHTML = Object.keys(DATA.yearGroups).map(year => `
    <button class="year-card" data-year="${year}">
      <span>Choose year group</span>
      <h2>Year ${year}</h2>
      <b>View 6 assessments →</b>
    </button>`).join("");

  document.querySelectorAll(".year-card").forEach(btn =>
    btn.addEventListener("click", () => openYear(btn.dataset.year))
  );
}

function openYear(year) {
  document.getElementById("yearTitle").textContent = `Year ${year}`;
  document.getElementById("yearEyebrow").textContent = `Year ${year} · 2026–2027`;

  assessmentGrid.innerHTML = DATA.yearGroups[year].map(([term, question]) => {
    const key = `${year}-${term}`;
    const url = DATA.forms[key];
    return `
      <article class="assessment-card">
        <span class="term">${term}</span>
        <h2>${question}</h2>
        ${url ? `
          <span class="status live">Open now</span>
          <a class="start" href="${url}" target="_blank" rel="noopener">Start assessment →</a>` : `
          <span class="status soon">Coming soon</span>
          <span class="disabled">Assessment not yet open</span>`}
      </article>`;
  }).join("");

  show(assessmentsView);
}

function parseAssessmentId(id) {
  const match = String(id).match(/A-\d{4}-Y(\d+)-([A-Z]+\d)-/i);
  if (!match) return null;
  return { year: match[1], termCode: match[2].toUpperCase() };
}

function yearRag(subjectData) {
  if (!subjectData || !subjectData.total) return null;
  const securePct = (subjectData.secure / subjectData.total) * 100;
  if (securePct >= CONFIG.thresholds.expected) return { cls: "expected", label: "Expected", pct: securePct };
  if (securePct >= CONFIG.thresholds.developing) return { cls: "developing", label: "Developing", pct: securePct };
  return { cls: "priority", label: "Priority", pct: securePct };
}

function buildTermLookup(term) {
  const wantedCode = TERM_CODES[term];
  const lookup = {};
  if (!dashboardData || !dashboardData.assessments) return lookup;

  Object.entries(dashboardData.assessments).forEach(([assessmentId, subjects]) => {
    const parsed = parseAssessmentId(assessmentId);
    if (!parsed || parsed.termCode !== wantedCode) return;
    lookup[parsed.year] = subjects;
  });
  return lookup;
}

function collectSubjects(lookup) {
  const found = new Set();
  Object.values(lookup).forEach(subjects => Object.keys(subjects || {}).forEach(s => found.add(s)));
  const ordered = SUBJECT_ORDER.filter(s => found.has(s));
  [...found].filter(s => !SUBJECT_ORDER.includes(s)).sort().forEach(s => ordered.push(s));
  return ordered.length ? ordered : SUBJECT_ORDER;
}

function renderDashboard() {
  const lookup = buildTermLookup(dashboardTerm.value);
  const subjects = collectSubjects(lookup);

  dashboardBody.innerHTML = subjects.map(subject => {
    const cells = ["1", "2", "3", "4", "5", "6"].map(year => {
      const data = lookup[year]?.[subject];
      const rag = yearRag(data);
      if (!rag) return `<td><span class="rag-cell no-data" title="No data yet">—</span></td>`;
      const rounded = Math.round(rag.pct);
      return `<td><span class="rag-cell ${rag.cls}" title="${rounded}% of pupils Secure"><b>${rag.label}</b><small>${rounded}% secure</small></span></td>`;
    }).join("");
    return `<tr><th scope="row">${subject}</th>${cells}</tr>`;
  }).join("");
}

async function loadDashboard() {
  dashboardStatus.textContent = "Loading live data…";
  try {
    const response = await fetch(`${CONFIG.apiUrl}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (!json.success) throw new Error(json.error || "Dashboard API returned an error");
    dashboardData = json;
    renderDashboard();
    const generated = json.generated ? new Date(json.generated) : new Date();
    dashboardStatus.textContent = `Live · updated ${generated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch (error) {
    console.error(error);
    dashboardStatus.textContent = "Could not load live data";
    dashboardBody.innerHTML = `<tr><td colspan="7" class="dashboard-error">The live Google data could not be loaded. Try Refresh live data.</td></tr>`;
  }
}

document.getElementById("backBtn").addEventListener("click", () => show(yearsView));
document.getElementById("homeBtn").addEventListener("click", () => show(yearsView));
document.getElementById("teacherBtn").addEventListener("click", () => { show(teacherView); loadDashboard(); });
document.getElementById("teacherBackBtn").addEventListener("click", () => show(yearsView));
document.getElementById("refreshDashboard").addEventListener("click", loadDashboard);
dashboardTerm.addEventListener("change", renderDashboard);

renderYears();
