const DATA = {
  "yearGroups": {
    "1": [
      [
        "Autumn 1",
        "Why is it so important to know where our food comes from?"
      ],
      [
        "Autumn 2",
        "What makes every person and family unique?"
      ],
      [
        "Spring 1",
        "How do inventors keep going when solving problems?"
      ],
      [
        "Spring 2",
        "How can we care for the world around us?"
      ],
      [
        "Summer 1",
        "How do people show courage?"
      ],
      [
        "Summer 2",
        "How can we make our local area an even better place?"
      ]
    ],
    "2": [
      [
        "Autumn 1",
        "How do our experiences shape who we become?"
      ],
      [
        "Autumn 2",
        "How does food connect people and culture?"
      ],
      [
        "Spring 1",
        "How did determination change Victorian Britain?"
      ],
      [
        "Spring 2",
        "How can learning about other cultures help us show kindness?"
      ],
      [
        "Summer 1",
        "How does exploring our world help us grow?"
      ],
      [
        "Summer 2",
        "How can learning from the past help us shape the future?"
      ]
    ],
    "3": [
      [
        "Autumn 1",
        "How has London's past shaped the city we know today?"
      ],
      [
        "Autumn 2",
        "How do journeys help us understand the world and each other?"
      ],
      [
        "Spring 1",
        "How did people survive and thrive in the Stone Age?"
      ],
      [
        "Spring 2",
        "How does water bring people together?"
      ],
      [
        "Summer 1",
        "How do people adapt to life in different climates?"
      ],
      [
        "Summer 2",
        "What can the achievements of Ancient Egypt inspire us to do?"
      ]
    ],
    "4": [
      [
        "Autumn 1",
        "Why is it our responsibility to care for the natural world?"
      ],
      [
        "Autumn 2",
        "Why should we protect the world's rainforests?"
      ],
      [
        "Spring 1",
        "How have people overcome challenges to build new lives?"
      ],
      [
        "Spring 2",
        "What can Ancient Greece teach us about living well together?"
      ],
      [
        "Summer 1",
        "How did the Romans change Britain?"
      ],
      [
        "Summer 2",
        "How can our food choices change the world?"
      ]
    ],
    "5": [
      [
        "Autumn 1",
        "How can understanding our planet help us make responsible choices?"
      ],
      [
        "Autumn 2",
        "How did the Anglo-Saxons shape the Britain we know today?"
      ],
      [
        "Spring 1",
        "What can animals teach us about survival and resilience?"
      ],
      [
        "Spring 2",
        "What can the Vikings teach us about kindness and community?"
      ],
      [
        "Summer 1",
        "How does exploring the unknown change what we know?"
      ],
      [
        "Summer 2",
        "What can we learn from the Tudors about power, ambition and change?"
      ]
    ],
    "6": [
      [
        "Autumn 1",
        "How can learning from history help us challenge injustice?"
      ],
      [
        "Autumn 2",
        "What makes people feel they belong?"
      ],
      [
        "Spring 1",
        "What can we learn from the resilience of those in World War 1?"
      ],
      [
        "Spring 2",
        "How can ordinary people make an extraordinary difference?"
      ],
      [
        "Summer 1",
        "How can ordinary people make an extraordinary difference?"
      ],
      [
        "Summer 2",
        "How can I become the person I aspire to be?"
      ]
    ]
  },
  "forms": {
    "6-Autumn 1": "https://docs.google.com/forms/d/e/1FAIpQLSchGMshv86yrDTVqOzHoRNx0nhR5ssNOdNy4jF8wHPwFedI3A/viewform?usp=share_link&ouid=102874721147473405086"
  }
};
const yearsView=document.getElementById("yearsView"),assessmentsView=document.getElementById("assessmentsView"),teacherView=document.getElementById("teacherView"),yearGrid=document.getElementById("yearGrid"),assessmentGrid=document.getElementById("assessmentGrid");
function show(view){[yearsView,assessmentsView,teacherView].forEach(v=>v.classList.remove("active"));view.classList.add("active");window.scrollTo({top:0,behavior:"smooth"});}
function renderYears(){yearGrid.innerHTML=Object.keys(DATA.yearGroups).map(year=>`<button class="year-card" data-year="${year}"><span>Choose year group</span><h2>Year ${year}</h2><b>View 6 assessments →</b></button>`).join("");document.querySelectorAll(".year-card").forEach(btn=>btn.addEventListener("click",()=>openYear(btn.dataset.year)));}
function openYear(year){document.getElementById("yearTitle").textContent=`Year ${year}`;document.getElementById("yearEyebrow").textContent=`Year ${year} · 2026–2027`;assessmentGrid.innerHTML=DATA.yearGroups[year].map(([term,question])=>{const key=`${year}-${term}`,url=DATA.forms[key];return `<article class="assessment-card"><span class="term">${term}</span><h2>${question}</h2>${url?`<span class="status live">Open now</span><a class="start" href="${url}" target="_blank" rel="noopener">Start assessment →</a>`:`<span class="status soon">Coming soon</span><span class="disabled">Assessment not yet open</span>`}</article>`}).join("");show(assessmentsView);}
document.getElementById("backBtn").addEventListener("click",()=>show(yearsView));document.getElementById("homeBtn").addEventListener("click",()=>show(yearsView));document.getElementById("teacherBtn").addEventListener("click",()=>show(teacherView));document.getElementById("teacherBackBtn").addEventListener("click",()=>show(yearsView));renderYears();