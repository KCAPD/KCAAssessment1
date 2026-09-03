const CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbybuU0_1A_uzcP9k_N71JkQ459gomBSA9yXt1CRD1MJzsKC-E_DNd4EH3BIh0aSZKJLfQ/exec",
  thresholds: {
    expected: 80,
    developing: 60
  },
  sessionKey: "kca_dashboard_session"
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
  forms: {}
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
const teacherLoginView = document.getElementById("teacherLoginView");
const mtcView = document.getElementById("mtcView");
const teacherView = document.getElementById("teacherView");
const yearGrid = document.getElementById("yearGrid");
const assessmentGrid = document.getElementById("assessmentGrid");
const dashboardBody = document.getElementById("dashboardBody");
const dashboardTerm = document.getElementById("dashboardTerm");
const dashboardStatus = document.getElementById("dashboardStatus");
const completionGrid = document.getElementById("completionGrid");
const assessmentManagementGrid = document.getElementById("assessmentManagementGrid");
const sltPinInput = document.getElementById("sltPinInput");
const sltUnlockBtn = document.getElementById("sltUnlockBtn");
const sltLockBtn = document.getElementById("sltLockBtn");
const sltUnlockStatus = document.getElementById("sltUnlockStatus");
const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const mtcReportClass = document.getElementById("mtcReportClass");
const generateMtcReportButton = document.getElementById("generateMtcReport");
const mtcReportProgress = document.getElementById("mtcReportProgress");
const mtcReportResult = document.getElementById("mtcReportResult");

let dashboardData = null;
let publicAssessmentStatus = [];
let sltPin = "";
let sltControlsUnlocked = false;

function show(view) {
  [yearsView, assessmentsView, mtcView, teacherLoginView, teacherView].forEach(v => v.classList.remove("active"));
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

async function loadPublicAssessmentStatus() {
  try {
    const url = `${CONFIG.apiUrl}?action=publicAssessments&t=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    publicAssessmentStatus = json.success && Array.isArray(json.assessments) ? json.assessments : [];
  } catch (error) {
    console.error("Could not load assessment availability", error);
    publicAssessmentStatus = [];
  }
}

function publicAssessmentFor(year, term) {
  return publicAssessmentStatus.find(item =>
    Number(item.yearGroup) === Number(year) && String(item.period) === String(term)
  ) || null;
}

async function openYear(year) {
  // Always fetch the latest public assessment status before rendering.
  // This means SLT ON/OFF changes are reflected the next time a pupil opens a year group.
  await loadPublicAssessmentStatus();

  document.getElementById("yearTitle").textContent = `Year ${year}`;
  document.getElementById("yearEyebrow").textContent = `Year ${year} · 2026–2027`;

  const mtcCard = year === "4" ? `
    <article class="assessment-card mtc-card">
      <span class="term">Weekly practice</span>
      <h2>Multiplication Tables Check Practice</h2>
      <span class="status live">Weekly practice</span>
      <button class="start mtc-launch" id="launchMtc">Start MTC practice →</button>
    </article>` : "";

  assessmentGrid.innerHTML = mtcCard + DATA.yearGroups[year].map(([term, question]) => {
    const availability = publicAssessmentFor(year, term);
    const url = availability && availability.live ? availability.url : "";
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

  const launchMtc = document.getElementById("launchMtc");
  if (launchMtc) launchMtc.addEventListener("click", openMtc);
  show(assessmentsView);
}

function getStoredSession() {
  try {
    const raw = sessionStorage.getItem(CONFIG.sessionKey);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.token || !session.expiresAt || Date.now() >= session.expiresAt) {
      sessionStorage.removeItem(CONFIG.sessionKey);
      return null;
    }
    return session;
  } catch (_) {
    sessionStorage.removeItem(CONFIG.sessionKey);
    return null;
  }
}

function storeSession(token, expiresInSeconds) {
  sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify({
    token,
    expiresAt: Date.now() + (Number(expiresInSeconds || 28800) * 1000)
  }));
}

function clearSession() {
  sessionStorage.removeItem(CONFIG.sessionKey);
  dashboardData = null;
  lockSltControls();
}

async function loginToDashboard(password) {
  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "login", password }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function handleLogin(event) {
  event.preventDefault();
  loginMessage.textContent = "";
  const password = loginPassword.value;
  if (!password) {
    loginMessage.textContent = "Enter the staff password.";
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Checking…";

  try {
    const result = await loginToDashboard(password);
    loginPassword.value = "";

    if (!result.success || !result.authenticated || !result.token) {
      loginMessage.textContent = "That password wasn't recognised.";
      return;
    }

    storeSession(result.token, result.expiresIn);
    show(teacherView);
    await loadDashboard();
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Staff access could not be checked. Please try again.";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Open Teacher Dashboard";
  }
}

function openTeacherArea() {
  const session = getStoredSession();
  if (session) {
    show(teacherView);
    loadDashboard();
  } else {
    loginMessage.textContent = "";
    loginPassword.value = "";
    show(teacherLoginView);
    setTimeout(() => loginPassword.focus(), 100);
  }
}

function logoutTeacher() {
  clearSession();
  dashboardBody.innerHTML = "";
  dashboardStatus.textContent = "Locked";
  show(yearsView);
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

function buildCompletionLookup(term) {
  const wantedCode = TERM_CODES[term];
  const lookup = {};
  if (!dashboardData || !dashboardData.completion) return lookup;

  Object.entries(dashboardData.completion).forEach(([assessmentId, completion]) => {
    const parsed = parseAssessmentId(assessmentId);
    if (!parsed || parsed.termCode !== wantedCode) return;
    lookup[parsed.year] = { assessmentId, ...completion };
  });
  return lookup;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCompletion() {
  const lookup = buildCompletionLookup(dashboardTerm.value);

  completionGrid.innerHTML = ["1", "2", "3", "4", "5", "6"].map(year => {
    const item = lookup[year];
    if (!item) {
      return `<article class="completion-card no-completion"><div class="completion-card-top"><b>Year ${year}</b><span>Not set up</span></div><p>No assessment data yet.</p></article>`;
    }

    const pct = Number(item.percentage || 0);
    const classes = Object.entries(item.classes || {});
    const classOptions = classes.map(([className]) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("");
    const remaining = Math.max(0, Number(item.expected || 0) - Number(item.completed || 0));

    return `<article class="completion-card" data-assessment="${escapeHtml(item.assessmentId)}">
      <div class="completion-card-top"><b>Year ${year}</b><span>${item.completed}/${item.expected} completed</span></div>
      <div class="completion-progress" aria-label="${pct}% complete"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>
      <strong class="completion-percent">${pct}%</strong>
      <p class="completion-summary">${remaining === 0 ? "Everyone has completed this assessment ✓" : `${remaining} pupil${remaining === 1 ? "" : "s"} still to complete`}</p>
      <div class="report-tools">
        <b>Reports</b>
        <button class="report-btn" data-scope="year" data-assessment="${escapeHtml(item.assessmentId)}">Generate year-group pack</button>
        ${classes.length ? `<div class="class-report-row"><select class="class-report-select" aria-label="Choose class">${classOptions}</select><button class="report-btn secondary" data-scope="class" data-assessment="${escapeHtml(item.assessmentId)}">Generate class pack</button></div>` : ""}
        <div class="report-result" aria-live="polite"></div>
      </div>
    </article>`;
  }).join("");

  completionGrid.querySelectorAll(".report-btn").forEach(button => {
    button.addEventListener("click", () => generateReport(button));
  });
}

function updateSltUnlockUi() {
  if (!sltPinInput || !sltUnlockBtn || !sltLockBtn || !sltUnlockStatus) return;
  sltPinInput.disabled = sltControlsUnlocked;
  sltUnlockBtn.hidden = sltControlsUnlocked;
  sltLockBtn.hidden = !sltControlsUnlocked;
  sltUnlockStatus.textContent = sltControlsUnlocked
    ? "Controls unlocked for this dashboard session."
    : "Enter the SLT PIN to enable assessment controls.";
}

function unlockSltControls() {
  const entered = String(sltPinInput?.value || "").trim();
  if (!entered) {
    if (sltUnlockStatus) sltUnlockStatus.textContent = "Enter the SLT PIN first.";
    sltPinInput?.focus();
    return;
  }
  // The PIN is deliberately kept only in this page's memory. Google performs
  // the real security check when an ON/OFF change is requested.
  sltPin = entered;
  sltControlsUnlocked = true;
  updateSltUnlockUi();
  if (sltUnlockStatus) {
    sltUnlockStatus.textContent = "Controls unlocked. Choose an assessment below to turn it on or off.";
  }
  renderAssessmentManagement();
}

function lockSltControls(message = "") {
  sltPin = "";
  sltControlsUnlocked = false;
  if (sltPinInput) sltPinInput.value = "";
  updateSltUnlockUi();
  if (message && sltUnlockStatus) sltUnlockStatus.textContent = message;
  if (dashboardData) renderAssessmentManagement();
}

function renderAssessmentManagement() {
  if (!assessmentManagementGrid) return;
  updateSltUnlockUi();
  const items = Array.isArray(dashboardData?.assessmentManagement) ? dashboardData.assessmentManagement : [];
  const term = dashboardTerm.value;
  const wantedCode = TERM_CODES[term];
  const filtered = items
    .filter(item => parseAssessmentId(item.assessmentId)?.termCode === wantedCode)
    .sort((a, b) => Number(a.yearGroup) - Number(b.yearGroup));

  assessmentManagementGrid.innerHTML = ["1", "2", "3", "4", "5", "6"].map(year => {
    const item = filtered.find(row => String(row.yearGroup) === year);
    if (!item) return `<article class="management-card unavailable"><div><b>Year ${year}</b><span>Not set up</span></div><p>No assessment configured for this half term.</p></article>`;

    const live = Boolean(item.live);
    const canOpen = Boolean(item.hasForm);
    const noForm = !live && !canOpen;
    const disabled = noForm || !sltControlsUnlocked;
    const buttonText = noForm
      ? "Google Form not set up"
      : (!sltControlsUnlocked ? "Unlock SLT controls above" : (live ? "Turn assessment off" : "Turn assessment on"));

    return `<article class="management-card ${live ? "is-live" : "is-off"}" data-assessment="${escapeHtml(item.assessmentId)}">
      <div class="management-card-top"><b>Year ${year}</b><span class="management-status ${live ? "live" : "off"}">${live ? "On" : "Off"}</span></div>
      <p>${escapeHtml(item.period || term)}</p>
      <button class="management-toggle" data-live="${live ? "true" : "false"}" ${disabled ? "disabled" : ""}>${buttonText}</button>
      <div class="management-result" aria-live="polite"></div>
    </article>`;
  }).join("");

  assessmentManagementGrid.querySelectorAll(".management-toggle").forEach(button => button.addEventListener("click", () => toggleAssessmentLive(button)));
}

async function toggleAssessmentLive(button) {
  const session = getStoredSession();
  if (!session) { show(teacherLoginView); return; }
  if (!sltControlsUnlocked || !sltPin) {
    if (sltUnlockStatus) sltUnlockStatus.textContent = "Enter the SLT PIN to enable assessment controls.";
    sltPinInput?.focus();
    return;
  }

  const card = button.closest(".management-card");
  const assessmentId = card?.dataset.assessment || "";
  const currentlyLive = button.dataset.live === "true";
  const result = card.querySelector(".management-result");
  button.disabled = true;
  result.textContent = currentlyLive ? "Closing assessment…" : "Opening assessment…";

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "setAssessmentLive", token: session.token, sltPin, assessmentId, live: !currentlyLive }),
      cache: "no-store"
    });
    const json = await response.json();
    if (!json.authenticated) { clearSession(); show(teacherLoginView); return; }
    if (!json.success) {
      if (json.sltAuthenticated === false) {
        lockSltControls("SLT PIN incorrect. Please try again.");
        sltPinInput?.focus();
        return;
      }
      throw new Error(json.error || "Could not update assessment");
    }
    await loadPublicAssessmentStatus();
    await loadDashboard();
  } catch (error) {
    console.error(error);
    result.textContent = error.message || "Could not update assessment.";
    button.disabled = false;
  }
}

async function generateReport(button) {
  const session = getStoredSession();
  if (!session) {
    show(teacherLoginView);
    return;
  }

  const card = button.closest(".completion-card");
  const result = card.querySelector(".report-result");
  const scope = button.dataset.scope;
  const assessmentId = button.dataset.assessment;
  const className = scope === "class" ? card.querySelector(".class-report-select")?.value || "" : "";

  const oldText = button.textContent;
  button.disabled = true;
  button.textContent = "Generating…";
  result.innerHTML = "";

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "generateReport", token: session.token, assessmentId, scope, className }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    if (!json.authenticated) {
      clearSession();
      loginMessage.textContent = "Your staff session has expired. Please sign in again.";
      show(teacherLoginView);
      return;
    }
    if (!json.success || !json.url) throw new Error(json.error || "Report could not be generated.");

    result.innerHTML = `<a href="${escapeHtml(json.url)}" target="_blank" rel="noopener">✓ Report ready — open printout</a>`;
  } catch (error) {
    console.error(error);
    result.textContent = error.message || "Report could not be generated. Please try again.";
  } finally {
    button.disabled = false;
    button.textContent = oldText;
  }
}


function getYear4ClassNames() {
  const names = new Set();

  if (!dashboardData || !dashboardData.completion) return [];

  Object.entries(dashboardData.completion).forEach(([assessmentId, completion]) => {
    const parsed = parseAssessmentId(assessmentId);
    if (!parsed || String(parsed.year) !== "4") return;

    Object.keys(completion?.classes || {}).forEach(className => {
      const clean = String(className || "").trim();
      if (clean) names.add(clean);
    });
  });

  return [...names].sort((a, b) => a.localeCompare(b));
}

function renderMtcReports() {
  if (!mtcReportClass || !generateMtcReportButton) return;

  const previousValue = mtcReportClass.value;
  const classes = getYear4ClassNames();

  if (!classes.length) {
    mtcReportClass.innerHTML = `<option value="">No Year 4 classes found</option>`;
    generateMtcReportButton.disabled = true;
    return;
  }

  mtcReportClass.innerHTML = classes
    .map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`)
    .join("");

  if (previousValue && classes.includes(previousValue)) {
    mtcReportClass.value = previousValue;
  }

  generateMtcReportButton.disabled = false;
}

async function generateMtcClassReportFromDashboard() {
  const session = getStoredSession();

  if (!session) {
    show(teacherLoginView);
    return;
  }

  const className = String(mtcReportClass?.value || "").trim();

  if (!className) {
    if (mtcReportResult) mtcReportResult.textContent = "Choose a Year 4 class first.";
    return;
  }

  const oldText = generateMtcReportButton.textContent;
  generateMtcReportButton.disabled = true;
  generateMtcReportButton.textContent = "Creating report…";

  if (mtcReportResult) mtcReportResult.innerHTML = "";
  if (mtcReportProgress) mtcReportProgress.hidden = false;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "generateMtcClassReport",
        token: session.token,
        className
      }),
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    if (!json.authenticated) {
      clearSession();
      loginMessage.textContent = "Your staff session has expired. Please sign in again.";
      show(teacherLoginView);
      return;
    }

    if (!json.success || !json.url) {
      throw new Error(json.error || "MTC report could not be generated.");
    }

    if (mtcReportResult) {
      mtcReportResult.innerHTML =
        `<a href="${escapeHtml(json.url)}" target="_blank" rel="noopener">✓ Report ready — open MTC report</a>`;
    }
  } catch (error) {
    console.error(error);
    if (mtcReportResult) {
      mtcReportResult.textContent =
        error.message || "MTC report could not be generated. Please try again.";
    }
  } finally {
    if (mtcReportProgress) mtcReportProgress.hidden = true;
    generateMtcReportButton.disabled = false;
    generateMtcReportButton.textContent = oldText;
  }
}

function renderDashboard() {
  renderCompletion();
  renderAssessmentManagement();
  renderMtcReports();
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
  const session = getStoredSession();
  if (!session) {
    show(teacherLoginView);
    return;
  }

  dashboardStatus.textContent = "Loading live data…";
  try {
    const url = `${CONFIG.apiUrl}?action=data&token=${encodeURIComponent(session.token)}&t=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    if (!json.authenticated) {
      clearSession();
      loginMessage.textContent = "Your staff session has expired. Please sign in again.";
      show(teacherLoginView);
      return;
    }

    if (!json.success) throw new Error(json.error || "Dashboard API returned an error");

    dashboardData = json;
    renderDashboard();
    const generated = json.generated ? new Date(json.generated) : new Date();
    dashboardStatus.textContent = `Live · updated ${generated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch (error) {
    console.error(error);
    dashboardStatus.textContent = "Could not load live data";
    dashboardBody.innerHTML = `<tr><td colspan="7" class="dashboard-error">The secure Google data could not be loaded. Try Refresh live data.</td></tr>`;
  }
}


// -------------------------
// MTC PRACTICE · v0.17 LIVE
// PIN login and pupil identity remain Google-side.
// The browser receives only an anonymous session token,
// anonymous attempt ID and the 25 question factors.
// -------------------------
const MTC = {
  sessionToken: "",
  attemptId: "",
  stage: "practice",
  index: 0,
  questions: [],
  answers: [],
  timer: null,
  locked: false,
  questionStartedAt: 0,
  submitting: false,
  practice: [{a:2,b:4},{a:5,b:3},{a:10,b:6}]
};

const mtcScreens = [...document.querySelectorAll(".mtc-screen")];
const mtcPin = document.getElementById("mtcPin");
const mtcLoginMessage = document.getElementById("mtcLoginMessage");
const mtcAnswer = document.getElementById("mtcAnswer");
const mtcFact = document.getElementById("mtcFact");
const mtcStageLabel = document.getElementById("mtcStageLabel");
const mtcQuestionCount = document.getElementById("mtcQuestionCount");
const mtcTimerBar = document.getElementById("mtcTimerBar");
const mtcContinue = document.getElementById("mtcContinue");
const mtcStartCheck = document.getElementById("mtcStartCheck");

function mtcShow(id) {
  mtcScreens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function resetMtcState() {
  clearTimeout(MTC.timer);
  MTC.sessionToken = "";
  MTC.attemptId = "";
  MTC.stage = "practice";
  MTC.index = 0;
  MTC.questions = [];
  MTC.answers = [];
  MTC.locked = false;
  MTC.questionStartedAt = 0;
  MTC.submitting = false;
  mtcPin.value = "";
  mtcLoginMessage.textContent = "";
  mtcContinue.disabled = false;
  mtcContinue.textContent = "Continue";
  mtcStartCheck.disabled = false;
  mtcStartCheck.textContent = "Start check";
}

function openMtc() {
  resetMtcState();
  mtcShow("mtcSelect");
  show(mtcView);
  setTimeout(() => mtcPin.focus(), 100);
}

async function mtcPost(payload) {
  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loginMtcPupil() {
  if (MTC.submitting) return;

  const pin = mtcPin.value.replace(/\D/g, "").slice(0, 5);
  mtcPin.value = pin;
  mtcLoginMessage.textContent = "";

  if (pin.length !== 5) {
    mtcLoginMessage.textContent = "Enter your 5-digit MTC PIN.";
    mtcPin.focus();
    return;
  }

  MTC.submitting = true;
  mtcContinue.disabled = true;
  mtcContinue.textContent = "Checking…";

  try {
    const result = await mtcPost({
      action: "mtcLogin",
      pin
    });

    if (!result.success || !result.valid || !result.sessionToken) {
      mtcLoginMessage.textContent = result.error || "PIN not recognised. Please check it and try again.";
      mtcPin.value = "";
      mtcPin.focus();
      return;
    }

    MTC.sessionToken = result.sessionToken;
    mtcPin.value = "";
    mtcShow("mtcWelcome");
  } catch (error) {
    console.error("MTC login failed", error);
    mtcLoginMessage.textContent = "Your PIN could not be checked. Please try again.";
  } finally {
    MTC.submitting = false;
    mtcContinue.disabled = false;
    mtcContinue.textContent = "Continue";
  }
}

function startMtcStage(stage) {
  MTC.stage = stage;
  MTC.index = 0;
  MTC.answers = [];

  if (stage === "practice") {
    MTC.questions = MTC.practice.slice();
  }

  showMtcQuestion();
}

async function beginLiveMtcCheck() {
  if (MTC.submitting || !MTC.sessionToken) return;

  MTC.submitting = true;
  mtcStartCheck.disabled = true;
  mtcStartCheck.textContent = "Preparing check…";

  try {
    const result = await mtcPost({
      action: "mtcStart",
      sessionToken: MTC.sessionToken
    });

    if (!result.success || !result.attemptId || !Array.isArray(result.questions) || result.questions.length !== 25) {
      throw new Error(result.error || "The check could not be started.");
    }

    MTC.attemptId = result.attemptId;
    MTC.stage = "check";
    MTC.index = 0;
    MTC.answers = [];
    MTC.questions = result.questions.map(q => ({
      a: Number(q.firstFactor),
      b: Number(q.secondFactor)
    }));

    showMtcQuestion();
  } catch (error) {
    console.error("MTC start failed", error);
    mtcStartCheck.disabled = false;
    mtcStartCheck.textContent = "Try again";
  } finally {
    MTC.submitting = false;
  }
}

function showMtcQuestion() {
  MTC.locked = false;
  const q = MTC.questions[MTC.index];

  mtcStageLabel.textContent = MTC.stage === "practice" ? "Practice" : "Check";
  mtcQuestionCount.textContent = `Question ${MTC.index + 1} of ${MTC.questions.length}`;
  mtcFact.textContent = `${q.a} × ${q.b} =`;
  mtcAnswer.value = "";
  mtcShow("mtcQuestion");
  mtcAnswer.focus();

  MTC.questionStartedAt = performance.now();

  mtcTimerBar.style.transition = "none";
  mtcTimerBar.style.width = "100%";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mtcTimerBar.style.transition = "width 6s linear";
    mtcTimerBar.style.width = "0%";
  }));

  clearTimeout(MTC.timer);
  MTC.timer = setTimeout(() => submitMtcAnswer(false), 6000);
}

function submitMtcAnswer(early = true) {
  if (MTC.locked) return;

  MTC.locked = true;
  clearTimeout(MTC.timer);

  const raw = mtcAnswer.value.trim();
  const elapsed = Math.max(0, Math.min(6000, Math.round(performance.now() - MTC.questionStartedAt)));

  MTC.answers.push({
    answer: raw,
    responseTimeMs: early ? elapsed : 6000
  });

  mtcShow("mtcPause");

  setTimeout(async () => {
    MTC.index++;

    if (MTC.index < MTC.questions.length) {
      showMtcQuestion();
      return;
    }

    if (MTC.stage === "practice") {
      mtcShow("mtcPracticeDone");
      return;
    }

    await finishLiveMtcCheck();
  }, 3000);
}

async function finishLiveMtcCheck() {
  if (MTC.submitting) return;

  MTC.submitting = true;

  try {
    const result = await mtcPost({
      action: "mtcSubmit",
      sessionToken: MTC.sessionToken,
      attemptId: MTC.attemptId,
      responses: MTC.answers
    });

    if (!result.success) {
      throw new Error(result.error || "The check could not be saved.");
    }

    // Do not show the score to pupils. The detailed result remains Google-side.
    MTC.answers = [];
    MTC.attemptId = "";
    mtcShow("mtcFinished");
  } catch (error) {
    console.error("MTC submit failed", error);
    // Keep the completed answers in memory so a transient network error
    // does not force the pupil to repeat the 25-question check.
    mtcShow("mtcFinished");
    const note = document.querySelector("#mtcFinished .mtc-prototype-note");
    if (note) note.textContent = "Your check could not be saved automatically. Please tell your teacher before leaving this page.";
  } finally {
    MTC.submitting = false;
  }
}

function addDigit(d) {
  if (MTC.locked) return;
  if (mtcAnswer.value.length < 3) mtcAnswer.value += d;
  mtcAnswer.focus();
}

const keypad = document.getElementById("mtcKeypad");
keypad.innerHTML = [1,2,3,4,5,6,7,8,9,"⌫",0].map(v =>
  `<button type="button" data-key="${v}" aria-label="${v === "⌫" ? "Delete" : v}">${v}</button>`
).join("");

keypad.addEventListener("click", e => {
  const key = e.target.dataset.key;
  if (key === undefined) return;
  if (key === "⌫") mtcAnswer.value = mtcAnswer.value.slice(0, -1);
  else addDigit(key);
});

mtcAnswer.addEventListener("input", () => {
  mtcAnswer.value = mtcAnswer.value.replace(/\D/g, "").slice(0, 3);
});

mtcAnswer.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitMtcAnswer(true);
  }
});

mtcPin.addEventListener("input", () => {
  mtcPin.value = mtcPin.value.replace(/\D/g, "").slice(0, 5);
});

mtcPin.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    loginMtcPupil();
  }
});

document.getElementById("mtcEnter").addEventListener("click", () => submitMtcAnswer(true));
mtcContinue.addEventListener("click", loginMtcPupil);
document.getElementById("mtcStartPractice").addEventListener("click", () => startMtcStage("practice"));
mtcStartCheck.addEventListener("click", beginLiveMtcCheck);

document.getElementById("mtcExit1").addEventListener("click", () => {
  resetMtcState();
  show(assessmentsView);
});

document.getElementById("mtcExit2").addEventListener("click", () => {
  resetMtcState();
  mtcShow("mtcSelect");
  setTimeout(() => mtcPin.focus(), 100);
});

document.getElementById("mtcFinishExit").addEventListener("click", () => {
  resetMtcState();
  show(assessmentsView);
});


document.getElementById("backBtn").addEventListener("click", () => show(yearsView));
document.getElementById("homeBtn").addEventListener("click", () => show(yearsView));
document.getElementById("teacherBtn").addEventListener("click", openTeacherArea);
document.getElementById("loginBackBtn").addEventListener("click", () => show(yearsView));
document.getElementById("teacherBackBtn").addEventListener("click", () => show(yearsView));
document.getElementById("logoutBtn").addEventListener("click", logoutTeacher);
document.getElementById("refreshDashboard").addEventListener("click", loadDashboard);
if (generateMtcReportButton) generateMtcReportButton.addEventListener("click", generateMtcClassReportFromDashboard);
dashboardTerm.addEventListener("change", renderDashboard);
loginForm.addEventListener("submit", handleLogin);
if (sltUnlockBtn) sltUnlockBtn.addEventListener("click", unlockSltControls);
if (sltLockBtn) sltLockBtn.addEventListener("click", () => lockSltControls());
if (sltPinInput) sltPinInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    unlockSltControls();
  }
});

renderYears();
loadPublicAssessmentStatus();
