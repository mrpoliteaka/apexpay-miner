
const app = document.getElementById("app");

const state = {
  user: JSON.parse(localStorage.getItem("apexpay_user") || "null"),
  balance: Number(localStorage.getItem("apexpay_balance") || "0"),
  mined: Number(localStorage.getItem("apexpay_mined") || "0"),
  mining: localStorage.getItem("apexpay_mining") === "true",
  startedAt: Number(localStorage.getItem("apexpay_started") || "0"),
  history: JSON.parse(localStorage.getItem("apexpay_history") || "[]"),
  page: "home"
};

function save(){
  localStorage.setItem("apexpay_user", JSON.stringify(state.user));
  localStorage.setItem("apexpay_balance", String(state.balance));
  localStorage.setItem("apexpay_mined", String(state.mined));
  localStorage.setItem("apexpay_mining", String(state.mining));
  localStorage.setItem("apexpay_started", String(state.startedAt));
  localStorage.setItem("apexpay_history", JSON.stringify(state.history));
}

function money(n){ return "₦" + n.toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2}); }

function logo(){
  return `<div class="logo">AP</div>`;
}

function layout(content){
  return `<div class="shell">
    <header class="topbar"><div class="brand">ApexPay <span>Miner</span></div>
      ${state.user ? `<button class="linkbtn" onclick="logout()">Log out</button>` : ""}
    </header>
    <main class="container">${content}</main>
    ${state.user ? `<nav class="nav"><div class="nav-inner">
      <button class="${state.page==="home"?"active":""}" onclick="go('home')"><span class="icon">⌂</span>Home</button>
      <button class="${state.page==="mine"?"active":""}" onclick="go('mine')"><span class="icon">⛏</span>Mine</button>
      <button class="${state.page==="withdraw"?"active":""}" onclick="go('withdraw')"><span class="icon">⇩</span>Withdraw</button>
      <button class="${state.page==="profile"?"active":""}" onclick="go('profile')"><span class="icon">◉</span>Profile</button>
    </div></nav>` : ""}
  </div>`;
}

function render(){
  if(!state.user) return renderAuth();
  if(state.page==="mine") return renderMine();
  if(state.page==="withdraw") return renderWithdraw();
  if(state.page==="profile") return renderProfile();
  return renderHome();
}

function renderAuth(){
  app.innerHTML = `<div class="container">
    <section class="hero">${logo()}<h1>ApexPay Miner</h1>
      <p class="muted">A simple mining simulator for the ApexPay Miner prototype.</p>
    </section>
    <div class="card">
      <h2 id="authTitle">Create your account</h2>
      <p class="muted small">Demo mode: displayed earnings are simulated and are not withdrawable funds.</p>
      <form onsubmit="signup(event)">
        <div class="field"><label>Full name</label><input id="name" required placeholder="Your name"></div>
        <div class="field"><label>Email</label><input id="email" type="email" required placeholder="you@example.com"></div>
        <div class="field"><label>Password</label><input id="password" type="password" minlength="6" required placeholder="At least 6 characters"></div>
        <button class="btn btn-primary">Sign Up & Continue</button>
      </form>
      <p class="center small muted">Already have a demo account? <button class="linkbtn" onclick="loginDemo()">Log in</button></p>
    </div>
  </div>`;
}

function renderHome(){
  app.innerHTML = layout(`
    <section class="hero">${logo()}<h1>Welcome, ${escapeHtml(state.user.name)}</h1>
      <p class="muted">Track your simulated mining earnings from one simple dashboard.</p>
    </section>
    <div class="alert"><strong>Prototype notice:</strong> ApexPay Miner is currently a demo. Mining amounts shown here are simulated and cannot be withdrawn.</div>
    <div class="grid">
      <div class="stat"><div class="label">Current balance</div><div class="value">${money(state.balance)}</div></div>
      <div class="stat"><div class="label">Total mined</div><div class="value">${money(state.mined)}</div></div>
      <div class="stat"><div class="label">Mining status</div><div class="value">${state.mining?"Active":"Inactive"}</div></div>
      <div class="stat"><div class="label">Rate</div><div class="value">₦0.50/min</div></div>
    </div>
    <div class="card center">
      <h2>Start Mining</h2>
      <p class="muted">Mining adds a small simulated amount to your demo balance while this page is open.</p>
      <button class="btn btn-primary" onclick="go('mine')">${state.mining?"View Mining":"Start Mining"}</button>
    </div>
  `);
}

function renderMine(){
  const elapsed = state.mining ? Math.max(0, Math.floor((Date.now()-state.startedAt)/1000)) : 0;
  const progress = Math.min(100, (elapsed%60)/60*100);
  app.innerHTML = layout(`
    <div class="card center">
      <span class="status"><span class="dot"></span>${state.mining?"Mining active":"Mining inactive"}</span>
      <h1 style="margin-top:14px">Mining Center</h1>
      <p class="muted">Simulated rate: <strong>₦0.50 per minute</strong></p>
      <div class="mining-ring" style="--progress:${progress}%">
        <div class="ring-content"><strong>${state.mining?Math.floor(elapsed/60):0}</strong><span class="small muted">minutes</span></div>
      </div>
      <h2>${money(state.balance)}</h2>
      <p class="muted">Simulated balance</p>
      <button class="btn ${state.mining?"btn-danger":"btn-primary"}" onclick="toggleMining()">${state.mining?"Stop Mining":"Start Mining"}</button>
    </div>
    <div class="card">
      <h2>Mining history</h2>
      ${state.history.length ? `<div class="list">${state.history.slice().reverse().map(x=>`<div class="row"><span>${x.date}</span><strong>+${money(x.amount)}</strong></div>`).join("")}</div>` : `<p class="muted">No mining sessions yet.</p>`}
    </div>
  `);
}

function renderWithdraw(){
  app.innerHTML = layout(`
    <div class="card center">
      ${logo()}<h1>Withdraw</h1>
      <p class="muted">Current simulated balance: <strong>${money(state.balance)}</strong></p>
    </div>
    <div class="card">
      <h2>Withdrawal unavailable</h2>
      <p class="muted">Withdrawals are currently disabled in this prototype. No bank details, withdrawal codes, payments, or real-money transfers are collected or processed.</p>
      <button class="btn btn-disabled" disabled>WITHDRAWAL UNAVAILABLE</button>
    </div>
    <div class="card">
      <h2>Coming later</h2>
      <p class="muted small">A future production version would need a legitimate payment provider, secure transaction processing, identity/compliance controls, and clear terms before real withdrawals are enabled.</p>
    </div>
  `);
}

function renderProfile(){
  app.innerHTML = layout(`
    <div class="card center">${logo()}<h1>Profile</h1><p class="muted">Demo account</p></div>
    <div class="card">
      <div class="row"><span>Name</span><strong>${escapeHtml(state.user.name)}</strong></div>
      <div class="row"><span>Email</span><strong>${escapeHtml(state.user.email)}</strong></div>
      <div class="row"><span>Account mode</span><span class="badge">DEMO</span></div>
    </div>
  `);
}

function signup(e){
  e.preventDefault();
  state.user={name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim()};
  save(); state.page="home"; render();
}

function loginDemo(){
  const name=prompt("Demo account name","Apex User");
  if(!name) return;
  const email=prompt("Demo account email","user@example.com");
  if(!email) return;
  state.user={name,email}; save(); state.page="home"; render();
}

function logout(){
  state.user=null; state.mining=false; state.startedAt=0; save(); render();
}

function go(page){ state.page=page; render(); }

function toggleMining(){
  if(state.mining){
    const minutes=Math.floor((Date.now()-state.startedAt)/60000);
    if(minutes>0){
      const amount=minutes*0.50;
      state.balance+=amount; state.mined+=amount;
      state.history.push({amount,date:new Date().toLocaleString("en-NG")});
    }
    state.mining=false; state.startedAt=0;
  } else {
    state.mining=true; state.startedAt=Date.now();
  }
  save(); render();
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

setInterval(()=>{
  if(state.user && state.mining && state.page==="mine") renderMine();
},1000);

render();
