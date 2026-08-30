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
const teacherLoginView = document.getElementById("teacherLoginView");
const mtcView = document.getElementById("mtcView");
const teacherView = document.getElementById("teacherView");
const yearGrid = document.getElementById("yearGrid");
const assessmentGrid = document.getElementById("assessmentGrid");
const dashboardBody = document.getElementById("dashboardBody");
const dashboardTerm = document.getElementById("dashboardTerm");
const dashboardStatus = document.getElementById("dashboardStatus");
const completionGrid = document.getElementById("completionGrid");
const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");

let dashboardData = null;

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

function openYear(year) {
  document.getElementById("yearTitle").textContent = `Year ${year}`;
  document.getElementById("yearEyebrow").textContent = `Year ${year} · 2026–2027`;

  const mtcCard = year === "4" ? `
    <article class="assessment-card mtc-card">
      <span class="term">Weekly practice</span>
      <h2>Multiplication Tables Check Practice</h2>
      <span class="status live">Prototype ready</span>
      <button class="start mtc-launch" id="launchMtc">Start MTC practice →</button>
    </article>` : "";

  assessmentGrid.innerHTML = mtcCard + DATA.yearGroups[year].map(([term, question]) => {
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
    const completedPupils = classes.flatMap(([className, data]) =>
      (data.pupils || []).filter(p => p.completed).map(p => ({...p, className}))
    );
    const missingPupils = classes.flatMap(([className, data]) =>
      (data.pupils || []).filter(p => !p.completed).map(p => ({...p, className}))
    );

    const classOptions = classes.map(([className]) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("");
    const done = completedPupils.length ? completedPupils.map(p => `<span class="initial-chip done" title="${escapeHtml(p.className)}">${escapeHtml(p.initials)} ✓</span>`).join("") : `<span class="empty-list">None yet</span>`;
    const missing = missingPupils.length ? missingPupils.map(p => `<span class="initial-chip missing" title="${escapeHtml(p.className)}">${escapeHtml(p.initials)}</span>`).join("") : `<span class="empty-list">Everyone has completed it ✓</span>`;

    return `<article class="completion-card" data-assessment="${escapeHtml(item.assessmentId)}">
      <div class="completion-card-top"><b>Year ${year}</b><span>${item.completed}/${item.expected} completed</span></div>
      <div class="completion-progress" aria-label="${pct}% complete"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>
      <strong class="completion-percent">${pct}%</strong>
      <details class="completion-details">
        <summary>View completion</summary>
        <div class="completion-list"><b>Completed</b><div>${done}</div></div>
        <div class="completion-list"><b>Not yet completed</b><div>${missing}</div></div>
      </details>
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

function renderDashboard() {
  renderCompletion();
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
// MTC PRACTICE · PHASE 1
// Pupil experience only. No data is saved.
// -------------------------
const MTC = {
  pupil: "",
  stage: "practice",
  index: 0,
  questions: [],
  answers: [],
  timer: null,
  locked: false,
  practice: [{a:2,b:4},{a:5,b:3},{a:10,b:6}]
};

const mtcScreens = [...document.querySelectorAll(".mtc-screen")];
const mtcPupil = document.getElementById("mtcPupil");
const mtcAnswer = document.getElementById("mtcAnswer");
const mtcFact = document.getElementById("mtcFact");
const mtcStageLabel = document.getElementById("mtcStageLabel");
const mtcQuestionCount = document.getElementById("mtcQuestionCount");
const mtcTimerBar = document.getElementById("mtcTimerBar");

function mtcShow(id) {
  mtcScreens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function openMtc() {
  clearTimeout(MTC.timer);
  MTC.pupil = "";
  MTC.answers = [];
  mtcPupil.value = "";
  mtcShow("mtcSelect");
  show(mtcView);
}

function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function makeMtcQuestions() {
  // Uses the published MTC table-representation limits: strong emphasis on 6,7,8,9,12.
  // This is a practice generator, not an official DfE form.
  const tableCounts = {2:1,3:2,4:2,5:1,6:3,7:3,8:3,9:3,10:1,11:2,12:4}; // total 25
  const questions=[];
  Object.entries(tableCounts).forEach(([a,count]) => {
    const multipliers=shuffle([2,3,4,5,6,7,8,9,10,11,12].slice());
    for(let i=0;i<count;i++) questions.push({a:Number(a),b:multipliers[i]});
  });
  return shuffle(questions);
}

function startMtcStage(stage) {
  MTC.stage = stage;
  MTC.index = 0;
  MTC.questions = stage === "practice" ? MTC.practice.slice() : makeMtcQuestions();
  showMtcQuestion();
}

function showMtcQuestion() {
  MTC.locked = false;
  const q=MTC.questions[MTC.index];
  mtcStageLabel.textContent = MTC.stage === "practice" ? "Practice" : "Check";
  mtcQuestionCount.textContent = `Question ${MTC.index+1} of ${MTC.questions.length}`;
  mtcFact.textContent = `${q.a} × ${q.b} =`;
  mtcAnswer.value="";
  mtcShow("mtcQuestion");
  mtcAnswer.focus();
  mtcTimerBar.style.transition="none";
  mtcTimerBar.style.width="100%";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    mtcTimerBar.style.transition="width 6s linear";
    mtcTimerBar.style.width="0%";
  }));
  clearTimeout(MTC.timer);
  MTC.timer=setTimeout(()=>submitMtcAnswer(false),6000);
}

function submitMtcAnswer(early=true) {
  if (MTC.locked) return;
  MTC.locked=true;
  clearTimeout(MTC.timer);
  const q=MTC.questions[MTC.index];
  const raw=mtcAnswer.value.trim();
  MTC.answers.push({stage:MTC.stage,a:q.a,b:q.b,answer:raw,correct:Number(raw)===q.a*q.b});
  mtcShow("mtcPause");
  setTimeout(()=>{
    MTC.index++;
    if(MTC.index < MTC.questions.length) showMtcQuestion();
    else if(MTC.stage === "practice") mtcShow("mtcPracticeDone");
    else mtcShow("mtcFinished");
  },3000);
}

function addDigit(d) {
  if (MTC.locked) return;
  if (mtcAnswer.value.length < 3) mtcAnswer.value += d;
  mtcAnswer.focus();
}

const keypad=document.getElementById("mtcKeypad");
keypad.innerHTML=[1,2,3,4,5,6,7,8,9,"⌫",0].map(v =>
  `<button type="button" data-key="${v}" aria-label="${v==='⌫'?'Delete':v}">${v}</button>`
).join("");
keypad.addEventListener("click",e=>{
  const key=e.target.dataset.key;
  if(key===undefined) return;
  if(key==="⌫") mtcAnswer.value=mtcAnswer.value.slice(0,-1); else addDigit(key);
});
mtcAnswer.addEventListener("input",()=>{mtcAnswer.value=mtcAnswer.value.replace(/\D/g,"").slice(0,3)});
mtcAnswer.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();submitMtcAnswer(true)}});
document.getElementById("mtcEnter").addEventListener("click",()=>submitMtcAnswer(true));
document.getElementById("mtcContinue").addEventListener("click",()=>{
  if(!mtcPupil.value){mtcPupil.focus();return;}
  MTC.pupil=mtcPupil.value;
  document.getElementById("mtcPupilName").textContent=MTC.pupil;
  mtcShow("mtcWelcome");
});
document.getElementById("mtcStartPractice").addEventListener("click",()=>startMtcStage("practice"));
document.getElementById("mtcStartCheck").addEventListener("click",()=>startMtcStage("check"));
document.getElementById("mtcExit1").addEventListener("click",()=>show(assessmentsView));
document.getElementById("mtcExit2").addEventListener("click",()=>mtcShow("mtcSelect"));
document.getElementById("mtcFinishExit").addEventListener("click",()=>show(assessmentsView));


document.getElementById("backBtn").addEventListener("click", () => show(yearsView));
document.getElementById("homeBtn").addEventListener("click", () => show(yearsView));
document.getElementById("teacherBtn").addEventListener("click", openTeacherArea);
document.getElementById("loginBackBtn").addEventListener("click", () => show(yearsView));
document.getElementById("teacherBackBtn").addEventListener("click", () => show(yearsView));
document.getElementById("logoutBtn").addEventListener("click", logoutTeacher);
document.getElementById("refreshDashboard").addEventListener("click", loadDashboard);
dashboardTerm.addEventListener("change", renderDashboard);
loginForm.addEventListener("submit", handleLogin);

renderYears();
