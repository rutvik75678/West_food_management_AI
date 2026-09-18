/* ============================================================
   FOODWISE AI · 06-public.js — Landing, Login, Role-first Signup
   Signup: select role in dropdown → role-specific fields appear.
   ============================================================ */
const HOME = { ADMIN: 'dashboard', USER: 'dashboard', NGO: 'foodpool', BIZ: 'addfood', LOGISTICS: 'dashboard' };
const LANDLBL = { ADMIN: 'command center', USER: 'dashboard', NGO: 'Food Pool', BIZ: 'Add Food workspace', LOGISTICS: 'delivery map' };
function homeFor(r) { return HOME[r] || 'dashboard' }

/* save extra role fields (city, regId, capacity…) into the user record
   without touching auth.js — wraps the original signup() */
const _fwSignup = AUTH.signup.bind(AUTH);
AUTH.signup = function (o) {
  const r = _fwSignup(o);
  if (r && r.user && o.meta) { const us = AUTH.users(), u = us.find(x => x.id === r.user.id); if (u) { Object.assign(u, o.meta); AUTH.save(us) } }
  return r;
};

/* ---------- role-specific signup field definitions ---------- */
const SU_FIELDS = {
  USER: [
    { id: 'suName', l: 'Full name', ph: 'Your name', req: 1 },
    { id: 'suCity', l: 'City', ph: 'Delhi' }],
  NGO: [
    { id: 'suName', l: 'NGO / organisation name', ph: 'e.g. Helping Hands Foundation', req: 1 },
    { id: 'suReg', l: 'NGO registration / ID number', ph: 'e.g. NGO/DL/2019/0123456', req: 1 },
    { id: 'suCity', l: 'City / area of operation', ph: 'Delhi', req: 1 },
    { id: 'suCap', l: 'Daily meal capacity (meals)', ph: '100', type: 'number' }],
  BIZ: [
    { id: 'suName', l: 'Establishment name', ph: 'e.g. Grand Hotel Kitchen', req: 1 },
    { id: 'suType', l: 'Type of establishment', type: 'select', opts: ['Hotel', 'Restaurant', 'Mess / Canteen', 'Hospital', 'Caterer'], req: 1 },
    { id: 'suCity', l: 'City', ph: 'Delhi', req: 1 },
    { id: 'suFssai', l: 'FSSAI license number', ph: '12345678901234' }],
  LOGISTICS: [
    { id: 'suName', l: 'Company / fleet name', ph: 'e.g. GreenWheel Logistics', req: 1 },
    { id: 'suVeh', l: 'Vehicle type', type: 'select', opts: ['Bike', 'Auto', 'Van', 'Refrigerated van', 'Truck'], req: 1 },
    { id: 'suCap', l: 'Carrying capacity (kg)', ph: '150', type: 'number', req: 1 },
    { id: 'suCity', l: 'City', ph: 'Delhi', req: 1 }]
};
function suRoleUI() {
  const r = S._suRole || 'USER';
  const sel = $('#suRoleSel'); if (sel) sel.value = r;
  const host = $('#suRoleFields'); if (!host) return;
  host.innerHTML = SU_FIELDS[r].map(f => {
    if (f.type === 'select') return `<div class="field"><label>${f.l}</label><select id="${f.id}">${f.opts.map(o => `<option>${o}</option>`).join('')}</select></div>`;
    return `<div class="field"><label>${f.l}${f.req ? '' : ' <span class="faint">(optional)</span>'}</label><input id="${f.id}" type="${f.type || 'text'}" placeholder="${f.ph}" ${f.type === 'number' ? 'min="1" inputmode="numeric"' : ''}></div>`;
  }).join('');
}
function suRoleChange(v) { S._suRole = v; suRoleUI() }

/* ---------- landing ---------- */
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
/* ---------- LOGIN + ROLE-FIRST SIGNUP ---------- */
function renderLogin() {
  $('#copFab').style.display = 'none'; S._suRole = 'USER';
  $('#app').innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;padding:24px">
    <div style="width:480px;max-width:100%">
      <div class="brand" style="justify-content:center;margin-bottom:22px"><div class="bx">F</div><div>FOODWISE AI<small>SECURE ROLE-BASED ACCESS</small></div></div>
      <div class="card rise">
        <div class="authtabs"><button id="tabIn" class="on" onclick="authTab('in')">Sign in</button><button id="tabUp" onclick="authTab('up')">Create account</button></div>
        <div id="paneIn">
          <span class="kicker">Welcome back</span>
          <div class="field" style="margin-top:12px"><label>Email or mobile number</label><input id="liId" placeholder="you@gmail.com or 98XXXXXXXX"></div>
          <div class="field"><label>Password</label><input id="liPass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
          <div class="autherr" id="liErr"></div>
          <button class="btn btn-acc" style="width:100%;justify-content:center" onclick="doLogin()"><i data-lucide="log-in"></i> Sign in</button>
          <div class="hr"></div>
          <span class="kicker">Quick sign in · one click</span>
          <div class="demoquick">
            ${[['admin@foodwise.demo', 'shield', 'Sign in as Administrator'], ['kitchen@foodwise.demo', 'chef-hat', 'Sign in as Hotel / Mess'], ['ngo@foodwise.demo', 'heart-handshake', 'Sign in as NGO / Food Bank'], ['logistics@foodwise.demo', 'truck', 'Sign in as Delivery Partner']].map(d => `<button class="btn btn-sm" style="justify-content:space-between" onclick="quickLogin('${d[0]}')"><span><i data-lucide="${d[1]}"></i> ${d[2]}</span><span class="faint mono" style="font-size:9px">${d[0]}</span></button>`).join('')}
          </div>
          <p class="demo-note" style="margin-top:10px">Quick sign-in opens each role's workspace directly — Administrator gets full access.</p>
        </div>
        <div id="paneUp" style="display:none">
          <span class="kicker">Join the network — step 1: choose your role</span>
          <div class="field" style="margin-top:12px"><label>I am joining as</label>
            <select id="suRoleSel" onchange="suRoleChange(this.value)">
              <option value="USER">👤 Community User — list surplus food</option>
              <option value="NGO">❤️ NGO / Food Bank — accept & distribute food</option>
              <option value="BIZ">🏨 Hotel · Mess · Hospital — donate surplus</option>
              <option value="LOGISTICS">🚚 Delivery Partner — transport food</option>
            </select></div>
          <div class="hr" style="margin:10px 0"></div>
          <span class="kicker" id="suRoleLbl">Step 2: your details</span>
          <div style="margin-top:10px" id="suRoleFields"></div>
          <span class="kicker">Step 3: login & contact</span>
          <div style="margin-top:10px">
            <div class="field"><label>Gmail / email <span class="faint">(optional if phone given)</span></label><input id="suEmail" placeholder="you@gmail.com"></div>
            <div class="field"><label>Mobile number <span class="faint">(optional if email given)</span></label><input id="suPhone" placeholder="98XXXXXXXX" inputmode="numeric"></div>
            <div class="field"><label>Password · min 6 chars</label><input id="suPass" type="password" placeholder="••••••••"></div>
          </div>
          <div class="autherr" id="suErr"></div>
          <button class="btn btn-acc" style="width:100%;justify-content:center" onclick="doSignup()"><i data-lucide="user-plus"></i> Create my account</button>
          <p class="demo-note" style="margin-top:10px">Administrator accounts are provisioned by the system — not open for signup.</p>
        </div>
      </div>
      <p class="demo-note" style="text-align:center;margin-top:12px">DEMO AUTHENTICATION — credentials stored locally in your browser only.</p>
    </div></div>`;
  icons(); mountThemeBtn(); suRoleUI();
}
function authTab(w) {
  $('#paneIn').style.display = w === 'in' ? 'block' : 'none';
  $('#paneUp').style.display = w === 'up' ? 'block' : 'none';
  $('#tabIn').classList.toggle('on', w === 'in'); $('#tabUp').classList.toggle('on', w === 'up');
  if (w === 'up') suRoleUI();
}
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
  const role = S._suRole || 'USER';
  const email = $('#suEmail').value.trim().toLowerCase();
  const phone = ($('#suPhone').value || '').replace(/\D/g, ''), pass = $('#suPass').value;
  if (!email && !phone) return authErr('#suErr', 'Add an email OR a mobile number — at least one is required.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authErr('#suErr', 'That email address does not look valid.');
  if (phone && phone.length < 10) return authErr('#suErr', 'Mobile number must be 10 digits (you can include +91).');
  if (pass.length < 6) return authErr('#suErr', 'Password must be at least 6 characters.');
  const meta = {}; let name = '';
  for (const f of SU_FIELDS[role]) {
    const el = $('#' + f.id); if (!el) continue;
    const v = (el.value || '').trim();
    if (f.req && !v) return authErr('#suErr', '"' + f.l + '" is required for ' + ROLES[role].label + '.');
    if (f.type === 'number' && v && isNaN(+v)) return authErr('#suErr', '"' + f.l + '" must be a number.');
    meta[f.id.replace('su', '').toLowerCase()] = v;
    if (f.id === 'suName') name = v;
  }
  if (name.length < 3) return authErr('#suErr', 'Please enter your name / organisation name (min 3 characters).');
  const r = AUTH.signup({ name, email, phone, pass, role, org: name, meta });
  if (r.err) return authErr('#suErr', r.err);
  syncSessionUser();
  toast('Account created — welcome, ' + name + '! Joined as ' + ROLES[role].label + '.', 'ok');
  logAudit('New signup: ' + name + ' as ' + role + (meta.city ? ' · ' + meta.city : ''));
  location.hash = '#/app/' + homeFor(role);
}
function logout() { const n = S.user?.name; AUTH.logout(); S.user = null; toast(n ? 'Signed out. See you soon, ' + n + '.' : 'Signed out.'); location.hash = '#/login'; render() }
function quickLogin(id) { authTab('in'); $('#liId').value = id; $('#liPass').value = 'demo123'; doLogin() }
