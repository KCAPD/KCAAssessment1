
const CONFIG = {
  year6FormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSchGMshv86yrDTVqOzHoRNx0nhR5ssNOdNy4jF8wHPwFedI3A/viewform?usp=share_link&ouid=102874721147473405086",
  dashboardApiUrl: ""
};

const yearGroups = [
  {year:1,live:false},{year:2,live:false},{year:3,live:false},
  {year:4,live:false},{year:5,live:false},{year:6,live:true}
];

const prototypeMatrix = [
  {subject:"Science",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"green"},
  {subject:"History",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"amber"},
  {subject:"Geography",y1:null,y2:null,y3:null,y4:null,y5:null,y6:null},
  {subject:"Art",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"green"},
  {subject:"Music",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"green"},
  {subject:"RE",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"amber"},
  {subject:"Computing",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"green"},
  {subject:"French",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"amber"},
  {subject:"PE",y1:null,y2:null,y3:null,y4:null,y5:null,y6:"green"}
];

function showView(viewId){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active-view"));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.remove("active"));
  document.getElementById(viewId).classList.add("active-view");
  const n=document.querySelector(`[data-view="${viewId}"]`); if(n)n.classList.add("active");
}

function renderYears(){
  document.getElementById("yearGrid").innerHTML=yearGroups.map(item=>{
    const isLive=item.live&&CONFIG.year6FormUrl;
    return `<article class="year-card">
      <span class="status ${item.live?"live":"soon"}">${item.live?"Pilot year group":"Not currently available"}</span>
      <h3>Year ${item.year}</h3>
      <p>${item.live?"Autumn 1 Big Question assessment.":"No live assessment is currently available for this year group."}</p>
      ${isLive?`<a href="${CONFIG.year6FormUrl}" target="_blank" rel="noopener">Open assessment →</a>`:item.live?`<p><strong>Add the Year 6 Form URL in app.js.</strong></p>`:""}
    </article>`;
  }).join("");
}

function ragCell(value,subject,year){
  if(!value)return "<td>—</td>";
  const labels={green:"Secure",amber:"Developing",red:"Continue working"};
  return `<td class="rag-cell" data-subject="${subject}" data-year="${year}"><span class="rag-dot ${value}"></span>${labels[value]}</td>`;
}

function renderMatrix(){
  document.querySelector("#subjectMatrix tbody").innerHTML=prototypeMatrix.map(row=>`
    <tr><td>${row.subject}</td>${ragCell(row.y1,row.subject,1)}${ragCell(row.y2,row.subject,2)}${ragCell(row.y3,row.subject,3)}
    ${ragCell(row.y4,row.subject,4)}${ragCell(row.y5,row.subject,5)}${ragCell(row.y6,row.subject,6)}</tr>`).join("");
  document.querySelectorAll(".rag-cell").forEach(cell=>cell.addEventListener("click",()=>{
    document.getElementById("drilldownText").textContent=
      `${cell.dataset.subject} • Year ${cell.dataset.year}: this will open live year group / class / pupil / question detail once Google data is connected.`;
  }));
}

document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
document.getElementById("previewDashboard").addEventListener("click",()=>{
  document.getElementById("teacherLogin").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
});
renderYears(); renderMatrix();
