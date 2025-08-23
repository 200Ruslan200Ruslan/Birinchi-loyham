// ======== Yil =========
document.getElementById("year").textContent = new Date().getFullYear();

// ======== Auth modal (demo) =========
const authModal = document.getElementById("authModal");
document.getElementById("openAuth").onclick = ()=>authModal.setAttribute("aria-hidden","false");
authModal.addEventListener("click", (e)=>{ if(e.target.dataset.close!==undefined) authModal.setAttribute("aria-hidden","true"); });
document.getElementById("authSubmit").onclick = ()=>{ alert("Demo: kirish muvaffaqiyatli!"); authModal.setAttribute("aria-hidden","true"); };

// ======== Counter animatsiyasi =========
const counters = document.querySelectorAll(".num");
const runCounters = () => {
  counters.forEach(c=>{
    const target = +c.dataset.target;
    let val = 0;
    const step = Math.max(1, Math.round(target/50));
    const tick = () => {
      val += step;
      if(val >= target){ c.textContent = target; }
      else { c.textContent = val; requestAnimationFrame(tick); }
    };
    requestAnimationFrame(tick);
  });
};
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ runCounters(); io.disconnect(); }});
});
io.observe(document.querySelector(".counters"));

// ======== Slider (Reklama) =========
const slides = document.querySelector(".slides");
const slideElems = document.querySelectorAll(".slide");
let index = 0;
function updateSlider(){ slides.style.transform = `translateX(-${index * 100}%)`; }
document.querySelector(".prev").onclick = ()=>{ index = (index-1+slideElems.length)%slideElems.length; updateSlider(); };
document.querySelector(".next").onclick = ()=>{ index = (index+1)%slideElems.length; updateSlider(); };
setInterval(()=>{ index = (index+1)%slideElems.length; updateSlider(); }, 5000);

// ======== Particles (kazino vibe) =========
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let W,H,parts=[];
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener("resize", resize); resize();
function spawn(n=60){
  parts = new Array(n).fill().map(()=>({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*2+0.5,
    vx: (Math.random()-.5)*0.4, vy: (Math.random()-.5)*0.4,
    a: Math.random()*2*Math.PI,
    col: Math.random()<.5 ? "#2dc0ff" : "#36f1cd"
  }));
}
spawn();
function tick(){
  ctx.clearRect(0,0,W,H);
  parts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.a+=0.02;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    ctx.globalAlpha = 0.6 + 0.4*Math.sin(p.a);
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.col; ctx.fill();
  });
  requestAnimationFrame(tick);
}
tick();

// ======== Odds UI demo (portfolio kartalari) =========
const DATA = [
  { id:1, type:"Landing",   time:"18:30", name:"Biznes Landing", tag:"web", odds:{ one:1.85, x:3.2, two:4.1 } },
  { id:2, type:"Telegram",  time:"21:00", name:"Savdo Bot",      tag:"bot", odds:{ one:2.10, x:3.4, two:3.5 } },
  { id:3, type:"Web App",   time:"19:15", name:"Hisob-kitob App",tag:"web", odds:{ one:1.60, x:null, two:2.4 } },
  { id:4, type:"Portfolio", time:"16:00", name:"Shaxsiy Sayt",   tag:"web", odds:{ one:1.70, x:null, two:2.1 } },
  { id:5, type:"E-comm",    time:"23:30", name:"Mini Do‘kon",    tag:"web", odds:{ one:1.55, x:4.2, two:5.6 } },
];

const matchList = document.getElementById("matchList");
const search = document.getElementById("search");
const sortTime = document.getElementById("sortTime");
const sortFav = document.getElementById("sortFav");

let state = { q:"", sort:"time" };

search.addEventListener("input", e=>{ state.q = e.target.value.toLowerCase(); render(); });
sortTime.addEventListener("click", ()=>{ state.sort="time"; render(); });
sortFav.addEventListener("click", ()=>{ state.sort="fav"; render(); });

function makeCard(m){
  const card = document.createElement("div");
  card.className="match card";

  const left = document.createElement("div");
  left.innerHTML = `
    <div class="meta">
      <span class="badge">${m.time}</span>
      <span class="league">${m.type} • ${m.tag}</span>
    </div>
    <div class="teams">${m.name}</div>
  `;

  const right = document.createElement("div");
  right.className = "market";
  right.appendChild(makeOddBtn(m, "one", m.odds.one, "Opt-1"));
  if(m.odds.x) right.appendChild(makeOddBtn(m, "x", m.odds.x, "Opt-X"));
  right.appendChild(makeOddBtn(m, "two", m.odds.two, "Opt-2"));

  card.appendChild(left); card.appendChild(right);
  return card;
}

function makeOddBtn(m, key, val, label){
  const btn = document.createElement("button");
  btn.className="odd";
  btn.innerHTML = `<div class="val">${val?.toFixed(2)}</div><span class="lbl">${label}</span>`;
  btn.disabled = !val;
  btn.onclick = ()=>{
    confetti(btn);
    alert(`Demo: "${m.name}" uchun "${label}" tanlandi. Portfolioda bu joyga loyihaga havola qo‘yish mumkin.`);
  };
  // Ko‘rsatkichga "random tebranish" — jonli effekt
  if(val){
    setInterval(()=>{
      const n = (val + (Math.random()-.5)*0.06);
      btn.querySelector(".val").textContent = n.toFixed(2);
    }, 1800 + Math.random()*1200);
  }
  return btn;
}

function render(){
  let rows = DATA.filter(m=>{
    const blob = (m.type + " " + m.name + " " + m.tag).toLowerCase();
    return blob.includes(state.q);
  });
  if(state.sort==="time") rows = rows.sort((a,b)=> a.time.localeCompare(b.time));
  else rows = rows.sort((a,b)=> Math.min(a.odds.one, a.odds.two || 9, a.odds.x || 9) -
                                 Math.min(b.odds.one, b.odds.two || 9, b.odds.x || 9));
  matchList.innerHTML = "";
  rows.forEach(m=> matchList.appendChild(makeCard(m)));
}
render();

// ======== Kichik konfetti effekti =========
function confetti(el){
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2 + scrollY;
  for(let i=0;i<12;i++){
    const p = document.createElement("div");
    p.style.cssText = `
      position:absolute; top:${cy}px; left:${cx}px; width:6px; height:6px; border-radius:2px;
      background:${Math.random()<.5?"#2dc0ff":"#36f1cd"}; transform:translate(-50%,-50%);
      pointer-events:none; z-index:9999; box-shadow:0 0 10px rgba(45,192,255,.6);
    `;
    document.body.appendChild(p);
    const ang = Math.random()*Math.PI*2;
    const dist = 40 + Math.random()*60;
    const tx = cx + Math.cos(ang)*dist;
    const ty = cy + Math.sin(ang)*dist;
    p.animate([
      { transform:`translate(-50%,-50%)`, opacity:1 },
      { transform:`translate(${tx-cx-50}px, ${ty-cy-50}px)`, opacity:0 }
    ], { duration:600+Math.random()*400, easing:"cubic-bezier(.2,.7,.2,1)" })
    .onfinish = ()=> p.remove();
  }
}