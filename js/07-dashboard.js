/* ============================================================
   FOODWISE AI · 07-dashboard.js — role dashboards (5 roles)
   ============================================================ */
function pgDashboard() {
  const p = $('#page');
  ({ ADMIN: dashAdmin, USER: dashUser, NGO: dashNGO, BIZ: dashBiz, LOGISTICS: dashLogistics }[S.user.role] || dashUser)(p);
}
function kpiStrip() {
  const I = S.impact;
  const items = [
    ['Food Waste Prevented', N(I.preventedKg) + ' kg', '+6.2%', 'up', [42, 45, 44, 48, 52, 55, 58, 61]],
    ['Food Redistributed', N(I.savedKg) + ' kg', '+9.4%', 'up', [20, 26, 30, 38, 42, 50, 55, 62]],
    ['Meals Saved', N(I.meals), '+7.8%', 'up', [110, 130, 160, 190, 210, 240, 260, 310]],
    ['CO₂e Avoided (est.)', I.co2T.toFixed(1) + ' t', '+2.8 t total', 'up', [.4, .9, 1.3, 1.8, 2.1, 2.4, 2.6, 2.8]],
    ['Water Saved (est.)', N(I.waterL) + ' L', '+1,860 L', 'up', [3, 5, 8, 10, 13, 15, 17, 18.5]],
    ['Money Saved (est.)', INR(I.money), '+₹9,400', 'up', [15, 32, 55, 72, 94, 110, 128, 142]]];
  return `<div class="card pad0 rise"><div class="kpiStrip">${items.map(k => `<div><span class="kicker">${k[0]}</span><div class="num">${k[1]}</div><span class="delta ${k[3]}">▲ ${k[2]}</span><div class="spk" data-d="${k[4].join(',')}"></div></div>`).join('')}</div></div>`;
}
/* ---------- USER (community) ---------- */
function dashUser(p) {
  const mine = myListings(), active = mine.filter(l => l.status !== 'DELIVERED'), done = mine.filter(l => l.status === 'DELIVERED');
  p.innerHTML = `${pageHead('Community User · ' + S.user.name, 'Your food saves people, not bins.', 'List any surplus food you have, track where it goes, and watch your personal impact grow.')}
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr">
    ${[['Active listings', active.length, 'package-open'], ['Donations delivered', done.length, 'check-circle-2'], ['Meals contributed (est.)', N(Math.round(done.reduce((a, l) => a + l.kg, 0) * 2.5)), 'utensils']].map(k => `<div class="card rise"><i data-lucide="${k[2]}" style="color:var(--acc)"></i><div class="num" style="font-size:24px;margin:6px 0 2px">${k[1]}</div><span class="kicker">${k[0]}</span></div>`).join('')}
  </div>
  <div class="grid" style="grid-template-columns:1.3fr 1fr;margin-top:16px">
    <div class="card rise" style="border-color:var(--acc-border)">
      <div class="card-h"><div><span class="kicker">QUICK ACTION</span><h3>Have food that would go to waste?</h3></div></div>
      <p class="small muted">List it in under a minute. NGOs nearby get alerted instantly, an AI quality score is attached, and you can track every step until delivery.</p>
      <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-acc" onclick="nav('addfood')"><i data-lucide="package-plus"></i> List surplus food</button>
        <button class="btn" onclick="nav('mylistings')"><i data-lucide="clipboard-list"></i> Track my food</button>
        <button class="btn" onclick="nav('foodvision')"><i data-lucide="scan-eye"></i> Check quality first</button>
      </div>
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">GROW YOUR IMPACT</span><h3>Join the network</h3></div><span class="badge dim">instant · demo</span></div>
      <div class="joincard" style="margin-bottom:10px"><div><b class="small">Become an NGO / Food Bank</b><div class="faint small">Accept food requests in your area</div></div><button class="btn btn-sm" onclick="joinAs('NGO')"><i data-lucide="heart-handshake"></i> Join</button></div>
      <div class="joincard"><div><b class="small">Become a Delivery Partner</b><div class="faint small">Pick up & deliver with optimized routes</div></div><button class="btn btn-sm" onclick="joinAs('LOGISTICS')"><i data-lucide="truck"></i> Join</button></div>
      <p class="demo-note" style="margin-top:10px">Demo approves instantly. Production flow: document verification → admin approval.</p>
    </div>
  </div>
  <div class="card rise" style="margin-top:16px"><div class="card-h"><span class="kicker">MY RECENT LISTINGS</span><button class="btn btn-sm btn-ghost" onclick="nav('mylistings')">View all</button></div>
    ${mine.length ? mine.slice(0, 3).map(l => `<div class="lstcard ${l.risk === 'CRITICAL' ? 'hot' : ''}"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><b>${l.food}</b> <span class="tag">${l.id}</span><div class="faint small">${l.qty} · ${l.loc} · ${l.window}</div></div><div style="text-align:right">${lBadge(l.status)}<div style="margin-top:5px">${riskBadge(l.risk)}</div></div></div>${statusDots(l.status)}</div>`).join('') : '<p class="muted small">No listings yet — list your first surplus above.</p>'}
  </div>`;
  icons(); reveal(p);
  $$('.spk').forEach(el => spark(el, el.dataset.d.split(',').map(Number), C.acc, 26));
}
function joinAs(role) {
  const isNgo = role === 'NGO';
  openModal(isNgo ? 'Join as NGO / Food Bank' : 'Join as Delivery Partner',
    `<div class="field"><label>${isNgo ? 'Organisation name' : 'Fleet / your name'}</label><input id="jOrg" value="${S.user.name}"></div>
    <div class="field"><label>City / area</label><input id="jCity" placeholder="Delhi"></div>
    ${isNgo ? '<div class="field"><label>Daily capacity (meals)</label><input id="jCap" type="number" value="100"></div>' : '<div class="field"><label>Vehicle & capacity</label><input id="jVeh" placeholder="Bike · 30 kg"></div>'}
    <p class="demo-note">Demo mode: role upgrades are approved instantly.</p>
    <button class="btn btn-acc" style="width:100%;justify-content:center;margin-top:6px" onclick="confirmJoin('${role}')"><i data-lucide="badge-check"></i> Confirm & switch role</button>`);
}
function confirmJoin(role) {
  const org = ($('#jOrg')?.value || S.user.name).trim();
  AUTH.upgradeRole(S.user.id, role, { org }); syncSessionUser(); closeModal();
  logAudit('Role upgrade: ' + S.user.name + ' → ' + role); toast('You are now ' + ROLES[role].label + '. Dashboard updated.', 'ok');
  addAlert('SUCCESS', 'New ' + ROLES[role].label + ' joined', org + ' · verified (demo)', 'badge-check'); renderApp();
}
/* ---------- BIZ (hotel / mess / hospital) ---------- */
function dashBiz(p) {
  const d = S.f7[0], rec = AI.demand(0), mine = myListings(), active = mine.filter(l => l.status !== 'DELIVERED');
  p.innerHTML = `
  ${pageHead('Hotel · Mess · Hospital · ' + S.user.org, 'Good morning. Here is today\'s food intelligence.', 'Add surplus, let AI match NGOs and delivery partners, and cut your kitchen waste with forecasts.', '<button class="btn btn-acc btn-sm" onclick="nav(\'addfood\')"><i data-lucide="package-plus"></i> Add surplus food</button>')}
  ${kpiStrip()}
  <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:16px" id="rowAI"></div>
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;margin-top:16px" id="rowCharts"></div>
  <div class="grid" style="grid-template-columns:1.4fr 1fr;margin-top:16px" id="rowRecs"></div>`;
  $('#rowAI').innerHTML = `
  <div class="card rise">
    <div class="card-h"><div><span class="kicker">AI MODULE 01 · <b>TODAY'S DEMAND PREDICTION</b> · DEMO MODEL</span><h3 style="font-size:22px"><span class="num" style="font-size:30px;color:var(--acc)">${d.v}</span> <span class="muted small">meals expected tomorrow (${d.d})</span></h3></div>${confPill(d.c)}</div>
    <div class="hr"></div>
    <div style="display:flex;gap:26px;flex-wrap:wrap">
      <div><span class="kicker">Recommended production</span><div class="num" style="font-size:21px">${rec.rec} meals</div></div>
      <div><span class="kicker">Expected surplus</span><div class="num" style="font-size:21px">20 meals</div></div>
      <div><span class="kicker">Active surplus listings</span><div class="num" style="font-size:21px;color:var(--teal)">${active.length}</div></div>
      <div style="flex:1;min-width:220px"><span class="kicker">✦ AI insight</span><p class="small muted" style="margin-top:4px">Demand is predicted to rise <b style="color:var(--ink)">+8.1%</b> — historical ${d.d}s run hot and 2 events are registered. Surplus, if any, will auto-notify nearby NGOs.</p></div>
    </div>
    <details class="expandable" style="margin-top:12px"><summary>View AI reasoning</summary>
      <div style="margin-top:10px">${factorBars([{ n: 'Day-of-week effect', p: 38 }, { n: 'Expected attendance (1,000)', p: 27 }, { n: 'Event calendar', p: 17 }, { n: 'Weather (24°C)', p: 12 }, { n: 'Recent trend', p: 6 }])}</div></details>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">CONNECTED NETWORK</span><h3>NGOs & delivery partners</h3></div></div>
      ${S.ngos.slice(0, 2).map(n => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)" class="small"><span class="muted"><span class="dot ok" style="margin-right:7px"></span>${n.name}</span><span class="mono faint">${n.d} km</span></div>`).join('')}
      ${S.partners.slice(0, 2).map(n => `<div style="display:flex;justify-content:space-between;padding:8px 0" class="small"><span class="muted"><span class="dot on" style="margin-right:7px"></span>${n.name}</span><span class="mono faint">${n.eta}</span></div>`).join('')}
      <button class="btn btn-sm" style="margin-top:10px;width:100%;justify-content:center" onclick="nav('redistribute')"><i data-lucide="route"></i> Open AI redistribution</button>
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">AI MODULE 05 · HIGHEST WASTE RISK</span><h3>${S.inv[0].name}</h3></div>${riskBadge(S.inv[0].risk)}</div>
      <p class="small muted">Batch <b class="mono" style="color:var(--ink)">${S.inv[0].id}</b> · shelf life <b class="mono" style="color:var(--red)" data-cd="${S.inv[0].ts}">--:--:--</b></p>
      <p class="small" style="margin-top:8px;color:var(--amber)">✦ ${S.inv[0].note}</p>
      <button class="btn btn-sm" style="margin-top:12px" onclick="nav('addfood')"><i data-lucide="package-plus"></i> List for redistribution</button>
    </div>
  </div>`;
  $('#rowCharts').innerHTML = `
    <div class="card rise"><div class="card-h"><span class="kicker">DEMAND VS PRODUCTION</span><span class="tag">14 days</span></div><div id="chDP" data-h="180"></div></div>
    <div class="card rise"><div class="card-h"><span class="kicker">WASTE TREND (KG)</span><span class="tag">10 days</span></div><div id="chWT" data-h="180"></div></div>
    <div class="card rise"><div class="card-h"><span class="kicker">REDISTRIBUTED (KG/WEEK)</span><span class="tag">7 weeks</span></div><div id="chRD" data-h="180"></div></div>`;
  const onRecs = S.recs.filter(r => r.on);
  $('#rowRecs').innerHTML = `
    <div class="card rise"><div class="card-h"><div><span class="kicker">AI RECOMMENDATIONS</span><h3>${onRecs.filter(r => !r.applied).length} actions recommended today</h3></div><span class="ai-chip">auto-generated</span></div>
      ${onRecs.map(r => `<div class="frow" style="grid-template-columns:auto 1fr auto;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)">
        <i data-lucide="${r.icon}" style="color:var(--acc)"></i>
        <div><div style="font-weight:600;font-size:13px">${r.t} ${r.applied ? '<span class="badge ok">APPLIED</span>' : ''}</div><div class="small faint">${r.s}</div></div>
        ${r.applied ? '<span class="tag">done</span>' : `<button class="btn btn-sm" onclick="applyRec('${r.id}')">Accept</button>`}
      </div>`).join('')}
    </div>
    <div class="card rise"><div class="card-h"><span class="kicker">SUSTAINABILITY IMPACT · 90 DAYS</span><span class="demo-note">ESTIMATED · DEMO DATA</span></div><div id="chIMP" data-h="150"></div></div>`;
  icons(); reveal(p);
  chart($('#chDP'), { labels: [...Array(15).fill(''), ...S.f7.map(f => f.d)], series: [{ data: [...S.hist, null, null, null, null, null, null, null], name: 'served', color: C.ink2, fill: hexA(C.ink2, .06) }, { data: [...Array(14).fill(null), S.hist[14], ...S.f7.map(f => f.v)], name: 'forecast', color: C.acc, pts: true }], band: { lo: [...Array(15).fill(null), ...S.f7.map(f => AI.demand(S.f7.indexOf(f)).lo)], hi: [...Array(15).fill(null), ...S.f7.map(f => AI.demand(S.f7.indexOf(f)).hi)] }, splitAt: 15, splitLbl: 'forecast →', tipFmt: Math.round });
  chart($('#chWT'), { labels: ['-9d', '', '', '', '', '', '', '', '', 'today'], series: [{ data: S.wasteTrend, color: C.amber, fill: hexA(C.amber, .1), pts: true }], tipFmt: Math.round, min: 0 });
  chart($('#chRD'), { labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], bars: { data: S.redisTrend, color: C.teal }, tipFmt: Math.round });
  chart($('#chIMP'), { labels: ['D-30', '', '', '', 'D-15', '', '', '', 'today'], series: [{ data: [120, 210, 340, 430, 520, 640, 760, 880, 1010, 1120, 1240], color: C.teal, fill: hexA(C.teal, .1) }], tipFmt: Math.round });
  $$('.spk').forEach(el => spark(el, el.dataset.d.split(',').map(Number), C.acc, 26));
}
function applyRec(id) {
  const r = S.recs.find(x => x.id === id); if (!r || r.applied) return; r.applied = true;
  if (id === 'rice') { S.waste.kg = S.waste.afterKg; toast('Production plan updated — rice −18 kg. Waste forecast now 31 kg.', 'ok') }
  if (id === 'milk') { toast('Milk batch M-102 added to redistribution queue.', 'ok') }
  if (id === 'coldB') { toast('Maintenance ticket created for Cold Storage B.', 'ok') }
  logAudit('AI recommendation accepted: ' + r.t); addAlert('INFO', 'Recommendation applied: ' + r.t, 'by ' + S.user.name, 'check-circle-2'); renderApp()
}
/* ---------- NGO ---------- */
function dashNGO(p) {
  const avail = S.listings.filter(l => l.status === 'LISTED'), mine = S.listings.filter(l => l.ngo === S.user.org && l.status !== 'LISTED');
  p.innerHTML = `${pageHead('NGO · ' + S.user.org, 'Food that needs you — ranked by risk.', 'Available surplus near you with AI risk scores. Accept a request, connect a delivery partner, feed people.')}
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr">
    ${[['Available requests', avail.length, 'bell-ring'], ['Accepted / in progress', mine.filter(l => l.status !== 'DELIVERED').length, 'heart-handshake'], ['Delivered (all time)', mine.filter(l => l.status === 'DELIVERED').length + 2, 'check-circle-2']].map(k => `<div class="card rise"><i data-lucide="${k[2]}" style="color:var(--acc)"></i><div class="num" style="font-size:24px;margin:6px 0 2px">${k[1]}</div><span class="kicker">${k[0]}</span></div>`).join('')}
  </div>
  <div class="grid" style="grid-template-columns:1.4fr 1fr;margin-top:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">AVAILABLE FOOD · WITH RISK</span><h3>Open requests near you</h3></div><button class="btn btn-sm" onclick="nav('foodpool')">Open full pool</button></div>
      ${avail.length ? avail.map(l => `<div class="lstcard ${l.risk === 'CRITICAL' ? 'hot' : ''}">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <div><b>${l.food}</b> <span class="tag">${l.id}</span><div class="faint small">${l.by} · ${l.qty} · ${l.loc}</div><div class="faint small mono">Pickup ${l.window} · listed ${Math.max(1, Math.round((now() - l.ts) / 6e4))} min ago</div></div>
          <div style="text-align:right">${riskBadge(l.risk)}<div class="faint small mono" style="margin-top:5px">freshness ${l.fresh}%</div></div>
        </div>
        <button class="btn btn-sm btn-acc" style="margin-top:10px" onclick="acceptListing('${l.id}')"><i data-lucide="hand-heart"></i> Accept request</button>
      </div>`).join('') : '<p class="muted small">No open requests right now — check the pool page.</p>'}
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card rise"><div class="card-h"><div><span class="kicker">DELIVERY PARTNERS</span><h3>Connect & dispatch</h3></div></div>
        ${S.partners.map(pt => `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><div><b class="small">${pt.name}</b><div class="faint small mono">ETA ${pt.eta} · ${pt.cap} · reliability ${pt.rel}%</div></div><span class="badge ok">AVAILABLE</span></div>`).join('')}
        <p class="demo-note" style="margin-top:8px">Partners are auto-suggested when you accept food — choose per delivery.</p>
      </div>
      <div class="card rise"><div class="card-h"><div><span class="kicker">MY ACCEPTED</span><h3>In progress</h3></div></div>
        ${mine.length ? mine.map(l => `<div style="padding:9px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between"><b class="small">${l.food}</b>${lBadge(l.status)}</div><div class="faint small">${l.qty} · partner: ${l.partner || '—'}</div>${statusDots(l.status)}</div>`).join('') : '<p class="muted small">Nothing in progress. Accept a request to start.</p>'}
      </div>
    </div>
  </div>`;
  icons(); reveal(p);
}
function acceptListing(id) {
  const l = S.listings.find(x => x.id === id); if (!l || l.status !== 'LISTED') return;
  advanceListing(id, 'CLAIMED', { ngo: S.user.org })
}
/* ---------- LOGISTICS ---------- */
function dashLogistics(p) {
  const tasks = myListings().filter(l => ['ASSIGNED', 'PICKED'].includes(l.status));
  p.innerHTML = `${pageHead('Delivery Partner · ' + S.user.org, 'Every kilometre, optimized.', 'Your assigned pickups with AI routes — mark progress as you deliver.')}
  <div class="grid" style="grid-template-columns:1.5fr 1fr">
  <div class="card rise"><div class="card-h"><div><span class="kicker">AI ROUTE OPTIMIZATION · LIVE</span><h3>Pickup EV-07</h3></div><span class="ai-chip">optimized</span></div>${routeMap(true)}
    <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:14px">
      <div><span class="kicker">Original route</span><div class="num" style="font-size:19px">${S.route.orig} km</div></div>
      <div><span class="kicker">AI optimized</span><div class="num" style="font-size:19px;color:var(--acc)">${S.route.opt} km</div></div>
      <div><span class="kicker">Reduction</span><div class="num" style="font-size:19px;color:var(--teal)">23.6%</div></div>
      <div><span class="kicker">ETA</span><div class="num" style="font-size:19px">${S.route.eta} min</div></div>
      <div><span class="kicker">CO₂ avoided (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${S.route.co2} kg</div></div>
    </div></div>
  <div class="card rise"><div class="card-h"><div><span class="kicker">MY DELIVERY TASKS</span><h3>${tasks.length} active</h3></div></div>
    ${tasks.length ? tasks.map(l => `<div class="lstcard"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div><b class="small">${l.food}</b><div class="faint small">${l.by} → ${l.ngo} · ${l.qty}</div></div>${lBadge(l.status)}</div>${statusDots(l.status)}
      <div style="display:flex;gap:8px;margin-top:10px">${l.status === 'ASSIGNED' ? `<button class="btn btn-sm btn-acc" onclick="advanceListing('${l.id}','PICKED')">Mark picked up</button>` : `<button class="btn btn-sm btn-acc" onclick="advanceListing('${l.id}','DELIVERED')">Mark delivered</button>`}<button class="btn btn-sm" onclick="nav('redistribute')">View route</button></div></div>`).join('') : '<p class="muted small">No assigned tasks. NGOs connect partners per delivery — you\'ll appear there.</p>'}
    <div class="hr"></div><span class="kicker">Fleet</span>
    <div style="display:flex;justify-content:space-between" class="small"><span class="muted">EV-07 · 150 kg</span><span class="badge ok">ON ROUTE</span></div>
    <div style="display:flex;justify-content:space-between;margin-top:6px" class="small"><span class="muted">EV-02 · 300 kg</span><span class="badge dim">IDLE</span></div>
  </div></div>`;
  icons(); reveal(p);
}
/* ---------- ADMIN (full access · complete) ---------- */
function dashAdmin(p) {
  const us = AUTH.users();
  p.innerHTML = `${pageHead('Administrator · ' + S.user.name, 'Full platform command center.', 'Complete ecosystem visibility: users, live listings, AI services, audit trail — admin-only access.', '<button class="btn btn-acc btn-sm" onclick="nav(\'controlcenter\')"><i data-lucide="cpu"></i> AI Control Center</button>')}
  <div class="card rise" style="border-color:var(--acc-border);display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap"><span class="ai-chip">FULL ACCESS</span><span class="small muted">You can open all 14 pages including AI Control Center and Model Lab. Other roles see only their permitted modules.</span><span style="flex:1"></span><span class="mono small faint">${us.length} accounts · ${S.listings.length} listings</span></div>
  ${kpiStrip()}
  <div class="grid" style="grid-template-columns:1.5fr 1fr;margin-top:16px">
    <div class="card rise"><div class="card-h"><span class="kicker">ECOSYSTEM MAP · LIVE FLOWS</span><span class="badge ok">SYNTHETIC · DEMO</span></div>${ecoMap()}</div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">NETWORK STATUS</span><h3>Ecosystem</h3></div></div>
      ${[['Institutions / BIZ', us.filter(u => u.role === 'BIZ').length, 'chef-hat'], ['NGOs', us.filter(u => u.role === 'NGO').length, 'heart-handshake'], ['Delivery partners', us.filter(u => u.role === 'LOGISTICS').length, 'truck'], ['Community users', us.filter(u => u.role === 'USER').length, 'user'], ['Active listings', S.listings.filter(l => l.status !== 'DELIVERED').length, 'package-open'], ['Delivered listings', S.listings.filter(l => l.status === 'DELIVERED').length, 'check-circle-2']].map(r => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)"><span class="muted small"><i data-lucide="${r[2]}"></i> ${r[0]}</span><b class="num">${r[1]}</b></div>`).join('')}
      <div class="hr"></div><span class="kicker">AI SERVICES · ALL ONLINE</span>
      ${S.services.map(s => `<div style="display:flex;justify-content:space-between;padding:6px 0" class="small"><span class="muted"><span class="dot on" style="margin-right:7px"></span>${s.name}</span><span class="mono faint">${s.conf}% · ${N(s.count)}</span></div>`).join('')}
    </div>
  </div>
  <div class="card rise" style="margin-top:16px"><div class="card-h"><div><span class="kicker">USER MANAGEMENT · ADMIN ONLY</span><h3>${us.length} registered accounts</h3></div><span class="badge acc">RBAC</span></div>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Name</th><th>Role</th><th>Contact</th><th>Organisation</th><th>Joined</th></tr></thead><tbody>
    ${us.map(u => `<tr><td style="font-weight:600">${u.name}</td><td><span class="badge ${u.role === 'ADMIN' ? 'acc' : 'dim'}">${(ROLES[u.role] || { label: u.role }).label}</span></td><td class="mono small muted">${u.email || u.phone || '—'}</td><td class="muted small">${u.org || '—'}</td><td class="mono small faint">${new Date(u.joined).toLocaleDateString('en-IN')}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="demo-note" style="margin-top:8px">New signups appear here instantly. Role upgrades by community users (join NGO / partner) are logged in the audit trail below.</p>
  </div>
  <div class="grid" style="grid-template-columns:1.3fr 1fr;margin-top:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">LIVE LISTINGS · ALL USERS</span><h3>Marketplace tracker</h3></div><button class="btn btn-sm" onclick="nav('foodpool')">Open pool</button></div>
      ${S.listings.slice(0, 4).map(l => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div><b class="small">${l.food}</b> <span class="tag">${l.id}</span><div class="faint small">${l.by} → ${l.ngo || 'awaiting NGO'} · ${l.qty}</div></div><div style="text-align:right">${lBadge(l.status)}<div style="margin-top:4px">${riskBadge(l.risk)}</div></div></div>${statusDots(l.status)}</div>`).join('')}
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">GOVERNANCE · AUDIT LOG</span><h3>${S.audit.length} entries</h3></div><span class="badge dim">append-only</span></div>
      ${S.audit.slice(0, 6).map(a => `<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)"><span class="dot ok" style="margin-top:6px"></span><div><div class="small">${a.a}</div><div class="faint mono" style="font-size:10px">${a.t} · ${new Date(a.ts).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></div></div>`).join('')}
    </div>
  </div>
  <div class="card rise" style="margin-top:16px"><div class="card-h"><span class="kicker">ORGANIZATIONS</span><span class="tag">demo registry</span></div>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Organization</th><th>Type</th><th>City</th><th>Status</th></tr></thead><tbody>
    ${[['Campus Kitchen · IIT-area', 'BIZ', 'Delhi', 'ACTIVE'], ['City General Hospital', 'BIZ', 'Delhi', 'ACTIVE'], ['Sunrise Caterers', 'BIZ', 'Gurugram', 'ACTIVE'], ['Helping Hands Foundation', 'NGO', 'Delhi', 'RECEIVING'], ['FoodCare Trust', 'NGO', 'Noida', 'RECEIVING'], ['PureFoods Processing', 'PROCESSING', 'Faridabad', 'ACTIVE'], ['GreenWheel Logistics', 'LOGISTICS', 'Delhi', 'ON ROUTE']].map(r => `<tr><td style="font-weight:600">${r[0]}</td><td><span class="badge dim">${r[1]}</span></td><td class="muted">${r[2]}</td><td><span class="badge ok">${r[3]}</span></td></tr>`).join('')}
    </tbody></table></div></div>`;
  icons(); reveal(p);
  $$('.spk').forEach(el => spark(el, el.dataset.d.split(',').map(Number), C.acc, 26));
}
function ecoMap() {
  return `<svg class="ecosvg" viewBox="0 0 760 360" style="width:100%">
  <defs><marker id="arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L8,4L0,8z" fill="${C.acc}"/></marker></defs>
  ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="760" y2="${i * 50}" stroke="${C.grid}"/>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 65}" y1="0" x2="${i * 65}" y2="360" stroke="${C.grid}"/>`).join('')}
  <path d="M60,330 Q220,240 380,300 T740,220" stroke="rgba(91,200,175,.25)" stroke-width="26" fill="none"/>
  <line x1="150" y1="250" x2="330" y2="150" stroke="${C.acc}" stroke-width="1.5" marker-end="url(#arr)" opacity=".8"><animate attributeName="opacity" values=".3;.9;.3" dur="2.4s" repeatCount="indefinite"/></line>
  <line x1="490" y1="270" x2="360" y2="160" stroke="${C.teal}" stroke-width="1.5" opacity=".8"><animate attributeName="opacity" values=".9;.3;.9" dur="3s" repeatCount="indefinite"/></line>
  <line x1="490" y1="270" x2="620" y2="120" stroke="${C.teal}" stroke-width="1.5" opacity=".6"><animate attributeName="opacity" values=".4;1;.4" dur="2.6s" repeatCount="indefinite"/></line>
  <line x1="120" y1="90" x2="240" y2="140" stroke="${C.amber}" stroke-width="1.5" opacity=".7"/>
  ${[[150, 250, 'IIT Campus Kitchen', 'BIZ', C.acc], [360, 150, 'Helping Hands', 'NGO', C.teal], [490, 270, 'FoodCare Trust', 'NGO', C.teal], [620, 120, 'Annaseva', 'NGO', C.teal], [120, 90, 'PureFoods', 'PROCESSING', C.amber], [240, 300, 'GreenWheel Hub', 'LOGISTICS', C.ink2]].map(n => `
    <circle cx="${n[0]}" cy="${n[1]}" r="14" fill="${fillA(n[4], .13)}" stroke="${n[4]}" stroke-width="1.5"><animate attributeName="r" values="12;15;12" dur="3s" repeatCount="indefinite"/></circle>
    <text x="${n[0]}" y="${n[1] + 30}" text-anchor="middle">${n[2]}</text>
    <text x="${n[0]}" y="${n[1] - 22}" text-anchor="middle" fill="${n[4]}">${n[3]}</text>`).join('')}
</svg>`}
function sendToRedistribution(id) { toast(id + ' added to redistribution queue — open Add Surplus to list it.'); nav('addfood') }
