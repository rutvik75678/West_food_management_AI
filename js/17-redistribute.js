/* ============================================================
   FOODWISE AI · 17-redistribute.js
   Marketplace-driven AI Redistribution (overrides the old
   single-demo-surplus page). Works on ALL S.listings foods:
   AI NGO match → route optimize → partner dispatch → impact.
   ============================================================ */
function pgRedistribute() {
    const p = $('#page');
    const act = S.listings.filter(l => l.status !== 'DELIVERED');
    const done = S.listings.filter(l => l.status === 'DELIVERED');
    if (!S.rSel || !S.listings.some(l => l.id === S.rSel && l.status !== 'DELIVERED')) S.rSel = (act[0] || S.listings[0] || {}).id || null;
    const sel = S.listings.find(l => l.id === S.rSel);
    p.innerHTML = `${pageHead('AI Modules 07 + 08 · Smart Redistribution · <b>Demo engines</b>', 'Every listed food, intelligently placed.', 'Select any surplus from the pool — AI ranks NGOs, optimizes the route, dispatches a partner, and counts the impact automatically.')}
  <div class="grid" style="grid-template-columns:1fr 1.6fr">
    <div class="card rise" style="padding:14px 16px">
      <span class="kicker">SURPLUS POOL · ${act.length} ACTIVE · ${done.length} DELIVERED</span>
      <div style="display:flex;flex-direction:column;gap:9px;margin-top:10px">
        ${act.length ? act.map(l => `<div style="cursor:pointer;border:1px solid ${l.id === S.rSel ? 'var(--acc-border)' : 'var(--line)'};${l.risk === 'CRITICAL' ? 'border-left:3px solid var(--red);' : ''}border-radius:12px;padding:12px 14px;background:var(--bg2);${l.id === S.rSel ? 'box-shadow:0 0 0 1px var(--acc-border);' : ''}" onclick="S.rSel='${l.id}';pgRedistribute()">
          <div style="display:flex;justify-content:space-between;gap:8px">
            <div><b class="small">${l.food}</b><div class="faint small">${l.qty} · ${l.by}</div></div>
            <div style="text-align:right">${riskBadge(l.risk)}<div class="small" style="margin-top:4px">${lBadge(l.status)}</div></div>
          </div></div>`).join('') : '<p class="muted small">Pool is empty — use Add Surplus Food first.</p>'}
      </div>
      ${done.length ? `<details class="expandable" style="margin-top:12px"><summary>Delivered history · ${done.length}</summary>
        <div style="margin-top:8px">${done.map(l => `<div style="display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid var(--line)"><span class="small">${l.food} <span class="tag">${l.id}</span><div class="faint small">${l.ngo || ''} ${l.partner ? '· ' + l.partner : ''}</div></span><span class="badge ok">+${Math.round(l.kg * 2.5)} meals</span></div>`).join('')}</div></details>` : ''}
    </div>
    <div class="card rise">${sel ? rPanel(sel) : '<p class="muted small">Add surplus food to activate AI redistribution.</p>'}</div>
  </div>`;
    icons(); reveal(p);
    if (sel && $('#routeOpt') && ((sel.status !== 'LISTED' && sel.status !== 'CLAIMED') || S.routeOptimized)) showRouteStats();
}
function rPanel(l) {
    const head = `<div class="card-h"><div><span class="kicker">AI REDISTRIBUTION · <span class="mono">${l.id}</span></span><h3>${l.food}</h3></div><div style="text-align:right">${lBadge(l.status)}<div style="margin-top:5px">${riskBadge(l.risk)}</div></div></div>
  <div style="display:flex;gap:22px;flex-wrap:wrap">
    <div><span class="kicker">Quantity</span><div class="num" style="font-size:20px">${l.qty}</div></div>
    <div><span class="kicker">≈ Meals</span><div class="num" style="font-size:20px">${Math.round(l.kg * 2.5)}</div></div>
    <div><span class="kicker">Window</span><div class="num" style="font-size:20px;color:var(--amber)">${l.window}</div></div>
    <div><span class="kicker">Source</span><div class="small" style="margin-top:5px">${l.by}</div></div>
    <div><span class="kicker">Location</span><div class="small" style="margin-top:5px">${l.loc}</div></div>
  </div><div class="hr"></div>`;
    if (l.status === 'LISTED') return head + `
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="ai-chip">AI NGO MATCHING</span><span class="faint small">distance · capacity · compatibility · urgency · reliability</span></div>
    <button class="btn btn-acc" style="width:100%;justify-content:center;margin-top:12px" onclick="runMatch('${l.id}')"><i data-lucide="sparkles"></i> Run AI match for this food</button>
    <div id="matchArea" style="margin-top:14px"><p class="faint small">No NGO assigned yet for ${l.id}.</p></div>
    <div id="routeStats"></div><div id="dispatchArea"></div>`;
    if (l.status === 'CLAIMED') return head + `
    <div style="padding:11px;border:1px solid var(--acc-border);border-radius:10px"><span class="kicker" style="color:var(--acc)">✦ MATCHED</span><p class="small" style="margin-top:4px"><b>${l.ngo}</b> accepted this listing. ${S.routeOptimized ? 'Route optimized — connect a delivery partner.' : 'Optimize the pickup route next.'}</p></div>
    ${S.routeOptimized ? '' : `<button class="btn btn-acc" style="width:100%;justify-content:center;margin-top:12px" onclick="optimizeFor('${l.id}')"><i data-lucide="route"></i> Optimize route with AI</button>`}
    <div id="mapHost" style="margin-top:12px">${routeMap(S.routeOptimized)}</div>
    <div id="routeStats"></div><div id="dispatchArea"></div>`;
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
function runMatch(id) {
    const area = $('#matchArea'); if (!area) return;
    const l = S.listings.find(x => x.id === id);
    area.innerHTML = `<div style="font-family:var(--mono);font-size:11px;color:var(--acc)" id="mLog"></div>`;
    const lines = ['Scanning 14 registered NGOs', 'Filtering: dietary compatibility', 'Filtering: pickup window ' + (l ? l.window : ''), 'Scoring: distance · capacity · urgency · reliability'];
    let i = 0; const iv = setInterval(() => {
        const el = $('#mLog'); if (!el) { clearInterval(iv); return }
        if (i < lines.length) { el.innerHTML = lines[i++] + '…' } else {
            clearInterval(iv);
            S.services.find(s => s.id === 'match').count++; logAudit('AI match computed for ' + id + ': Helping Hands 96%');
            renderMatchesR(id); toast('Top match: Helping Hands Foundation · 96%', 'ok')
        }
    }, 600);
}
function renderMatchesR(id) {
    const area = $('#matchArea'); if (!area) return;
    area.innerHTML = S.ngos.map((n, i) => `<div class="card" style="margin-bottom:10px;padding:13px 15px;border-color:${i === 0 ? 'var(--acc-border)' : 'var(--line)'}">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><b>${n.name}</b> ${i === 0 ? '<span class="badge acc">TOP MATCH</span>' : ''}<div class="faint small mono">${n.d} km · capacity ${n.cap} meals · reliability ${n.rel}% · pickup ${n.avail ? 'available' : 'busy'}</div></div>
      <div style="text-align:right"><div class="num" style="font-size:21px;color:${i === 0 ? 'var(--acc)' : 'var(--ink2)'}" data-cnt="${n.score}">0%</div><span class="kicker">match</span></div></div>
    ${i === 0 ? `<details class="expandable" style="margin-top:8px"><summary>Score breakdown</summary><div style="margin-top:8px">${Object.entries(n.br).map(([k, v]) => `<div class="frow" style="grid-template-columns:150px 1fr 34px"><span class="muted small">${k}</span><div class="fb"><i data-w="${v * 3}"></i></div><b>${v}</b></div>`).join('')}</div></details>` : ''}
    ${n.avail ? `<button class="btn btn-sm ${i === 0 ? 'btn-acc' : ''}" style="margin-top:10px" onclick="selectNgoR('${id}',${i})">Select & optimize route</button>` : `<span class="badge dim" style="margin-top:10px">NO PICKUP WINDOW</span>`}
  </div>`).join('');
    area.querySelectorAll('[data-cnt]').forEach((el, i) => setTimeout(() => countUp(el, +el.dataset.cnt, { dur: 800, suffix: '%' }), 120 * i));
    reveal(area);
}
function selectNgoR(id, i) {
    S.routeOptimized = false;
    advanceListing(id, 'CLAIMED', { ngo: S.ngos[i].name });
}
function optimizeFor(id) {
    S.routeOptimized = true;
    const s = S.services.find(x => x.id === 'route'); s.count++; s.last = id + ' · 13.9 km (−23.6%)';
    logAudit('Route optimized for ' + id + ': 18.2 → 13.9 km (demo)'); toast('Route optimized: 18.2 → 13.9 km (−23.6%).', 'ok');
    pgRedistribute();
}
function showRouteStats() {
    const opt = $('#routeOpt'), orig = $('#routeOrig'); if (!opt) return;
    [opt, orig].forEach(pth => {
        const L = pth.getTotalLength(); pth.style.strokeDasharray = pth.id === 'routeOrig' ? '7 7' : L; pth.style.strokeDashoffset = pth.id === 'routeOrig' ? 0 : L; pth.getBoundingClientRect();
        if (pth.id === 'routeOpt') { pth.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,.8,.3,1)'; pth.style.strokeDashoffset = 0 }
    });
    const v = $('#vehicle');
    if (v) {
        v.setAttribute('opacity', 1); const L = opt.getTotalLength(); const t0 = performance.now();
        (function mv(t) { const pr = clamp((t - t0) / 4200, 0, 1), e2 = 1 - Math.pow(1 - pr, 2); const pt = opt.getPointAtLength(L * e2); v.setAttribute('cx', pt.x); v.setAttribute('cy', pt.y); if (pr < 1) requestAnimationFrame(mv) })(t0)
    }
    const st = $('#routeStats');
    if (st) st.innerHTML = `<div style="display:flex;gap:22px;flex-wrap:wrap;margin-top:12px">
    <div><span class="kicker">Original route</span><div class="num" style="font-size:19px">${S.route.orig} km</div></div>
    <div><span class="kicker">AI optimized</span><div class="num" style="font-size:19px;color:var(--acc)">${S.route.opt} km</div></div>
    <div><span class="kicker">Reduction</span><div class="num" style="font-size:19px;color:var(--teal)">23.6%</div></div>
    <div><span class="kicker">ETA</span><div class="num" style="font-size:19px">${S.route.eta} min</div></div>
    <div><span class="kicker">CO₂ avoided (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${S.route.co2} kg</div></div></div>`;
    const sel = S.listings.find(l => l.id === S.rSel); if (sel) fillDispatch(sel);
}
function fillDispatch(l) {
    const area = $('#dispatchArea'); if (!area) return;
    const idx = LSTATUS.indexOf(l.status);
    if (l.status === 'DELIVERED') { area.innerHTML = `<div class="hr"></div><div style="padding:12px;border:1px solid rgba(91,200,175,.4);background:rgba(91,200,175,.07);border-radius:10px"><b class="small" style="color:var(--teal)">Delivered via ${l.partner || 'partner'} → ${l.ngo}. Impact engine updated automatically.</b></div>`; icons(); return }
    const names = { LISTED: 'Listed to pool', CLAIMED: 'NGO accepted', ASSIGNED: 'Partner assigned', PICKED: 'Picked up' };
    area.innerHTML = `<div class="hr"></div><span class="kicker">DISPATCH · ${l.ngo || '—'}${l.partner ? ' · ' + l.partner : ''}</span>
  <div class="timeline" style="margin-top:12px">${LSTATUS.slice(0, 4).map((s, i) => `<div class="tl ${i < idx ? 'done' : i === idx ? 'now' : ''}"><div class="tdot">${i < idx ? '<i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i>' : ''}</div><div class="small ${i <= idx ? '' : 'faint'}">${names[s]}</div></div>`).join('')}</div>
  ${l.status === 'CLAIMED' ? `<div class="field" style="margin-top:8px"><label>Connect delivery partner</label><select id="rPt">${S.partners.map((pt, i) => `<option value="${i}">${pt.name} · ETA ${pt.eta} · ${pt.cap}</option>`).join('')}</select></div>
    <button class="btn btn-acc btn-sm" onclick="assignPartnerR('${l.id}')"><i data-lucide="truck"></i> Connect & dispatch</button>`
            : l.status === 'ASSIGNED' ? `<button class="btn btn-acc btn-sm" style="margin-top:8px" onclick="advanceListing('${l.id}','PICKED')">Confirm pickup</button>`
                : l.status === 'PICKED' ? `<button class="btn btn-acc btn-sm" style="margin-top:8px" onclick="advanceListing('${l.id}','DELIVERED')">Mark delivered</button>` : ''}`;
    icons();
}
function assignPartnerR(id) {
    const sel = $('#rPt'); if (!sel) return;
    advanceListing(id, 'ASSIGNED', { partner: S.partners[+sel.value].name });
}

/* ============================================================
   INVENTORY → POOL BRIDGE
   Overrides the dead-end sendToRedistribution(): converts an
   inventory batch into a REAL marketplace listing so NGOs can
   accept it through the normal delivery flow.
   ============================================================ */
function sendToRedistribution(batchId) {
  const it = S.inv.find(i => i.id === batchId);
  if (!it) { toast('Batch not found.', 'warn'); return }
  /* already listed and still active? just take them there */
  if (S.listings.some(l => l.batchId === batchId && l.status !== 'DELIVERED')) {
    toast('Batch ' + batchId + ' is already listed in the Food Pool.', 'warn'); nav('redistribute'); return
  }
  const hrs = Math.max(1, Math.round((it.ts - now()) / 36e5));
  const win = 'Before ' + new Date(it.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const org = S.user.org || 'Campus Kitchen';
  const l = {
    id: 'L-' + (100 + S.listings.length + 1),
    batchId: it.id,
    food: it.name + ' (batch ' + it.id + ')',
    kind: it.u === 'L' ? 'Dairy' : (it.store === 'Hot hold' ? 'Cooked meal' : 'Packaged'),
    qty: it.q + ' ' + it.u,
    kg: Math.max(1, Math.round(it.q)),
    fresh: it.qual,
    hrsLeft: hrs,
    risk: it.risk,
    by: org,
    status: 'LISTED', ngo: null, partner: null,
    window: win,
    loc: org + ', Delhi',
    ts: now()
  };
  S.listings.unshift(l);
  logAudit('Inventory batch ' + it.id + ' listed to pool: ' + l.food + ' (' + l.qty + ')');
  addAlert('INFO', 'Surplus listed from inventory', l.food + ' · ' + l.qty + ' · expiry in ' + hrs + ' h', 'package-plus');
  toast(it.id + ' published to the Food Pool — NGOs notified. Expiry deadline ' + win + '.', 'ok');
  S.rSel = l.id;               /* auto-select it on the redistribution page */
  nav('redistribute');
}
/* Mark batches that are already listed on the Inventory page */
const _pgInventory = pgInventory;
pgInventory = function () {
  _pgInventory();
  const listed = S.listings.filter(l => l.batchId && l.status !== 'DELIVERED').map(l => l.batchId);
  if (!listed.length) return;
  $$('#page .tbl tbody tr').forEach(tr => {
    const idEl = tr.querySelector('.faint.mono.small');
    if (idEl && listed.includes(idEl.textContent.trim())) {
      const btn = tr.querySelector('button');
      if (btn) { btn.textContent = 'Listed ✓'; btn.disabled = true; btn.classList.remove('btn-acc') }
    }
  });
};