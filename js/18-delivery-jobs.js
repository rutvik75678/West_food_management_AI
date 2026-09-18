/* ============================================================
   FOODWISE AI · 18-delivery-jobs.js
   Open delivery marketplace: NGO-accepted food becomes an open
   delivery request; delivery partners ACCEPT it themselves.
   Overrides: myListings, pgFoodPool, dashLogistics, rPanel.
   ============================================================ */
function orgMatch(a, b) { a = (a || '').toLowerCase().trim(); b = (b || '').toLowerCase().trim(); if (!a || !b) return false; return a === b || (a.length > 3 && b.indexOf(a) > -1) || (b.length > 3 && a.indexOf(b) > -1) }
function myListings() {
    if (!S.user) return []; if (S.user.role === 'ADMIN') return S.listings;
    const o = S.user.org || '';
    return S.listings.filter(l => orgMatch(l.by, o) || orgMatch(l.ngo, o) || orgMatch(l.partner, o));
}
function openJobs() { return S.listings.filter(l => l.status === 'CLAIMED' && !l.partner) }
function jobCard(l, compact) {
    return `<div class="lstcard ${l.risk === 'CRITICAL' ? 'hot' : ''}">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <div><b class="small">${l.food}</b> <span class="tag">${l.id}</span>
        <div class="faint small">${l.by} → ${l.ngo || '—'} · ${l.qty}</div>
        <div class="faint small mono">Pickup ${l.window} · ${l.loc}</div></div>
      <div style="text-align:right">${riskBadge(l.risk)}<div class="faint small mono" style="margin-top:5px">freshness ${l.fresh}%</div></div>
    </div>${statusDots(l.status)}
    ${compact ? '' : `<button class="btn btn-sm btn-acc" style="margin-top:10px" onclick="acceptDelivery('${l.id}')"><i data-lucide="hand"></i> Accept delivery</button>`}
  </div>`;
}
function acceptDelivery(id) {
    const l = S.listings.find(x => x.id === id);
    if (!l || l.status !== 'CLAIMED' || l.partner) return;
    if (l.ngo && orgMatch(l.ngo, S.user.org)) { toast('You are the receiving NGO — a delivery partner must accept this.', 'warn'); return }
    if (l.by && orgMatch(l.by, S.user.org)) { toast('You listed this food — the receiving NGO or a partner must accept.', 'warn'); return }
    advanceListing(id, 'ASSIGNED', { partner: S.user.org });
}
function pgFoodPool() {
    const p = $('#page'), role = S.user.role, isNgo = role === 'NGO', isPartner = role === 'LOGISTICS';
    const open = S.listings.filter(l => l.status === 'LISTED');
    const mine = S.listings.filter(l => (orgMatch(l.ngo, S.user.org) || orgMatch(l.partner, S.user.org)) && ['CLAIMED', 'ASSIGNED', 'PICKED'].includes(l.status));
    const jobs = isPartner ? openJobs() : [];
    p.innerHTML = `${pageHead('Food Pool', 'Every available surplus, scored by risk.', 'Accept food requests, post delivery jobs, and let partners accept them — the marketplace runs itself.')}
  <div class="grid" style="grid-template-columns:1.4fr 1fr">
    <div>
      ${isPartner ? `<div class="card-h rise"><div><span class="kicker">OPEN DELIVERY REQUESTS · ${jobs.length}</span><h3>Jobs posted by NGOs</h3></div><span class="ai-chip">accept to earn route</span></div>
      ${jobs.length ? jobs.map(l => jobCard(l)).join('') : '<div class="card rise"><p class="muted small">No open delivery requests right now. When an NGO accepts food, the job appears here instantly.</p></div>'}
      <div class="hr" style="margin:18px 0"></div>`: ''}
      <div class="card-h rise"><div><span class="kicker">AVAILABLE FOOD · ${open.length}</span><h3>Open requests near you</h3></div></div>
      ${open.length ? open.map(l => `<div class="lstcard ${l.risk === 'CRITICAL' ? 'hot' : ''} rise">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <div><b>${l.food}</b> <span class="tag">${l.id} · ${l.kind}</span><div class="faint small">${l.by} · ${l.qty} · ${l.loc}</div><div class="faint small mono">Pickup ${l.window} · listed ${Math.max(1, Math.round((now() - l.ts) / 6e4))} min ago</div></div>
          <div style="text-align:right">${riskBadge(l.risk)}<div class="faint small mono" style="margin-top:5px">freshness ${l.fresh}%</div></div>
        </div>
        ${isNgo ? `<button class="btn btn-sm btn-acc" style="margin-top:10px" onclick="acceptListing('${l.id}')"><i data-lucide="hand-heart"></i> Accept request</button>`
            : isPartner ? '<p class="demo-note" style="margin-top:8px">Food must be accepted by an NGO first — then the delivery job appears above.</p>'
                : '<p class="demo-note" style="margin-top:8px">NGO accounts accept requests — you are viewing as ' + ROLES[role].label + '.</p>'}
      </div>`).join('') : '<div class="card rise"><p class="muted small">Pool is empty — new listings appear here instantly.</p></div>'}
    </div>
    <div>
      ${isNgo ? `<div class="card rise"><div class="card-h"><div><span class="kicker">MY ACCEPTED FOOD</span><h3>${mine.length} in progress</h3></div></div>
        ${mine.length ? mine.map(l => `<div class="lstcard"><div style="display:flex;justify-content:space-between;gap:8px"><div><b class="small">${l.food}</b><div class="faint small">${l.qty} · ${l.by}</div></div>${lBadge(l.status)}</div>${statusDots(l.status)}
          ${l.status === 'CLAIMED' && !l.partner ? `<p class="small" style="margin-top:8px;color:var(--acc)">✦ Open to the delivery network — any partner can accept. Or assign one now:</p>
          <div class="field" style="margin:8px 0 6px"><label>Assign a specific partner</label><select id="rPt">${S.partners.map((pt, i) => `<option value="${i}">${pt.name} · ETA ${pt.eta} · ${pt.cap}</option>`).join('')}</select></div>
          <button class="btn btn-sm" onclick="assignPartnerR('${l.id}')"><i data-lucide="truck"></i> Assign this partner</button>`
                        : l.status === 'CLAIMED' ? `<p class="small" style="margin-top:8px">Partner: <b style="color:var(--ink)">${l.partner}</b> — awaiting pickup.</p>`
                            : l.status === 'ASSIGNED' ? `<button class="btn btn-sm" style="margin-top:8px" onclick="advanceListing('${l.id}','PICKED')">Confirm pickup</button>`
                                : '<p class="faint small mono">In transit — partner updating status.</p>'}
        </div>`).join('') : '<p class="muted small">Nothing accepted yet.</p>'}
      </div>`: ''}
      <div class="card rise"><div class="card-h"><div><span class="kicker">DELIVERY PARTNERS ON NETWORK</span><h3>Fleet</h3></div></div>
        ${S.partners.map(pt => `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><div><b class="small">${pt.name}</b><div class="faint small mono">ETA ${pt.eta} · ${pt.cap} · rel ${pt.rel}%</div></div><span class="badge ok">AVAILABLE</span></div>`).join('')}
        <p class="demo-note" style="margin-top:8px">Partners self-accept open requests — NGO assignment is optional.</p>
      </div>
    </div>
  </div>`;
    icons(); reveal(p);
}
function dashLogistics(p) {
    const jobs = openJobs(), tasks = myListings().filter(l => ['ASSIGNED', 'PICKED'].includes(l.status));
    p.innerHTML = `${pageHead('Delivery Partner · ' + S.user.org, 'Your delivery marketplace.', 'Accept open requests from NGOs, follow the AI route, deliver inside the shelf-life window.')}
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr">
    ${[['Open requests', jobs.length, 'bell-ring'], ['My active tasks', tasks.length, 'truck'], ['Completed', myListings().filter(l => l.status === 'DELIVERED').length, 'check-circle-2']].map(k => `<div class="card rise"><i data-lucide="${k[2]}" style="color:var(--acc)"></i><div class="num" style="font-size:24px;margin:6px 0 2px">${k[1]}</div><span class="kicker">${k[0]}</span></div>`).join('')}
  </div>
  <div class="grid" style="grid-template-columns:1.5fr 1fr;margin-top:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">AI ROUTE OPTIMIZATION · LIVE</span><h3>Pickup EV-07</h3></div><span class="ai-chip">optimized</span></div>${routeMap(true)}
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:14px">
        <div><span class="kicker">Original route</span><div class="num" style="font-size:19px">${S.route.orig} km</div></div>
        <div><span class="kicker">AI optimized</span><div class="num" style="font-size:19px;color:var(--acc)">${S.route.opt} km</div></div>
        <div><span class="kicker">Reduction</span><div class="num" style="font-size:19px;color:var(--teal)">23.6%</div></div>
        <div><span class="kicker">ETA</span><div class="num" style="font-size:19px">${S.route.eta} min</div></div>
        <div><span class="kicker">CO₂ avoided (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${S.route.co2} kg</div></div>
      </div></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card rise" style="border-color:var(--acc-border)"><div class="card-h"><div><span class="kicker">OPEN DELIVERY REQUESTS</span><h3>${jobs.length} waiting</h3></div><span class="badge acc">ACCEPT</span></div>
        ${jobs.length ? jobs.map(l => jobCard(l)).join('') : '<p class="muted small">No open requests. NGO-accepted food lands here automatically.</p>'}
      </div>
      <div class="card rise"><div class="card-h"><div><span class="kicker">MY DELIVERY TASKS</span><h3>${tasks.length} active</h3></div></div>
        ${tasks.length ? tasks.map(l => `<div class="lstcard"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div><b class="small">${l.food}</b><div class="faint small">${l.by} → ${l.ngo} · ${l.qty}</div></div>${lBadge(l.status)}</div>${statusDots(l.status)}
          <div style="display:flex;gap:8px;margin-top:10px">${l.status === 'ASSIGNED' ? `<button class="btn btn-sm btn-acc" onclick="advanceListing('${l.id}','PICKED')">Mark picked up</button>` : `<button class="btn btn-sm btn-acc" onclick="advanceListing('${l.id}','DELIVERED')">Mark delivered</button>`}<button class="btn btn-sm" onclick="nav('redistribute')">View route</button></div></div>`).join('') : '<p class="muted small">Accept an open request to start.</p>'}
      </div>
    </div>
  </div>`;
    icons(); reveal(p);
}
function rPanel(l) {
    const role = S.user.role, isPartner = role === 'LOGISTICS';
    const head = `<div class="card-h"><div><span class="kicker">AI REDISTRIBUTION · <span class="mono">${l.id}</span></span><h3>${l.food}</h3></div><div style="text-align:right">${lBadge(l.status)}<div style="margin-top:5px">${riskBadge(l.risk)}</div></div></div>
  <div style="display:flex;gap:22px;flex-wrap:wrap">
    <div><span class="kicker">Quantity</span><div class="num" style="font-size:20px">${l.qty}</div></div>
    <div><span class="kicker">≈ Meals</span><div class="num" style="font-size:20px">${Math.round(l.kg * 2.5)}</div></div>
    <div><span class="kicker">Window</span><div class="num" style="font-size:20px;color:var(--amber)">${l.window}</div></div>
    <div><span class="kicker">Source</span><div class="small" style="margin-top:5px">${l.by}</div></div>
    <div><span class="kicker">NGO</span><div class="small" style="margin-top:5px">${l.ngo || '—'}</div></div>
  </div><div class="hr"></div>`;
    if (l.status === 'LISTED') return head + `
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="ai-chip">AI NGO MATCHING</span><span class="faint small">distance · capacity · compatibility · urgency · reliability</span></div>
    <button class="btn btn-acc" style="width:100%;justify-content:center;margin-top:12px" onclick="runMatch('${l.id}')"><i data-lucide="sparkles"></i> Run AI match for this food</button>
    <div id="matchArea" style="margin-top:14px"><p class="faint small">No NGO assigned yet for ${l.id}.</p></div>
    <div id="routeStats"></div><div id="dispatchArea"></div>`;
    if (l.status === 'CLAIMED') {
        if (isPartner) return head + `
      <div style="padding:11px;border:1px solid var(--acc-border);border-radius:10px"><span class="kicker" style="color:var(--acc)">✦ DELIVERY REQUEST OPEN</span>
      <p class="small" style="margin-top:4px"><b>${l.ngo}</b> accepted this food and needs a delivery partner. Pickup ${l.window}.</p></div>
      <button class="btn btn-acc" style="width:100%;justify-content:center;margin-top:12px" onclick="acceptDelivery('${l.id}')"><i data-lucide="hand"></i> Accept this delivery</button>`;
        return head + `
      <div style="padding:11px;border:1px solid var(--acc-border);border-radius:10px"><span class="kicker" style="color:var(--acc)">✦ MATCHED</span>
      <p class="small" style="margin-top:4px"><b>${l.ngo}</b> accepted. This delivery is <b>open to the partner network</b> — or assign one now:</p></div>
      <div class="field" style="margin-top:10px"><label>Assign a specific partner (optional)</label><select id="rPt">${S.partners.map((pt, i) => `<option value="${i}">${pt.name} · ETA ${pt.eta} · ${pt.cap}</option>`).join('')}</select></div>
      <button class="btn btn-sm" onclick="assignPartnerR('${l.id}')"><i data-lucide="truck"></i> Assign partner</button>
      <div id="mapHost" style="margin-top:12px">${routeMap(false)}</div><div id="routeStats"></div><div id="dispatchArea"></div>`;
    }
    if (l.status === 'ASSIGNED' || l.status === 'PICKED') return head + `
    <div id="mapHost">${routeMap(true)}</div><div id="routeStats"></div><div id="dispatchArea"></div>`;
    return head + `
    <div style="padding:14px;border:1px solid rgba(91,200,175,.4);background:rgba(91,200,175,.07);border-radius:12px">
      <b style="color:var(--teal)">Delivered ✓</b>
      <p class="small muted" style="margin-top:5px">${l.ngo || 'NGO'} · partner ${l.partner || '—'} · ${l.qty} (${l.kg} kg)</p>
      <div style="display:flex;gap:22px;margin-top:10px;flex-wrap:wrap">
        <div><span class="kicker">Meals saved</span><div class="num" style="font-size:19px;color:var(--teal)">+${Math.round(l.kg * 2.5)}</div></div>
        <div><span class="kicker">CO₂e avoided (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${(l.kg * 2.26).toFixed(1)} kg</div></div>
        <div><span class="kicker">Water saved (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${N(Math.round(l.kg * 14.9))} L</div></div>
        <div><span class="kicker">Money saved (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${INR(l.kg * 114.5)}</div></div>
      </div></div>`;
}