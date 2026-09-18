/* ============================================================
   FOODWISE AI · 08-pages-ai.js
   AI Module pages: 01 Demand Forecast, 02+06 Surplus & Waste,
   03 FoodVision AI (computer vision), 04+05 Inventory & Shelf Life.
   ============================================================ */
function pgForecast() {
    const p = $('#page'); const d = S.f7[S.selDay], rec = AI.demand(S.selDay);
    const f30 = AI.forecast30(); const tot30 = f30.reduce((a, b) => a + b.v, 0);
    p.innerHTML = `${pageHead('AI Module 01 · Demand Forecasting · <b>Demo model</b>', 'How many meals will tomorrow need?', 'Historical consumption + weekday + attendance + events + weather + previous waste → prediction, confidence, and a production recommendation.')}
  <div class="grid" style="grid-template-columns:1.7fr 1fr">
    <div class="card rise"><div class="card-h"><div><span class="kicker">ACTUAL VS PREDICTED · CONFIDENCE INTERVAL</span><h3>Campus Kitchen · meals/day</h3></div>
      <div style="display:flex;gap:6px"><button class="btn btn-sm ${S.range !== '30' ? 'btn-acc' : ''}" id="r7" onclick="fcRange('7')">7-day</button><button class="btn btn-sm ${S.range === '30' ? 'btn-acc' : ''}" id="r30" onclick="fcRange('30')">30-day</button></div></div>
      <div id="fcMain" data-h="270"></div>
      <div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap" id="daySel">
        ${S.f7.map((f, i) => `<button class="btn btn-sm ${i === S.selDay ? 'btn-acc' : ''}" onclick="fcDay(${i})">${f.d} ${f.date.slice(4)}${f.event ? ' <i data-lucide="party-popper" style="width:11px;height:11px"></i>' : ''}</button>`).join('')}
      </div></div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">PREDICTION DETAIL · <span id="dSel">${d.d} ${d.date}</span></span><h3 id="dTitle">${d.v} meals</h3></div>${confPill(d.c)}</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:space-between"><span class="muted small">Predicted demand</span><b class="num" id="dPred">${d.v}</b></div>
        <div style="display:flex;justify-content:space-between"><span class="muted small">Confidence interval</span><b class="num" id="dCI">${N(AI.demand(S.selDay).lo)} – ${N(AI.demand(S.selDay).hi)}</b></div>
        <div style="display:flex;justify-content:space-between"><span class="muted small">Recommended production</span><b class="num" style="color:var(--acc)" id="dRec">${rec.rec}</b></div>
        <div style="display:flex;justify-content:space-between"><span class="muted small">Expected surplus</span><b class="num" id="dSur">≈ ${Math.round((rec.rec - d.v) * .5)} meals</b></div>
        <div style="display:flex;justify-content:space-between"><span class="muted small">Expected waste</span><b class="num" id="dWas">&lt; 5 meals</b></div>
      </div>
      <div class="hr"></div>
      <span class="kicker">✦ AI EXPLANATION</span>
      <p class="small muted" style="margin-top:6px" id="dExp">${d.event ? 'A cultural fest is registered for Saturday — footfall models predict +9% over a normal weekend, with higher variance (confidence drops to 87%).' : `Demand is predicted to ${d.v >= 910 ? 'increase' : 'moderate'} because it is a ${d.d} — historical ${d.d}s average ${d.d === 'Tue' ? 918 : 'above the weekly mean'} and 2 campus events are registered. Weather is clear (24°C), which historically raises cafeteria walk-ins by ~2%.`}</p>
      <div class="hr"></div>
      <span class="kicker">WHY DID AI PREDICT THIS?</span>
      <div style="margin-top:8px" id="dFac">${factorBars([{ n: 'Day-of-week effect', p: 38 }, { n: 'Expected attendance', p: 27 }, { n: 'Event calendar', p: 17 }, { n: 'Weather', p: 12 }, { n: 'Recent trend', p: 6 }])}</div>
      <details class="expandable" style="margin-top:10px"><summary>Model card</summary>
        <p class="small muted" style="margin-top:8px">Gradient-boosted regression baseline trained on <b class="mono">food_demand.csv</b> (synthetic, 180 days). Features: 15. Holdout MAE <b class="mono">3.1%</b> — <b>synthetic holdout, demo only.</b> Designed for retraining on real institutional data.</p></details>
      <button class="btn btn-acc btn-sm" style="margin-top:14px;width:100%;justify-content:center" onclick="toast('Production plan ${rec.rec} meals sent to kitchen display.','ok');logAudit('Production plan accepted: '+rec.rec+' meals ('+d.d+')');flowSet('prevent',1)"><i data-lucide="send"></i> Send production plan to kitchen</button>
    </div>
  </div>
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr;margin-top:16px">
    ${[['30-day total demand', N(tot30) + ' meals', 'calendar-days'], ['Avg daily forecast', N(Math.round(tot30 / 30)) + ' meals', 'sigma'], ['Peak day', 'Sat · 968 (fest)', 'flame']].map(k => `<div class="card rise"><i data-lucide="${k[2]}" style="color:var(--acc)"></i><div class="num" style="font-size:22px;margin:6px 0 2px">${k[1]}</div><span class="kicker">${k[0]}</span></div>`).join('')}
  </div>`;
    icons(); reveal(p); fcChart();
}
function fcRange(r) { S.range = r; pgForecast() }
function fcDay(i) { S.selDay = i; pgForecast() }
function fcChart() {
    const host = $('#fcMain'); if (!host) return;
    if (S.range === '7') {
        const lo = S.f7.map(f => AI.demand(S.f7.indexOf(f)).lo), hi = S.f7.map(f => AI.demand(S.f7.indexOf(f)).hi);
        const labels = [...S.hist.map((_, i) => 'D-' + (14 - i)), 'T', '+1', '+2', '+3', '+4', '+5', '+6'];
        chart(host, {
            labels, series: [
                { data: [...S.hist, null, null, null, null, null, null, null], name: 'actual', color: C.ink2, fill: fillA(C.ink2, .05) },
                { data: [...Array(14).fill(null), S.hist[14], ...S.f7.map(f => f.v)], name: 'AI forecast', color: C.acc, pts: true }], band: { lo: [...Array(15).fill(null), ...lo], hi: [...Array(15).fill(null), ...hi] }, splitAt: 15, splitLbl: 'AI forecast →', tipFmt: Math.round, min: 760
        });
    } else {
        const f30 = AI.forecast30();
        chart(host, { labels: f30.map((_, i) => i % 5 === 0 ? 'D+' + i : ''), series: [{ data: f30.map(f => f.v), name: 'forecast', color: C.acc, fill: hexA(C.acc, .06) }], band: { lo: f30.map(f => f.v * .93), hi: f30.map(f => f.v * 1.07) }, splitAt: 1, tipFmt: Math.round, min: 760 });
    }
}
function pgSurplus() {
    const p = $('#page');
    p.innerHTML = `${pageHead('AI Modules 02 + 06 · Surplus & Waste Prediction · <b>Demo models</b>', 'Prevent the waste before it exists.', 'Surplus is predicted before cooking; waste is attributed to causes with explainable feature importance.')}
  <div class="grid" style="grid-template-columns:1fr 1.4fr">
    <div class="card rise"><div class="card-h"><div><span class="kicker">AI MODULE 02 · SURPLUS PREDICTION</span><h3>Tomorrow · current plan 1,020 meals</h3></div></div>
      <div style="display:flex;align-items:center;gap:20px">${gaugeSVG(S.surplus.prob, 'var(--red)')}
      <div><div><span class="kicker">Surplus probability</span><div class="num" style="font-size:24px;color:var(--red)">${S.surplus.prob}%</div></div>
      <div style="margin-top:8px"><span class="kicker">Expected surplus</span><div class="num" style="font-size:24px">${S.surplus.kg} kg</div></div>
      <div style="margin-top:8px">${riskBadge(S.surplus.risk)} <span class="badge monitor">BEFORE IT HAPPENS</span></div></div></div>
      <div class="hr"></div>
      <div style="padding:12px;border:1px solid rgba(242,184,75,.35);background:rgba(242,184,75,.07);border-radius:10px">
        <span class="kicker" style="color:var(--amber)">✦ RECOMMENDED ACTION</span>
        <p class="small" style="margin-top:5px">${S.surplus.action}</p>
        <button class="btn btn-sm ${S.surplus.accepted ? '' : 'btn-acc'}" style="margin-top:10px" ${S.surplus.accepted ? 'disabled' : ''} onclick="S.surplus.accepted=true;flowSet('prevent',1);logAudit('Surplus action accepted: production set to 940 meals');toast('Plan updated to 940 meals. Expected surplus: 20 meals.','ok');pgSurplus()">${S.surplus.accepted ? '✓ Applied to production plan' : 'Apply to production plan'}</button>
      </div>
      <div class="hr"></div><span class="kicker">WHY THIS PREDICTION?</span>
      <div style="margin-top:8px">${factorBars(S.surplus.factors)}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card rise"><div class="card-h"><div><span class="kicker">AI MODULE 06 · WASTE PREDICTION</span><h3>Predicted waste tomorrow: <span class="num" style="color:var(--amber)">${S.waste.kg} kg</span></h3></div>${confPill(88)}</div>
        <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
          <div style="min-width:220px">${S.waste.causes.map(c => `<div class="frow" style="grid-template-columns:130px 1fr 40px"><span class="muted small">${c.n}</span><div class="fb"><i data-w="${c.p}%" style="background:${c.n === 'Overproduction' ? 'var(--red)' : 'var(--amber)'}"></i></div><b>${c.p}%</b></div>`).join('')}</div>
          <div style="flex:1;min-width:200px"><span class="kicker">✦ AI RECOMMENDATION</span>
          <p class="small" style="margin-top:5px">Reduce rice production by <b>24 kg</b> and prioritize batches M-102 and S-207 for redistribution${S.waste.kg !== S.waste.afterKg ? `. After accepted recommendations, forecast improves to <b style="color:var(--teal)">${S.waste.afterKg} kg</b>.` : '.'}</p>
          <div class="hr" style="margin:10px 0"></div><span class="kicker">MAIN CAUSE</span><p class="small muted">Overproduction — 61% of expected waste. Feature importance below.</p></div>
        </div>
        <details class="expandable" style="margin-top:10px"><summary>Explainable AI · feature importance</summary>
          <div style="margin-top:10px">${factorBars(S.waste.factors)}</div>
          <p class="demo-note" style="margin-top:8px">Random Forest baseline (demo) · synthetic training data · z-score of planned-vs-forecast gap = 2.4σ</p></details>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="card rise"><div class="card-h"><span class="kicker">WASTE TREND</span><span class="tag">10 days</span></div><div id="swW" data-h="160"></div></div>
        <div class="card rise"><div class="card-h"><span class="kicker">SURPLUS TREND</span><span class="tag">7 days</span></div><div id="swS" data-h="160"></div></div>
      </div>
    </div>
  </div>`;
    icons(); reveal(p);
    chart($('#swW'), { labels: ['-9', '', '', '', '', '', '', '', '', 'today'], series: [{ data: S.wasteTrend, color: C.amber, fill: hexA(C.amber, .12), pts: true }], tipFmt: Math.round, min: 0 });
    chart($('#swS'), { labels: ['D-6', '', '', '', '', '', 'today'], bars: { data: S.surplusTrend, color: C.red }, tipFmt: Math.round });
}
function pgVision() {
    const p = $('#page');
    p.innerHTML = `${pageHead('AI Module 03 · FoodVision AI · Computer Vision · <b>Demo inference</b>', 'See food quality before it becomes waste.', 'Freshness, spoilage regions and shelf-life estimation from an image. Pluggable interface — swap the heuristic for a YOLOv8/OpenCV model in production. <b>Not a food-safety certification.</b>')}
  <div class="grid" style="grid-template-columns:1fr 1.3fr">
    <div class="card rise"><div class="card-h"><div><span class="kicker">INPUT</span><h3>Capture or select a sample</h3></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="vSamples"></div>
      <div class="hr"></div>
      <label class="btn" style="width:100%;justify-content:center"><i data-lucide="upload"></i> Upload food image <input type="file" accept="image/*" capture="environment" style="display:none" onchange="visionUpload(this)"></label>
      <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
        <span class="kicker">Food type</span>
        <select id="vType" style="flex:1;background:var(--bg3);border:1px solid var(--line2);color:var(--ink);border-radius:7px;padding:7px 10px">
          <option>Tomato</option><option>Cooked rice</option><option>Mixed salad</option><option>Cooked curry</option><option>Bread / bakery</option><option>Fruit (cut)</option><option>Dairy</option></select>
        <button class="btn btn-sm btn-acc" onclick="visionRun()">Analyze <i data-lucide="scan-eye"></i></button>
      </div>
    </div>
    <div class="card rise"><div class="card-h"><div><span class="kicker">ANALYSIS</span><h3 id="vHead">Select a sample and run the scan</h3></div><span id="vState"></span></div>
      <div id="vStage"><div class="scanbox" id="vBox" style="aspect-ratio:4/3;display:grid;place-items:center"><span class="faint small">No image loaded</span></div></div>
      <div id="vResult"></div>
    </div>
  </div>`;
    const samples = [['tomato', 'Tomato · fresh-ish', 82], ['rice', 'Cooked rice tray', 91], ['salad', 'Salad · degraded', 58]];
    $('#vSamples').innerHTML = samples.map(s => `<button class="samplebtn ${S.vSel === s[0] ? 'sel' : ''}" onclick="S.vSel='${s[0]}';pgVision()"><canvas data-food="${s[0]}" width="300" height="200"></canvas><div class="sl">${s[1]}</div></button>`).join('');
    $$('#vSamples canvas').forEach(cv => paintFood(cv, cv.dataset.food));
    icons(); reveal(p);
}
function paintFood(cv, kind, degraded) {
    const x = cv.getContext('2d'), W = cv.width, Hh = cv.height;
    x.fillStyle = '#20261f'; x.fillRect(0, 0, W, Hh);
    x.fillStyle = '#2b332a'; x.beginPath(); x.roundRect(14, 14, W - 28, Hh - 28, 16); x.fill();
    const rnd = mulberry(kind.length * 97 + 7);
    function ball(cx, cy, r, c1, c2) { const g = x.createRadialGradient(cx - r / 3, cy - r / 3, r / 6, cx, cy, r); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill() }
    if (kind === 'tomato') {
        const spots = [[90, 100, 34], [165, 80, 30], [240, 105, 32], [95, 160, 28], [170, 150, 33], [245, 160, 29], [140, 115, 26], [210, 130, 24], [120, 130, 22]];
        spots.forEach((s, i) => { ball(s[0], s[1], s[2], '#e05545', '#8f2c22'); if (i === 4 && degraded !== false) { x.fillStyle = 'rgba(70,45,25,.75)'; x.beginPath(); x.arc(s[0] + 6, s[1] + 4, 10, 0, 7); x.fill() } x.fillStyle = '#4a7c3a'; x.beginPath(); x.arc(s[0], s[1] - s[2] + 3, 4, 0, 7); x.fill() })
    }
    if (kind === 'rice') {
        x.fillStyle = '#e9e4d2'; x.beginPath(); x.ellipse(150, 105, 120, 62, 0, 0, 7); x.fill();
        for (let i = 0; i < 260; i++) { const a = rnd() * 7, r = Math.sqrt(rnd()) * 1; x.fillStyle = rnd() > .5 ? '#d9d2bc' : '#f4efdd'; x.fillRect(150 + Math.cos(a) * 120 * Math.sqrt(rnd()), 105 + Math.sin(a) * 58 * Math.sqrt(rnd()), 4, 2) }
    }
    if (kind === 'salad') {
        for (let i = 0; i < 70; i++) {
            const cx = 40 + rnd() * 220, cy = 30 + rnd() * 140, r = 8 + rnd() * 13; const bad = i % 5 === 0 && degraded !== false;
            ball(cx, cy, r, bad ? '#7a6a35' : (i % 2 ? '#69a244' : '#c74a3c'), bad ? '#4c3f1c' : (i % 2 ? '#2f5a22' : '#7c241c'))
        }
    }
    x.strokeStyle = 'rgba(0,0,0,.25)'; x.strokeRect(14, 14, W - 28, Hh - 28);
}
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
let vImgMeta = null;
function visionUpload(inp) {
    const f = inp.files[0]; if (!f) return; const img = new Image(); img.onload = () => {
        const cv = document.createElement('canvas'); cv.width = 480; cv.height = 320; const x = cv.getContext('2d'); x.drawImage(img, 0, 0, 480, 320);
        const d = x.getImageData(0, 0, 480, 320).data; let dark = 0, brown = 0, tot = 0; const cells = {};
        for (let yy = 0; yy < 320; yy += 8)for (let xx = 0; xx < 480; xx += 8) {
            const i = (yy * 480 + xx) * 4, r = d[i], g = d[i + 1], b = d[i + 2]; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const v = mx / 255, s = mx ? (mx - mn) / mx : 0;
            tot++; if (v < .25) dark++; const cellKey = Math.floor(xx / 96) + '_' + Math.floor(yy / 80); cells[cellKey] = cells[cellKey] || { dark: 0, n: 0 }; cells[cellKey].n++; if (v < .3 && s > .15) { brown++; cells[cellKey].dark++ }
        }
        const dr = dark / tot, br = brown / tot; const fresh = clamp(Math.round(97 - dr * 140 - br * 160), 38, 97);
        const regions = Object.entries(cells).filter(([k, c]) => c.dark / c.n > .4).slice(0, 3).map(([k, c]) => { const [cx, cy] = k.split('_'); return { x: cx * 96, y: cy * 80, w: 96, h: 80, conf: (.82 + c.dark / c.n * .15) } });
        vImgMeta = { canvas: cv, fresh: Math.max(fresh, 40), regions: regions.length ? regions : [{ x: 180, y: 110, w: 120, h: 96, conf: .79 }], type: 'Mixed preparation' };
        S.vSel = 'upload'; toast('Image loaded — heuristic demo inference ready.'); visionRun()
    }; img.src = URL.createObjectURL(f)
}
function visionRun() {
    const stage = $('#vStage'); let box, regions = [], fresh, type = $('#vType').value;
    if (S.vSel === 'upload' && vImgMeta) { box = vImgMeta.canvas; fresh = vImgMeta.fresh; regions = vImgMeta.regions; type = vImgMeta.type }
    else {
        const cv = document.createElement('canvas'); cv.width = 480; cv.height = 320; paintFood(cv, S.vSel); box = cv;
        const map = { tomato: { f: 82, type: 'Tomato', r: [[176, 120, 96, 80, .91], [214, 124, 80, 66, .78]] }, rice: { f: 91, type: 'Cooked rice', r: [[60, 60, 150, 110, .93]] }, salad: { f: 58, type: 'Mixed salad', r: [[150, 40, 120, 100, .86], [54, 60, 100, 90, .74]] } };
        const m = map[S.vSel]; fresh = m.f; regions = m.r.map(r => ({ x: r[0] * cv.width / 480, y: r[1] * cv.height / 320, w: r[2] * cv.width / 480, h: r[3] * cv.height / 320, conf: r[4] })); type = m.type
    }
    $('#vHead').textContent = 'Scanning…'; $('#vState').innerHTML = '<span class="ai-chip">inferring…</span>';
    stage.innerHTML = `<div class="scanbox" id="vBox"></div>`;
    const sb = $('#vBox'); sb.appendChild(box); box.style.width = '100%';
    sb.insertAdjacentHTML('beforeend', '<div class="scanGrid"></div><div class="scanline"></div><div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div><div class="mono" id="scanPct" style="position:absolute;bottom:10px;right:12px;font-size:11px">0%</div>');
    let pc = 0; const iv = setInterval(() => { pc += Math.random() * 9; $('#scanPct').textContent = Math.min(99, Math.round(pc)) + '%'; if (pc >= 100) clearInterval(iv) }, 90);
    const svc = S.services.find(s => s.id === 'vision'); svc.count++; svc.last = type + ' · scanning';
    setTimeout(() => {
        clearInterval(iv);
        const q = fresh >= 80 ? 'GOOD' : fresh >= 60 ? 'FAIR' : 'POOR'; const qc = fresh >= 80 ? 'ok' : fresh >= 60 ? 'monitor' : 'crit';
        const issue = fresh >= 88 ? 'No visible issues.' : fresh >= 70 ? 'Minor surface deterioration.' : 'Localized spoilage-like patterns and discoloration detected.';
        const shelfH = Math.round(fresh / 100 * (type === 'Cooked rice' ? 6 : type === 'Dairy' ? 12 : 48));
        const rec = q === 'GOOD' ? `Prioritize consumption within ${shelfH <= 6 ? shelfH + ' hours' : '48 hours'}.` : q === 'FAIR' ? 'Prioritize consumption within 24 h or redistribute today.' : 'Do not redistribute. Segregate and log as waste.';
        regions.forEach(r => { const el = document.createElement('div'); el.className = 'dregion'; el.style.cssText = `left:${r.x / 480 * 100}%;top:${r.y / 320 * 100}%;width:${r.w / 480 * 100}%;height:${r.h / 320 * 100}%`; el.innerHTML = `<span class="rl">${type.split(' ')[0]} ${(r.conf).toFixed(2)}</span>`; sb.appendChild(el) });
        $('#scanPct').textContent = '100%';
        $('#vHead').textContent = type; $('#vState').innerHTML = `<span class="badge ${qc}">QUALITY ${q}</span>`;
        const svc2 = S.services.find(s => s.id === 'vision'); svc2.last = `${type} · ${q} ${fresh}%`; svc2.conf = Math.round((svc2.conf * 9 + (fresh >= 80 ? 93 : fresh >= 60 ? 88 : 90)) / 10);
        const seg = fresh / 100 * 20;
        $('#vResult').innerHTML = `<div class="hr"></div>
    <div style="display:flex;gap:26px;flex-wrap:wrap;align-items:center">
      <div style="flex:1;min-width:230px"><span class="kicker">FRESHNESS · <span class="mono">${fresh}%</span></span>
        <div class="meter" style="margin-top:6px">${Array.from({ length: 20 }, (_, i) => `<i style="${i < seg ? `background:${fresh >= 80 ? 'var(--teal)' : fresh >= 60 ? 'var(--amber)' : 'var(--red)'};animation:rise .3s ${i * 30}ms both` : ''}"></i>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;margin-top:4px" class="demo-note"><span>0 · spoiled</span><span>50</span><span>100 · fresh</span></div></div>
      <div><span class="kicker">EST. REMAINING SHELF LIFE</span><div class="num" style="font-size:22px">${shelfH <= 3 ? shelfH + ' h' : Math.max(1, Math.round(shelfH / 24)) + '–' + (Math.round(shelfH / 24) + 1) + ' days'}</div></div>
      <div><span class="kicker">DETECTED ISSUE</span><p class="small muted" style="max-width:200px">${issue}</p></div>
    </div>
    <div class="hr"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
      <p class="small" style="color:var(--acc)">✦ Recommendation: ${rec}</p>
      <button class="btn btn-sm btn-acc" onclick="toast('Quality record saved · passed to shelf-life engine.','ok');logAudit('FoodVision assessment: ${type} · ${q} ${fresh}%');flowSet('detect',1)"><i data-lucide="check"></i> Save & continue workflow</button>
    </div>
    <p class="demo-note" style="margin-top:10px">DEMO INFERENCE — heuristic estimator with YOLO-compatible interface. Output is a quality indicator, not a food-safety certification.</p>`;
        icons();
    }, 2100);
}
function pgInventory() {
    const p = $('#page'); const m = S.inv[3];
    p.innerHTML = `${pageHead('AI Modules 04 + 05 · Shelf-Life & Smart Inventory · <b>Demo models</b>', 'Every batch, scored by risk.', 'FEFO ordering, live countdowns, consumption-rate anomalies, and an interactive shelf-life model.')}
  <div class="grid" style="grid-template-columns:1.7fr 1fr">
    <div class="card pad0 rise"><div class="card-h" style="padding:16px 20px 0"><div><span class="kicker">SMART INVENTORY · FEFO ORDER</span><h3>${S.inv.length} active batches</h3></div><span class="ai-chip">AI risk scored</span></div>
      <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>#</th><th>Batch</th><th>Qty</th><th>Shelf life</th><th>Quality</th><th>Storage</th><th>Draw rate</th><th>Risk</th><th></th></tr></thead><tbody>
      ${S.inv.map((it, i) => `<tr><td class="faint mono">${i + 1}</td><td><b>${it.name}</b><div class="faint mono small">${it.id}</div></td><td class="num">${it.q} ${it.u}</td>
        <td class="mono ${it.risk === 'CRITICAL' ? 'down' : ''}" data-cd="${it.ts}">--:--:--</td>
        <td><div class="meter" style="width:60px;height:7px">${Array.from({ length: 6 }, (_, k) => `<i style="${k < Math.round(it.qual / 100 * 6) ? 'background:var(--teal)' : ''}"></i>`).join('')}</div></td>
        <td class="muted small">${it.store}</td><td class="small ${it.rate.includes('−') ? 'down' : 'muted'}">${it.rate}</td>
        <td>${riskBadge(it.risk)}</td>
        <td>${['CRITICAL', 'HIGH'].includes(it.risk) ? `<button class="btn btn-sm" onclick="sendToRedistribution('${it.id}')">Redistribute</button>` : ''}</td></tr>`).join('')}
      </tbody></table></div></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card rise"><div class="card-h"><div><span class="kicker">AI MODULE 04 · SHELF-LIFE MODEL</span><h3>Batch ${m.id} · ${m.name}</h3></div>${riskBadge(m.risk)}</div>
        <div class="countdown" style="color:var(--amber)" data-cd="${m.ts}">--:--:--</div>
        <span class="kicker">remaining at current conditions</span>
        <div class="hr"></div>
        <div class="field"><label>Storage temperature · <b class="mono" id="slT" style="color:var(--acc)">4 °C</b></label><input type="range" min="0" max="16" value="4" id="slR" oninput="slUpdate(this.value)"></div>
        <div class="field"><label>Humidity · <b class="mono" id="slH" style="color:var(--acc)">65%</b></label><input type="range" min="40" max="95" value="65" id="slHr" oninput="slUpdate()"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
          <div><span class="kicker">Model estimate</span><div class="num" style="font-size:24px" id="slOut">-- h</div></div>
          <div style="text-align:right"><span class="kicker">✦ Action</span><p class="small" id="slAct" style="color:var(--acc);max-width:180px">Redistribute before 7:00 PM.</p></div></div>
        <p class="demo-note" style="margin-top:8px">Heuristic Q10-style model (demo): shelf life halves per +10 °C. Quality-score adjusted.</p>
      </div>
      <div class="card rise"><div class="card-h"><div><span class="kicker">✦ AI INSIGHT</span><h3>Milk Batch #M-102</h3></div><span class="badge high">EXPIRY RISK HIGH</span></div>
        <p class="small muted"><b style="color:var(--ink)">Reason:</b> Consumption rate is lower than expected (−31% vs plan) while expiry is 9 h away.</p>
        <p class="small" style="margin-top:6px"><b style="color:var(--acc)">Recommendation:</b> Prioritize this batch for consumption or redistribution.</p>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-sm btn-acc" onclick="sendToRedistribution('M-102')">Redistribute</button><button class="btn btn-sm" onclick="toast('M-102 flagged for breakfast service priority.','ok')">Push to kitchen</button></div>
      </div>
    </div>
  </div>`;
    icons(); reveal(p); slUpdate(4);
}
function slUpdate(t) {
    if (t != null) $('#slT').textContent = t + ' °C'; const h = +$('#slHr').value; $('#slH').textContent = h + '%';
    const hrs = AI.shelfLife(S.inv[3], +$('#slT').textContent, h); $('#slOut').textContent = hrs + ' h';
    const risk = hrs < 4 ? 'CRITICAL' : hrs < 8 ? 'HIGH RISK' : hrs < 16 ? 'MONITOR' : 'SAFE';
    $('#slOut').style.color = hrs < 4 ? 'var(--red)' : hrs < 8 ? 'var(--amber)' : 'var(--teal)';
    $('#slAct').textContent = hrs < 6 ? `Redistribute within ${hrs} h — before ${new Date(now() + hrs * 36e5).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.` : 'Stable. Hold at current conditions.'
}