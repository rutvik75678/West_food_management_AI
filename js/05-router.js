/* ============================================================
   FOODWISE AI · 05-router.js — RBAC router & app shell
   ============================================================ */
const PAGES = { dashboard: 'Dashboard', addfood: 'Add Surplus Food', foodpool: 'Food Pool', mylistings: 'My Listings & Tracking', forecast: 'Demand Forecast', surplus: 'Surplus & Waste', foodvision: 'FoodVision AI', inventory: 'Inventory & Shelf Life', redistribute: 'AI Redistribution', processing: 'Processing & Energy', iot: 'IoT Storage', impact: 'Impact & ESG', controlcenter: 'AI Control Center', lab: 'AI Model Lab' };
const NAV = [
  ['OVERVIEW', [['dashboard', 'Dashboard', 'layout-dashboard', '']]],
  ['MARKETPLACE', [['addfood', 'Add Surplus Food', 'package-plus', '+'], ['foodpool', 'Food Pool', 'layers', 'NGO'], ['mylistings', 'My Listings', 'clipboard-list', '']]],
  ['AI ENGINES', [['forecast', 'Demand Forecast', 'trending-up', '01'], ['surplus', 'Surplus & Waste', 'alert-triangle', '02·06'], ['foodvision', 'FoodVision AI', 'scan-eye', '03'], ['inventory', 'Inventory & Shelf Life', 'timer', '04·05']]],
  ['OPERATIONS', [['redistribute', 'AI Redistribution', 'route', '07·08'], ['processing', 'Processing & Energy', 'factory', '09·10'], ['iot', 'IoT Storage', 'router', 'IOT']]],
  ['INTELLIGENCE', [['impact', 'Impact & ESG', 'leaf', '11'], ['controlcenter', 'AI Control Center', 'cpu', 'ADMIN'], ['lab', 'AI Model Lab', 'flask-conical', 'ADMIN']]]
];
function nav(p) { location.hash = '#/app/' + p }
window.addEventListener('hashchange', render);
function render() {
  const h = location.hash || '#/';
  if (h.startsWith('#/app')) {
    if (!S.user) { location.hash = '#/login'; return }
    S.page = h.split('/')[2] || homeFor(S.user.role);
    renderApp();
  } else if (h === '#/login') { renderLogin() }
  else renderLanding();
  window.scrollTo(0, 0);
}
function navFor(role) {
  return NAV.map(([g, items]) => [g, items.filter(it => can(it[0]))]).filter(([, items]) => items.length);
}
function renderApp() {
  $('#copFab').style.display = 'grid';
  const u = S.user, R = ROLES[u.role];
  const items = navFor(u.role);
  $('#app').innerHTML = `<div class="shell">
  <aside class="side">
    <div class="brand"><div class="bx">F</div><div>FOODWISE AI<small>${R.label.toUpperCase()} VIEW</small></div></div>
    ${items.map(([g, its]) => `<div class="sgroup">${g}</div>` + its.map(([id, lb, ic, k]) => `<a class="sitem ${S.page === id ? 'on' : ''}" href="#/app/${id}"><i data-lucide="${ic}"></i><span>${lb}</span>${k ? `<span class="k">${k}</span>` : ''}</a>`).join('')).join('')}
    <div style="flex:1"></div>
    <div style="padding:10px"><span class="kicker">Run scenario</span><button class="btn btn-acc btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="demoOpen()"><i data-lucide="play"></i> Run AI Demo</button></div>
  </aside>
  <div class="main">
    <div class="topbar">
      <span class="ptitle">${PAGES[S.page] || 'Dashboard'}</span>
      <span class="badge ${u.role === 'ADMIN' ? 'acc' : 'dim'}" title="${R.desc}">${R.label}</span>
      <span class="demo-note" id="svcOnline">${u.role === 'ADMIN' ? 'FULL ACCESS ·' : '10 AI SERVICES ·'} ONLINE</span>
      <span class="sp"></span>
      <button class="btn btn-sm btn-acc" onclick="demoOpen()"><i data-lucide="play"></i> Run AI Demo</button>
      <button class="bellbtn" onclick="toggleBell()"><i data-lucide="bell"></i><span class="cnt" id="bellCnt"></span></button>
      <div class="alertpanel" id="alertPanel"></div>
      <button class="bellbtn" title="Sign out" onclick="logout()"><i data-lucide="log-out"></i></button>
      <div class="avatar">${u.name[0]}</div>
    </div>
    <div id="page"></div>
  </div></div>`;
  updateBell(); icons();
  if (!can(S.page)) { renderRestricted(); mountThemeBtn(); return }
  ({ dashboard: pgDashboard, addfood: pgAddFood, foodpool: pgFoodPool, mylistings: pgMyListings, forecast: pgForecast, surplus: pgSurplus, foodvision: pgVision, inventory: pgInventory, redistribute: pgRedistribute, processing: pgProcessing, iot: pgIoT, impact: pgImpact, controlcenter: pgControl, lab: pgLab }[S.page] || pgDashboard)();
  mountThemeBtn();
}
function renderRestricted() {
  $('#page').innerHTML = `<div class="card rise" style="text-align:center;padding:56px 24px;max-width:520px;margin:60px auto">
    <i data-lucide="lock" style="width:40px;height:40px;color:var(--red)"></i>
    <h2 style="font-family:var(--serif);margin:14px 0 6px">Access restricted</h2>
    <p class="muted small">Your role (<b style="color:var(--ink)">${ROLES[S.user.role].label}</b>) does not have permission for <b class="mono">${S.page}</b>.<br>Only the <b style="color:var(--acc)">Administrator</b> has full platform access.</p>
    <button class="btn btn-acc btn-sm" style="margin-top:16px" onclick="nav('dashboard')">Back to my dashboard</button></div>`;
  icons();
}
function toggleBell() {
  const p = $('#alertPanel');
  if (p.classList.contains('open')) { p.classList.remove('open'); return }
  p.innerHTML = `<span class="kicker" style="padding:8px 11px">Alert engine · intelligent alerts</span>` + S.alerts.slice(0, 8).map(a => `<div class="alitem"><span class="dot ${a.sev === 'HIGH' ? 'crit' : a.sev === 'MEDIUM' ? 'warn' : a.sev === 'SUCCESS' ? 'ok' : 'on'}" style="margin-top:5px"></span><div><div class="t">${a.t}</div><div class="s">${a.s}</div></div></div>`).join('');
  p.classList.add('open');
}
function updateBell() { const b = $('#bellCnt'); if (b) b.textContent = S.alerts.length }
document.addEventListener('click', e => { const p = $('#alertPanel'); if (p && p.classList.contains('open') && !e.target.closest('.bellbtn') && !e.target.closest('.alertpanel')) p.classList.remove('open') });
