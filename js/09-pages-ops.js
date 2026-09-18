/* ============================================================
   FOODWISE AI · 09-pages-ops.js
   AI Modules 07+08 Redistribution & Route Optimization,
   09+10 Processing & Energy anomaly detection, IoT simulation.
   ============================================================ */
function routeMap(live) {
    return `<svg viewBox="0 0 800 480" style="width:100%;background:var(--bg3);border-radius:12px;border:1px solid var(--line)" class="ecosvg">
  ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="800" y2="${i * 60}" stroke="${C.grid}"/>`).join('')}
  ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 65}" y1="0" x2="${i * 65}" y2="480" stroke="${C.grid}"/>`).join('')}
  <path d="M0,410 Q200,360 420,420 T800,380" stroke="rgba(91,200,175,.25)" stroke-width="30" fill="none"/>
  <rect x="80" y="80" width="90" height="60" rx="8" fill="var(--block)"/><rect x="600" y="60" width="110" height="80" rx="8" fill="var(--block)"/><rect x="430" y="300" width="120" height="70" rx="8" fill="var(--block)"/>
  <path id="routeOrig" d="M140,400 L200,440 L340,450 L540,430 L660,340 L610,230 L540,130" fill="none" stroke="${C.ink3}" stroke-width="2.5" stroke-dasharray="7 7" opacity="${live ? 0.9 : 0.35}"/>
  <path id="routeOpt" d="M140,400 L250,330 L380,250 L470,180 L540,130" fill="none" stroke="${C.acc}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="140" cy="400" r="9" fill="${C.ink}" stroke="var(--pt)" stroke-width="3"/><text x="140" y="428" text-anchor="middle">Campus Kitchen</text>
  <circle cx="540" cy="130" r="9" fill="${C.teal}" stroke="var(--pt)" stroke-width="3"/><text x="540" y="110" text-anchor="middle">Helping Hands · 2.4 km</text>
  <circle cx="660" cy="340" r="7" fill="${C.ink3}"/><text x="668" y="345" >FoodCare · 5.1 km</text>
  <circle cx="300" cy="120" r="7" fill="${C.ink3}"/><text x="300" y="100" text-anchor="middle">Annaseva · 7.8 km</text>
  <circle id="vehicle" r="8" fill="var(--acc-bright)" stroke="var(--pt)" stroke-width="2" opacity="0"><text></text></circle>
  </svg>`;
}
function pgRedistribute() {
    const p = $('#page'); const listing = S.listing || { item: 'Veg thali meals (surplus)', kg: 24, meals: 60 };
    p.innerHTML = `${pageHead('AI Modules 07 + 08 · NGO Matching & Smart Logistics · <b>Demo engines</b>', 'From surplus to served.', 'Transparent match scoring, then route optimization — every step measured against the do-nothing baseline.')}
  <div class="grid" style="grid-template-columns:1fr 1.6fr">
    <div class="card rise"><div class="card-h"><div><span class="kicker">SURPLUS LISTING</span><h3>${listing.item}</h3></div>${riskBadge('HIGH')}</div>
      <div style="display:flex;gap:20px"><div><span class="kicker">Quantity</span><div class="num" style="font-size:21px">${listing.kg} kg</div></div><div><span class="kicker">≈ Meals</span><div class="num" style="font-size:21px">${listing.meals}</div></div><div><span class="kicker">Pickup deadline</span><div class="num" style="font-size:21px;color:var(--amber)">7:00 PM</div></div></div>
      <div class="hr"></div>
      <button class="btn btn-acc" style="width:100%;justify-content:center" onclick="runMatch()"><i data-lucide="sparkles"></i> ${S.matchState === 'done' ? 'Re-run AI match' : 'Run AI NGO match'}</button>
      <div id="matchArea" style="margin-top:14px"></div>
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">SMART LOGISTICS · ROUTE OPTIMIZATION</span><h3>Pickup → delivery network</h3></div><span class="demo-note">SIMULATED ROUTING · API-SWAPPABLE</span></div>
      <div id="mapHost">${routeMap(false)}</div>
      <div id="routeStats"><div style="display:flex;gap:22px;flex-wrap:wrap;margin-top:12px" class="muted small">Original route <b class="num" style="color:var(--ink)">${S.route.orig} km</b> · run an AI match and dispatch to see the optimized route.</div></div>
      <div id="dispatchArea" style="margin-top:12px"></div>
    </div>
  </div>`;
    icons(); reveal(p);
    if (S.matchState === 'done') renderMatches(true);
    if (S.routeOptimized) showRouteStats();
    if (S.dispatch > 0) renderDispatch();
}
function runMatch() {
    if (S.dispatch > 0) { toast('Delivery already in progress for this listing.', 'warn'); return }
    S.matchState = 'scanning'; const area = $('#matchArea');
    area.innerHTML = `<div style="font-family:var(--mono);font-size:11px;color:var(--acc)" id="mLog"></div>`;
    const lines = ['Scanning 14 registered NGOs…', 'Filtering: dietary compatibility (veg)…', 'Filtering: pickup availability before 7:00 PM…', 'Scoring: distance · capacity · urgency · reliability…'];
    let i = 0; const iv = setInterval(() => { if (i < lines.length) { $('#mLog').innerHTML = lines[i] + '<span class="cur" style="display:inline-block;width:7px;height:11px;background:var(--acc);vertical-align:-1px"></span>'; i++ } else { clearInterval(iv); S.matchState = 'done'; S.services.find(s => s.id === 'match').count++; logAudit('AI match computed: Helping Hands Foundation 96%'); flowSet('match', 1); renderMatches(); toast('Top match: Helping Hands Foundation · 96%', 'ok') } }, 650);
}
function renderMatches(instant) {
    const area = $('#matchArea');
    area.innerHTML = S.ngos.map((n, i) => `<div class="card" style="margin-bottom:10px;padding:13px 15px;border-color:${i === 0 && S.matchState === 'done' ? 'rgba(200,240,75,.4)' : 'var(--line)'}">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><b>${n.name}</b> ${i === 0 ? '<span class="badge acc">TOP MATCH</span>' : ''}<div class="faint small mono">${n.d} km · capacity ${n.cap} meals · reliability ${n.rel}% · pickup ${n.avail ? 'available' : 'busy'}</div></div>
      <div style="text-align:right"><div class="num" style="font-size:21px;color:${i === 0 ? 'var(--acc)' : 'var(--ink2)'}" data-cnt="${n.score}">0%</div><span class="kicker">match</span></div></div>
    ${i === 0 ? `<details class="expandable" style="margin-top:8px"><summary>Score breakdown</summary><div style="margin-top:8px">${Object.entries(n.br).map(([k, v]) => `<div class="frow" style="grid-template-columns:150px 1fr 34px"><span class="muted small">${k}</span><div class="fb"><i data-w="${v * 3}"></i></div><b>${v}</b></div>`).join('')}</div></details>` : ''}
    ${n.avail ? `<button class="btn btn-sm ${i === 0 ? 'btn-acc' : ''}" style="margin-top:10px" onclick="selectNgo(${i})">Select & optimize route</button>` : `<span class="badge dim" style="margin-top:10px">NO PICKUP WINDOW</span>`}
  </div>`).join('');
    area.querySelectorAll('[data-cnt]').forEach((el, i) => { const to = +el.dataset.cnt; if (instant) { el.textContent = to + '%' } else setTimeout(() => countUp(el, to, { dur: 800, suffix: '%' }), 120 * i) });
    reveal(area);
}
function selectNgo(i) {
    S.selNgo = S.ngos[i]; S.routeOptimized = true; flowSet('optimize', 1); S.services.find(s => s.id === 'route').count++;
    showRouteStats(); toast(`Route optimized for ${S.selNgo.name}: 18.2 → 13.9 km (−23.6%).`, 'ok'); logAudit('Route optimized: 13.9 km via nearest-neighbour + 2-opt (demo)'); renderDispatch(true)
}
function showRouteStats() {
    const opt = $('#routeOpt'), orig = $('#routeOrig'); if (!opt) return;
    [opt, orig].forEach(pth => { const L = pth.getTotalLength(); pth.style.strokeDasharray = pth.id === 'routeOrig' ? '7 7' : L; pth.style.strokeDashoffset = pth.id === 'routeOrig' ? 0 : L; pth.getBoundingClientRect(); if (pth.id === 'routeOpt') { pth.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,.8,.3,1)'; pth.style.strokeDashoffset = 0 } });
    const v = $('#vehicle'); v.setAttribute('opacity', 1);
    const L = opt.getTotalLength(); const t0 = performance.now();
    (function mv(t) { const p = clamp((t - t0) / 4200, 0, 1), e2 = 1 - Math.pow(1 - p, 2); const pt = opt.getPointAtLength(L * e2); v.setAttribute('cx', pt.x); v.setAttribute('cy', pt.y); if (p < 1 && S.routeOptimized) requestAnimationFrame(mv) })(t0);
    $('#routeStats').innerHTML = `<div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:12px">
    <div><span class="kicker">Original route</span><div class="num" style="font-size:19px">${S.route.orig} km</div></div>
    <div><span class="kicker">AI optimized route</span><div class="num" style="font-size:19px;color:var(--acc)">${S.route.opt} km</div></div>
    <div><span class="kicker">Distance reduced</span><div class="num" style="font-size:19px;color:var(--teal)">23.6%</div></div>
    <div><span class="kicker">Fuel saving (est.)</span><div class="num" style="font-size:19px">0.9 L</div></div>
    <div><span class="kicker">CO₂ reduction (est.)</span><div class="num" style="font-size:19px;color:var(--teal)">${S.route.co2} kg</div></div>
    <div><span class="kicker">ETA</span><div class="num" style="font-size:19px">${S.route.eta} min</div></div></div>`;
}
function renderDispatch(auto) {
    const area = $('#dispatchArea'); if (!area) return;
    const steps = ['Request received', 'Pickup assigned · EV-07', 'Picked up at kitchen', 'In transit · optimized route', 'Delivered & confirmed'];
    if (S.delivered) S.dispatch = 5;
    area.innerHTML = `<div class="hr"></div><span class="kicker">DISPATCH · ${S.selNgo ? S.selNgo.name : '—'}</span>
  <div class="timeline" style="margin-top:12px">${steps.map((s, i) => `<div class="tl ${i < S.dispatch ? 'done' : i === S.dispatch ? 'now' : ''}"><div class="tdot">${i < S.dispatch ? '<i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i>' : ''}</div><div class="small ${i <= S.dispatch ? '' : 'faint'}">${s}</div></div>`).join('')}</div>
  ${S.delivered ? `<div style="padding:12px;border:1px solid rgba(91,200,175,.4);background:rgba(91,200,175,.07);border-radius:10px"><b class="small" style="color:var(--teal)">Donation delivered — 58 of 60 meals accepted (2 meals handling loss).</b><div class="faint small mono">Impact engine updated automatically.</div></div>`
            : `<button class="btn btn-acc btn-sm" onclick="advanceDispatch()">${S.dispatch === 0 ? 'Dispatch pickup now' : 'Simulate next status'}</button>`}`;
    icons();
}
function advanceDispatch() {
    if (S.delivered) return;
    S.dispatch = Math.min(5, S.dispatch + 1);
    if (S.dispatch === 1) { toast('EV-07 assigned · heading to Campus Kitchen.', 'ok'); logAudit('Pickup dispatched: EV-07') }
    if (S.dispatch === 3) { addAlert('SUCCESS', 'Surplus picked up — 24 kg en route to ' + (S.selNgo ? S.selNgo.name : 'NGO'), 'EV-07 · ETA 24 min', 'truck') }
    if (S.dispatch === 5) {
        S.delivered = true; flowSet('redistribute', 1); flowSet('measure', 1);
        const d = { meals: 58, kg: 23.2, co2: 52.5, water: 346, money: 2657 };
        S.demoDelta = d; Object.assign(S.impact, { savedKg: S.impact.savedKg + d.kg, meals: S.impact.meals + d.meals, co2T: +(S.impact.co2T + 0.053).toFixed(2), waterL: S.impact.waterL + d.water, money: S.impact.money + d.money, preventedKg: S.impact.preventedKg + 4.8 });
        addAlert('SUCCESS', 'Donation successfully delivered.', '58 meals · ' + (S.selNgo ? S.selNgo.name : 'Helping Hands Foundation'), 'check-circle-2');
        logAudit('Delivery confirmed: 58 meals to ' + (S.selNgo ? S.selNgo.name : 'Helping Hands Foundation'));
        toast('Delivery confirmed — impact engine updated: 58 meals saved.', 'ok');
    }
    renderApp();
}
function pgProcessing(p, emb) {
    p = p || $('#page');
    const anomaly = S.processing.anomaly; const resolved = S.energyResolved;
    const cur = S.energy.actual[14], exp = S.energy.expected[14], dev = +(((cur - exp) / exp) * 100).toFixed(1);
    p.innerHTML = `${pageHead('AI Modules 09 + 10 · Processing Efficiency & Energy · <b>Demo anomaly detection</b>', 'Find the losses humans miss.', 'Statistical anomaly detection across lines, downtime, rejection, and refrigeration energy — z-score + isolation-style scoring (demo).')}
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr 1fr">
    ${[['Raw material used', '4.2 t', 'wheat'], ['Output yield', '87.4%', 'package'], ['Rejected quantity', '+4.2 pts', 'x-circle'], ['Machine downtime (24 h)', '2.3 h', 'timer-off']].map(k => `<div class="card rise"><i data-lucide="${k[2]}" style="color:var(--acc)"></i><div class="num" style="font-size:22px;margin:6px 0 2px">${k[1]}</div><span class="kicker">${k[0]}</span></div>`).join('')}
  </div>
  <div class="grid" style="grid-template-columns:1.3fr 1fr;margin-top:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">ENERGY · ACTUAL VS EXPECTED (kWh)</span><h3>Storage & processing load · 24 h</h3></div>
      <button class="btn btn-sm" onclick="injectEnergy()"><i data-lucide="zap"></i> Inject anomaly</button></div>
      <div id="enChart" data-h="220"></div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:12px">
        <div><span class="kicker">Current</span><div class="num" style="font-size:20px;color:${dev > 15 ? 'var(--red)' : 'var(--ink)'}" id="enCur">${resolved ? exp.toFixed(1) : cur} kWh</div></div>
        <div><span class="kicker">Expected</span><div class="num" style="font-size:20px" id="enExp">${exp.toFixed(1)} kWh</div></div>
        <div><span class="kicker">Anomaly</span><div class="num" style="font-size:20px;color:${resolved ? 'var(--teal)' : 'var(--red)'}" id="enDev">${resolved ? 'resolved' : '+' + dev + '%'}</div></div>
        <div><span class="kicker">Anomaly score</span><div class="num" style="font-size:20px" id="enSc">${resolved ? '0.06' : '0.83'}</div></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card rise" style="border-color:${resolved ? 'var(--line)' : 'rgba(242,112,89,.4)'}">
        <div class="card-h"><div><span class="kicker">${resolved ? '✦ RESOLVED · ANOMALY DETECTION' : '✦ AI ANOMALY DETECTED'}</span><h3>${resolved ? 'Refrigeration load normalized' : 'Energy consumption +' + dev + '%'}</h3></div><span class="badge ${resolved ? 'ok' : 'crit'}">${resolved ? 'RESOLVED' : 'CRITICAL'}</span></div>
        <p class="small muted">Current consumption <b style="color:var(--ink)">${resolved ? exp.toFixed(1) : cur} kWh</b> vs expected <b style="color:var(--ink)">${exp.toFixed(1)} kWh</b>${resolved ? '.' : ' — the deviation pattern matches a refrigeration defrost fault or door-seal leak.'}</p>
        <p class="small" style="margin-top:8px;color:var(--acc)">✦ Recommendation: ${resolved ? 'Monitoring continues. No action needed.' : 'Inspect refrigeration unit B.'}</p>
        ${resolved ? '' : `<button class="btn btn-sm btn-acc" style="margin-top:12px" onclick="resolveEnergy()">Dispatch inspection</button>`}
      </div>
      <div class="card rise"><div class="card-h"><div><span class="kicker">✦ AI ANOMALY · PROCESSING</span><h3>${anomaly.title}</h3></div><span class="badge high">z = ${anomaly.z}</span></div>
        <p class="small muted">Isolation-style score <b class="mono" style="color:var(--ink)">${anomaly.if}</b> (demo model). Likely contributing factors:</p>
        <div style="margin-top:8px">${factorBars(anomaly.factors)}</div>
        <p class="small" style="margin-top:8px;color:var(--acc)">✦ Recommended action: ${anomaly.action}</p>
        <button class="btn btn-sm" style="margin-top:10px" onclick="toast('Inspection work order created for Line 2.','ok');logAudit('Anomaly action: inspect Processing Line 2')">Create work order</button>
      </div>
      <div class="card pad0 rise"><table class="tbl"><thead><tr><th>Line</th><th>OEE</th><th>Loss</th><th>Status</th></tr></thead><tbody>
        ${S.processing.lines.map(l => `<tr><td style="font-weight:600">${l.n}</td><td class="num">${l.oee}%</td><td class="num ${l.loss > 8 ? 'down' : ''}">${l.loss}%</td><td><span class="badge ${l.flag ? 'warn' : 'ok'}">${l.flag ? 'DEGRADED' : 'NORMAL'}</span></td></tr>`).join('')}
      </tbody></table></div>
    </div>
  </div>`;
    icons(); reveal(p);
    const a = [...S.energy.actual]; if (resolved) a[14] = exp, a[15] = 14.2, a[16] = 13.8;
    chart($('#enChart'), { labels: S.energy.hours.map(h => h % 4 === 0 ? h + 'h' : ''), series: [{ data: S.energy.expected, name: 'expected', color: C.ink3, dash: [5, 5] }, { data: a, name: 'actual', color: resolved ? C.teal : C.amber, pts: !resolved, fill: hexA(resolved ? C.teal : C.amber, .07) }], tipFmt: v => v.toFixed(1) });
}
function injectEnergy() { S.energy.actual[14] = 18.7; S.energyResolved = false; toast('Anomaly injected: refrigeration load +41.6%.', 'warn'); pgProcessing() }
function resolveEnergy() { S.energyResolved = true; S.energy.actual[14] = 13.4; logAudit('Energy anomaly resolved: refrigeration unit B inspected'); toast('Unit B inspected — consumption back to expected range.', 'ok'); S.recs.find(r => r.id === 'coldB').applied = true; pgProcessing() }
function pgIoT() {
    const p = $('#page');
    p.innerHTML = `${pageHead('IoT · Smart Storage Monitoring · <b>Simulated MQTT stream</b>', 'Sensors that talk to the AI.', 'Live temperature, humidity, gas and door telemetry with AI anomaly detection — the demo stream updates every few seconds.')}
  <div class="card rise"><div class="card-h"><span class="kicker">DATA PATH</span><span class="badge dim">ARCHITECTURE</span></div>
    <div class="mqttdiag">${['IoT Sensors', 'MQTT Broker', 'Backend Ingest', 'Time-series Store', 'AI Anomaly Detection', 'Alert + Recommendation'].map((n, i) => `<div class="mnode">${n}</div>${i < 5 ? '<div class="mflow"></div>' : ''}`).join('')}</div></div>
  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:16px" id="sensorGrid">
    ${S.sensors.map((s, i) => `<div class="card rise" id="sens${i}" style="border-color:${s.status !== 'NORMAL' ? 'rgba(242,112,89,.4)' : 'var(--line)'}">
      <div class="card-h"><div><span class="kicker">${s.type.toUpperCase()} · SIMULATED SENSOR</span><h3>${s.name}</h3></div><span class="badge ${s.status === 'NORMAL' ? 'ok' : s.status === 'ALERT' ? 'crit' : 'monitor'}" id="sensSt${i}">${s.status}</span></div>
      <div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap">
        <div><span class="kicker">Temperature</span><div class="sensorbig" id="sensT${i}">${s.temp.toFixed(1)}°C</div></div>
        <div><span class="kicker">Humidity</span><div class="sensorbig" style="font-size:19px" id="sensH${i}">${s.hum}%</div></div>
        <div><span class="kicker">Gas / Ethylene</span><div class="sensorbig" style="font-size:19px">${s.gas}</div></div>
        <div><span class="kicker">Door</span><div class="sensorbig" style="font-size:19px">${s.door}</div></div>
        <div style="flex:1;min-width:120px"><span class="kicker">24 h trend</span><div class="spks" data-i="${i}"></div></div>
      </div>
      <div id="sensAlert${i}"></div>
    </div>`).join('')}
  </div>
  <p class="demo-note" style="margin-top:12px">SIMULATED SENSORS for the SIH demo. Production path: ESP32 / sensor nodes → MQTT → Node ingest → time-series DB → anomaly model → alert engine. Cold rooms safe band: 2–6 °C.</p>`;
    icons(); reveal(p);
    $$('.spks').forEach(el => spark(el, S.sensors[+el.dataset.i].hist, C.teal, 34));
    if (!S._iotTimer) { S._iotTimer = true; setInterval(iotTick, 3000) }
}
function iotTick() {
    if (S.page !== 'iot') return;
    S.sensors.forEach((s, i) => {
        if (s.name === 'Cold Storage B' && !S.energyResolvedIoT) {
            s.drift = (s.drift || 0) + 0.62; s.temp = s.base + s.drift;
            if (s.temp >= 9.8) {
                s.temp = 9.8; s.status = 'ALERT';
                if (!S.iotAlerted) {
                    S.iotAlerted = true; addAlert('HIGH', 'Storage temperature exceeded safe operating threshold.', 'Cold Storage B · 9.8 °C · AI alert raised', 'thermometer'); toast('AI ALERT: Cold Storage B at 9.8 °C — quality deterioration risk.', 'crit');
                    const sa = $('#sensAlert1'); if (sa) sa.innerHTML = `<div style="margin-top:12px;padding:12px;border:1px solid rgba(242,112,89,.4);background:rgba(242,112,89,.07);border-radius:10px"><span class="kicker" style="color:var(--red)">✦ AI ALERT</span><p class="small" style="margin-top:5px">Potential food quality deterioration risk. Move high-risk batches to Cold Storage A and inspect the compressor.</p><button class="btn btn-sm btn-acc" style="margin-top:9px" onclick="fixColdB()">Dispatch maintenance</button></div>`; icons()
                }
            }
        }
        else if (s.name === 'Cold Storage B' && S.coldBFixed) { s.temp = Math.max(s.base, s.temp - 0.5); if (Math.abs(s.temp - s.base) < 0.2) s.status = 'NORMAL' }
        else s.temp = s.base + Math.sin(now() / 9000 + i) * 0.4;
        s.hum = clamp(s.hum + (Math.random() - .5) * 1.6, 40, 75);
        s.hist.push(s.temp); s.hist.shift();
        const t = $('#sensT' + i); if (!t) return;
        t.textContent = s.temp.toFixed(1) + '°C'; t.style.color = s.status === 'NORMAL' ? 'var(--ink)' : 'var(--red)';
        $('#sensH' + i).textContent = Math.round(s.hum) + '%';
        const st = $('#sensSt' + i); st.textContent = s.status; st.className = 'badge ' + (s.status === 'NORMAL' ? 'ok' : 'crit');
        const card = $('#sens' + i); card.style.borderColor = s.status === 'NORMAL' ? 'var(--line)' : 'rgba(242,112,89,.4)';
    });
    $$('.spks').forEach(el => { el.innerHTML = ''; spark(el, S.sensors[+el.dataset.i].hist, C.teal, 34) });
}
function fixColdB() { S.coldBFixed = true; S.sensors[1].status = 'NORMAL'; toast('Maintenance dispatched — temperature recovering.', 'ok'); logAudit('IoT alert resolved: Cold Storage B inspected'); const sa = $('#sensAlert1'); if (sa) sa.innerHTML = `<div style="margin-top:12px;padding:12px;border:1px solid rgba(91,200,175,.4);background:rgba(91,200,175,.06);border-radius:10px"><span class="kicker" style="color:var(--teal)">✦ RESOLVED</span><p class="small" style="margin-top:5px">Compressor restarted. Temperature returning to safe band.</p></div>` }