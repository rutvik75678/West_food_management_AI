/* ============================================================
   FOODWISE AI · 16-marketplace.js
   Add surplus food · My listings (tracking) · Food pool (NGO)
   ============================================================ */
function statusDots(s) {
    const i = LSTATUS.indexOf(s);
    return `<div class="tlmini">${LSTATUS.map((st, k) => `<span class="tm ${k <= i ? 'on' : ''}" title="${st}"></span>`).join('')}<span class="faint mono" style="font-size:9px;margin-left:5px">${s}</span></div>`
}
function pgAddFood() {
    const p = $('#page');
    p.innerHTML = `${pageHead('Add Surplus Food', 'List food before it becomes waste.', 'NGOs nearby are notified instantly. AI attaches a risk score from freshness + pickup window.')}
  <div class="grid" style="grid-template-columns:1.3fr 1fr">
    <div class="card rise">
      <div class="field"><label>Food description</label><input id="afFood" placeholder="e.g. Veg pulao + raita (lunch service)"></div>
      <div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="field"><label>Category</label><select id="afKind"><option>Cooked meal</option><option>Fruit</option><option>Packaged</option><option>Dairy</option><option>Bakery</option><option>Vegetables</option></select></div>
        <div class="field"><label>Quantity</label><input id="afQty" placeholder="e.g. 40 meals or 12 kg"></div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="field"><label>Weight (kg) — for impact math</label><input id="afKg" type="number" min="1" value="10"></div>
        <div class="field"><label>Pickup window</label><select id="afWin"><option>Before 6:00 PM</option><option>Before 7:00 PM</option><option>Before 8:00 PM</option><option>Before 9:00 PM</option><option>Tomorrow morning</option></select></div>
      </div>
      <div class="field"><label>Pickup location</label><input id="afLoc" value="${S.user.org}, Delhi"></div>
      <div class="field"><label>Freshness self-check · <b class="mono" id="afFVal" style="color:var(--acc)">90%</b> <span class="faint">— or verify with FoodVision first</span></label>
        <input type="range" min="40" max="100" value="90" id="afFresh" oninput="$('#afFVal').textContent=this.value+'%'"></div>
      <div class="autherr" id="afErr"></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-acc" onclick="submitListing()"><i data-lucide="package-plus"></i> Publish to food pool</button>
        <button class="btn" onclick="nav('foodvision')"><i data-lucide="scan-eye"></i> Verify with FoodVision</button>
      </div>
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">LIVE PREVIEW</span><h3>How NGOs will see it</h3></div></div>
      <div id="afPrev" class="lstcard"><b>Your food</b><div class="faint small">Fill the form — risk updates live.</div></div>
      <div class="hr"></div>
      <span class="kicker">WHAT HAPPENS NEXT</span>
      <div class="timeline" style="margin-top:10px">
        <div class="tl done"><div class="tdot"><i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i></div><div class="small">Published to pool with risk score</div></div>
        <div class="tl"><div class="tdot"></div><div class="small">NGO accepts the request</div></div>
        <div class="tl"><div class="tdot"></div><div class="small">Delivery partner connected</div></div>
        <div class="tl"><div class="tdot"></div><div class="small">Pickup → delivery → impact counted</div></div>
      </div>
    </div>
  </div>`;
    icons(); reveal(p);
    const upd = () => {
        const f = +$('#afFresh').value, hrs = $('#afWin').value.includes('Tomorrow') ? 24 : 4;
        $('#afPrev').innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px"><div><b>${$('#afFood').value || 'Your food'}</b><div class="faint small">${$('#afQty').value || 'qty'} · ${$('#afLoc').value || 'location'}</div><div class="faint small mono">Pickup ${$('#afWin').value}</div></div><div style="text-align:right">${riskBadge(riskOf(f, hrs))}<div class="faint small mono" style="margin-top:5px">freshness ${f}%</div></div></div>`
    };
    ['afFood', 'afQty', 'afLoc', 'afWin', 'afFresh'].forEach(id => { const el = $('#' + id); el.addEventListener('input', upd); el.addEventListener('change', upd) });
}
function submitListing() {
    $('#afErr').style.display = 'none';
    const food = $('#afFood').value.trim(), kg = +$('#afKg').value, fresh = +$('#afFresh').value;
    const hrs = $('#afWin').value.includes('Tomorrow') ? 24 : 4;
    if (food.length < 3) return authErr('#afErr', 'Describe the food (min 3 characters).');
    if (!kg || kg < 1) return authErr('#afErr', 'Enter a valid weight in kg.');
    const l = { id: 'L-' + (100 + S.listings.length + 1), food, kind: $('#afKind').value, qty: $('#afQty').value || kg + ' kg', kg, fresh, hrsLeft: hrs, risk: riskOf(fresh, hrs), by: S.user.org, status: 'LISTED', ngo: null, partner: null, window: $('#afWin').value, loc: $('#afLoc').value || S.user.org, ts: now() };
    S.listings.unshift(l);
    logAudit('New listing: ' + food + ' (' + kg + ' kg) by ' + S.user.org);
    addAlert('INFO', 'New surplus food available', food + ' · ' + l.qty + ' · ' + S.user.org, 'package-plus');
    toast('Published! NGOs in your area have been notified.', 'ok'); nav('mylistings');
}
function pgMyListings() {
    const p = $('#page'), mine = myListings();
    p.innerHTML = `${pageHead('My Listings & Tracking', 'Follow every meal to its destination.', 'Live status: listed → accepted → partner assigned → pickup → delivered, with impact counted automatically.')}
  ${mine.length ? mine.map(l => `<div class="lstcard ${['CRITICAL'].includes(l.risk) && l.status !== 'DELIVERED' ? 'hot' : ''}">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <div><b>${l.food}</b> <span class="tag">${l.id}</span><div class="faint small">${l.qty} · ${l.loc} · pickup ${l.window}</div>
      <div class="faint small">${l.ngo ? 'NGO: <b style="color:var(--ink)">' + l.ngo + '</b>' : ''} ${l.partner ? ' · Partner: <b style="color:var(--ink)">' + l.partner + '</b>' : ''} ${!l.ngo ? '· waiting for an NGO to accept' : ''}</div></div>
      <div style="text-align:right">${lBadge(l.status)}<div style="margin-top:5px">${l.status !== 'DELIVERED' ? riskBadge(l.risk) : '<span class="badge ok">+ ' + Math.round(l.kg * 2.5) + ' meals</span>'}</div></div>
    </div>${statusDots(l.status)}</div>`).join('')
            : `<div class="card rise" style="text-align:center;padding:40px"><i data-lucide="package-open" style="width:34px;height:34px;color:var(--ink3)"></i><p class="muted" style="margin:12px 0">Nothing listed yet.</p><button class="btn btn-acc btn-sm" onclick="nav('addfood')">List your first surplus</button></div>`}`;
    icons(); reveal(p);
}
function pgFoodPool() {
    const p = $('#page'), isNgo = S.user.role === 'NGO';
    const open = S.listings.filter(l => l.status === 'LISTED'), mine = S.listings.filter(l => l.ngo === S.user.org && ['CLAIMED', 'ASSIGNED', 'PICKED'].includes(l.status));
    p.innerHTML = `${pageHead('Food Pool', 'Every available surplus, scored by risk.', 'Accept a request, connect a delivery partner, and the impact engine handles the rest.')}
  <div class="grid" style="grid-template-columns:1.4fr 1fr">
    <div>
      <div class="card-h rise"><div><span class="kicker">OPEN REQUESTS · ${open.length}</span><h3>Available now</h3></div></div>
      ${open.length ? open.map(l => `<div class="lstcard ${l.risk === 'CRITICAL' ? 'hot' : ''} rise">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <div><b>${l.food}</b> <span class="tag">${l.id} · ${l.kind}</span><div class="faint small">${l.by} · ${l.qty} · ${l.loc}</div><div class="faint small mono">Pickup ${l.window} · listed ${Math.max(1, Math.round((now() - l.ts) / 6e4))} min ago</div></div>
          <div style="text-align:right">${riskBadge(l.risk)}<div class="faint small mono" style="margin-top:5px">freshness ${l.fresh}%</div></div>
        </div>
        ${isNgo ? `<button class="btn btn-sm btn-acc" style="margin-top:10px" onclick="acceptListing('${l.id}')"><i data-lucide="hand-heart"></i> Accept request</button>` : '<p class="demo-note" style="margin-top:8px">NGO accounts accept requests — you are viewing as ' + ROLES[S.user.role].label + '.</p>'}
      </div>`).join('') : '<div class="card rise"><p class="muted small">Pool is empty — new listings appear here instantly.</p></div>'}
    </div>
    <div>
      ${isNgo ? `<div class="card rise"><div class="card-h"><div><span class="kicker">MY ACCEPTED · CONNECT PARTNER</span><h3>${mine.length} in progress</h3></div></div>
        ${mine.length ? mine.map(l => `<div class="lstcard"><div style="display:flex;justify-content:space-between;gap:8px"><div><b class="small">${l.food}</b><div class="faint small">${l.qty} · ${l.by}</div></div>${lBadge(l.status)}</div>${statusDots(l.status)}
          ${l.status === 'CLAIMED' ? `<div class="field" style="margin:10px 0 6px"><label>Connect delivery partner</label><select id="pt_${l.id}">${S.partners.map((pt, i) => `<option value="${i}">${pt.name} · ETA ${pt.eta} · ${pt.cap}</option>`).join('')}</select></div>
          <button class="btn btn-sm btn-acc" onclick="assignPartner('${l.id}')"><i data-lucide="truck"></i> Connect & dispatch</button>` : l.status === 'ASSIGNED' ? `<button class="btn btn-sm" onclick="advanceListing('${l.id}','PICKED')">Confirm pickup</button>` : '<p class="faint small mono">In transit — partner updating status.</p>'}
        </div>`).join('') : '<p class="muted small">Nothing accepted yet.</p>'}
      </div>`: ''}
      <div class="card rise"><div class="card-h"><div><span class="kicker">DELIVERY PARTNERS ON NETWORK</span><h3>Fleet</h3></div></div>
        ${S.partners.map(pt => `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><div><b class="small">${pt.name}</b><div class="faint small mono">ETA ${pt.eta} · ${pt.cap} · rel ${pt.rel}%</div></div><span class="badge ok">AVAILABLE</span></div>`).join('')}
      </div>
    </div>
  </div>`;
    icons(); reveal(p);
}
function assignPartner(id) {
    const l = S.listings.find(x => x.id === id); if (!l) return;
    const pt = S.partners[+$('#pt_' + id).value];
    advanceListing(id, 'ASSIGNED', { partner: pt.name })
}