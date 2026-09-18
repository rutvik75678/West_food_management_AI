/* ============================================================
   FOODWISE AI · 06-public.js — Landing, Login, Signup, Logout
   Role-based redirect + clean auth UI (no demo buttons).
   ============================================================ */
const HOME = { ADMIN: 'dashboard', USER: 'dashboard', NGO: 'foodpool', BIZ: 'addfood', LOGISTICS: 'dashboard' };
const LANDLBL = { ADMIN: 'command center', USER: 'dashboard', NGO: 'Food Pool', BIZ: 'Add Food workspace', LOGISTICS: 'delivery map' };
function homeFor(r) { return HOME[r] || 'dashboard' }
function renderLanding() {
  $('#copFab').style.display = 'none';
  const dest = S.user ? '#/app/' + homeFor(S.user.role) : '#/login';
  $('#app').innerHTML = `<div class="landing">
  <div class="ltop"><div class="brand"><div class="bx">F</div><div>FOODWISE AI<small>SIH PROTOTYPE · DEMO MODE</small></div></div>
    <div style="display:flex;gap:10px"><button class="btn btn-sm" onclick="location.hash='#/login'">Sign in</button><button class="btn btn-sm btn-acc" onclick="demoOpen()">▶ Run AI Demo</button></div></div>
  <div class="hero">
    <div class="rise"><span class="kicker">AI-POWERED SMART FOOD WASTE MANAGEMENT · <b>PREDICT · PREVENT · DETECT · REDISTRIBUTE · SUSTAIN</b></span></div>
    <h1 class="rise" style="margin-top:16px">Turn food waste into <em>food intelligence.</em></h1>
    <p class="sub rise">An AI ecosystem that predicts demand, prevents overproduction, detects quality risks with computer vision, intelligently redistributes surplus to NGOs, optimizes logistics, and measures sustainability impact — as one connected chain, not isolated tools.</p>
    <div class="rise" style="display:flex;gap:12px;flex-wrap:wrap">
      <button class="btn btn-acc" onclick="location.hash='${dest}'">Launch Dashboard <i data-lucide="arrow-right"></i></button>
      <button class="btn" onclick="demoOpen()"><i data-lucide="play"></i> Watch AI Demo <span class="demo-note" style="margin-left:4px">~90 s</span></button>
    </div>
    <div class="pipe rise">${['PREDICT', 'PREVENT', 'DETECT', 'MATCH', 'OPTIMIZE', 'REDISTRIBUTE', 'MEASURE'].map((s, i) => `<span class="st" onclick="location.hash='${dest}'">${s}</span>${i < 6 ? '<span class="ar">↓</span>' : ''}`).join('')}</div>
    <div class="statline rise">
      <div><span class="kicker">Demo data · 90 days</span><div class="num" id="L1">0</div><span class="muted small">kg food saved</span></div>
      <div><span class="kicker">Demo data</span><div class="num" id="L2">0</div><span class="muted small">meals redistributed</span></div>
      <div><span class="kicker">Estimated impact</span><div class="num" id="L3">0</div><span class="muted small">t CO₂e avoided</span></div>
      <div><span class="kicker">Estimated impact</span><div class="num" id="L4">0</div><span class="muted small">litres water saved</span></div>
      <div><span class="kicker">Estimated impact</span><div class="num" id="L5">0</div><span class="muted small">₹ cost saved</span></div>
    </div>
    <p class="demo-note rise" style="margin-top:10px">All figures on this page are synthetic demonstration data — labelled “Estimated Impact”, not measured values.</p>
  </div>
  <div style="border-top:1px solid var(--line);padding:34px 48px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px;align-items:center">
    <span class="demo-note">FOODWISE AI · SMART INDIA HACKATHON PROTOTYPE · ALL DATA SYNTHETIC</span>
    <button class="btn btn-sm btn-acc" onclick="location.hash='${dest}'">Launch Dashboard</button>
  </div></div>`;
  icons(); reveal($('#app')); mountThemeBtn();
  countUp($('#L1'), S.impact.savedKg, { dur: 1400 }); countUp($('#L2'), S.impact.meals, { dur: 1400 });
  countUp($('#L3'), S.impact.co2T, { dur: 1400, fmt: v => v.toFixed(1) }); countUp($('#L4'), S.impact.waterL, { dur: 1400 });
  countUp($('#L5'), S.impact.money, { dur: 1400, fmt: INR });
}
/* ---------- LOGIN + SIGNUP (clean, no demo shortcuts) ---------- */
function renderLogin() {
  $('#copFab').style.display = 'none'; S._suRole = 'USER';
  $('#app').innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;padding:24px">
    <div style="width:460px;max-width:100%">
      <div class="brand" style="justify-content:center;margin-bottom:22px"><div class="bx">F</div><div>FOODWISE AI<small>SECURE ROLE-BASED ACCESS</small></div></div>
      <div class="card rise">
        <div class="authtabs"><button id="tabIn" class="on" onclick="authTab('in')">Sign in</button><button id="tabUp" onclick="authTab('up')">Create account</button></div>
        <div id="paneIn">
          <span class="kicker">Welcome back</span>
          <div class="field" style="margin-top:12px"><label>Email or mobile number</label><input id="liId" placeholder="you@gmail.com or 98XXXXXXXX"></div>
          <div class="field"><label>Password</label><input id="liPass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
          <div class="autherr" id="liErr"></div>
          <button class="btn btn-acc" style="width:100%;justify-content:center" onclick="doLogin()"><i data-lucide="log-in"></i> Sign in</button>
        </div>
        <div id="paneUp" style="display:none">
          <span class="kicker">Join the network — phone <b>or</b> Gmail</span>
          <div class="field" style="margin-top:12px"><label>Full name</label><input id="suName" placeholder="Your name"></div>
          <div class="field"><label>Gmail / email <span class="faint">(optional if phone given)</span></label><input id="suEmail" placeholder="you@gmail.com"></div>
          <div class="field"><label>Mobile number <span class="faint">(optional if email given)</span></label><input id="suPhone" placeholder="98XXXXXXXX" inputmode="numeric"></div>
          <div class="field"><label>Password · min 6 chars</label><input id="suPass" type="password" placeholder="••••••••"></div>
          <span class="kicker">I am joining as</span>
          <div class="role-grid">
            ${['USER', 'NGO', 'BIZ', 'LOGISTICS'].map(r => `<div class="role-card ${r === 'USER' ? 'sel' : ''}" id="rc_${r}" onclick="pickRole('${r}')"><div class="rc-t"><i data-lucide="${ROLES[r].icon}"></i>${ROLES[r].label}</div><div class="rc-d">${ROLES[r].desc}</div></div>`).join('')}
          </div>
          <div class="autherr" id="suErr"></div>
          <button class="btn btn-acc" style="width:100%;justify-content:center" onclick="doSignup()"><i data-lucide="user-plus"></i> Create my account</button>
          <p class="demo-note" style="margin-top:10px">Administrator accounts are provisioned by the system — not open for signup.</p>
        </div>
      </div>
      <p class="demo-note" style="text-align:center;margin-top:12px">DEMO AUTHENTICATION — credentials stored locally in your browser only.</p>
    </div></div>`;
  icons(); mountThemeBtn();
}
function authTab(w) {
  $('#paneIn').style.display = w === 'in' ? 'block' : 'none';
  $('#paneUp').style.display = w === 'up' ? 'block' : 'none';
  $('#tabIn').classList.toggle('on', w === 'in'); $('#tabUp').classList.toggle('on', w === 'up');
}
function pickRole(r) { S._suRole = r;['USER', 'NGO', 'BIZ', 'LOGISTICS'].forEach(x => $('#rc_' + x).classList.toggle('sel', x === r)) }
function authErr(id, m) { const e = $(id); e.textContent = m; e.style.display = 'block' }
function doLogin() {
  $('#liErr').style.display = 'none';
  const u = AUTH.login($('#liId').value, $('#liPass').value);
  if (!u) return authErr('#liErr', 'Invalid credentials. Check email/mobile and password. Tip: use your email, or your 10-digit mobile number (with or without +91).');
  syncSessionUser();
  const home = homeFor(u.role);
  toast('Welcome back, ' + u.name + ' — opening your ' + (LANDLBL[u.role] || 'workspace') + '.', 'ok');
  logAudit('Signed in: ' + u.name + ' (' + u.role + ') → ' + home);
  location.hash = '#/app/' + home;
}
function doSignup() {
  $('#suErr').style.display = 'none';
  const name = $('#suName').value.trim(), email = $('#suEmail').value.trim().toLowerCase();
  const phone = ($('#suPhone').value || '').replace(/\D/g, ''), pass = $('#suPass').value, role = S._suRole || 'USER';
  if (name.length < 3) return authErr('#suErr', 'Please enter your full name.');
  if (!email && !phone) return authErr('#suErr', 'Add an email OR a mobile number — at least one is required.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authErr('#suErr', 'That email address does not look valid.');
  if (phone && phone.length < 10) return authErr('#suErr', 'Mobile number must be 10 digits (you can include +91).');
  if (pass.length < 6) return authErr('#suErr', 'Password must be at least 6 characters.');
  const r = AUTH.signup({ name, email, phone, pass, role, org: name });
  if (r.err) return authErr('#suErr', r.err);
  syncSessionUser();
  toast('Account created — welcome, ' + name + '! Opening your ' + (LANDLBL[role] || 'workspace') + '.', 'ok');
  logAudit('New signup: ' + name + ' as ' + role);
  location.hash = '#/app/' + homeFor(role);
}
function logout() { const n = S.user?.name; AUTH.logout(); S.user = null; toast(n ? 'Signed out. See you soon, ' + n + '.' : 'Signed out.'); location.hash = '#/login'; render() }
