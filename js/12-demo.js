/* ============================================================
   FOODWISE AI · 12-demo.js
   SIH LIVE DEMO — 13-step animated scenario with
   pause / next / restart / skip, and state snapshot-restore.
   ============================================================ */
const DEMO_STEPS = [
    { t: 'Scenario', run: st => { st.innerHTML = `<span class="kicker rise">SCENARIO · TUESDAY · CAMPUS KITCHEN</span><div class="typein rise" id="dType" style="margin-top:14px"></div><div class="rise" style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap"><span class="tag">1,000 students expected</span><span class="tag">Weather 24°C · clear</span><span class="tag">2 campus events</span><span class="tag">Humidity 61%</span></div><p class="muted small rise" style="margin-top:22px;max-width:520px">The kitchen historically over-prepares for event days — last month it wasted 72 kg in a single Saturday. Watch how the AI chain handles today.</p>`; typeInto($('#dType'), '“1,000 people on campus tomorrow. How much food should we actually cook?”') } },
    {
        t: 'Demand forecast', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 01 · DEMAND FORECASTING</span><div class="bigcount" id="dNum">0</div><span class="muted">meals predicted for tomorrow</span><div style="display:flex;gap:14px;margin-top:16px;align-items:center"><span class="ai-chip">94% confidence</span><span class="demo-note">band 862 – 978 · demo model</span></div><div id="dChart" data-h="150" style="margin-top:18px;max-width:560px"></div><p class="small muted rise" style="margin-top:14px;max-width:520px">Historical Tuesdays run hot (918 avg) and 2 events are registered — the model lifts the weekday-adjusted baseline by 8.1%.</p>`;
            setTimeout(() => countUp($('#dNum'), 920, { dur: 1300 }), 200); chart($('#dChart'), { labels: ['-7d', '', '', '', '', 'today', '+1d'], series: [{ data: [875, 912, 924, 883, 941, 912, null], color: C.ink2 }, { data: [null, null, null, null, null, 912, 920], color: C.acc, pts: true }], band: { lo: [null, null, null, null, null, null, 862], hi: [null, null, null, null, null, null, 978] }, splitAt: 6, tipFmt: Math.round, min: 800 })
        }, apply() { S.flow.predict = 2; svcBump('demand') }
    },
    {
        t: 'Production recommendation', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 01 · PRODUCTION OPTIMIZATION</span>
   <div style="margin-top:16px;font-family:var(--mono);font-size:17px;line-height:2.2" class="rise">
     <div>Predicted demand <b style="color:var(--acc)">920</b> meals</div><div>+ 2% service buffer</div><div>= <span class="bigcount" style="font-size:54px">940</span> <span class="muted small">meals to prepare</span></div>
     <div class="muted small">vs kitchen's default plan: 1,020 → <b style="color:var(--teal)">−80 meals of overproduction avoided</b></div></div>
   <div class="rise" style="margin-top:18px;max-width:480px">${factorBars([{ n: 'Day-of-week effect', p: 38 }, { n: 'Expected attendance', p: 27 }, { n: 'Event calendar', p: 17 }, { n: 'Weather', p: 12 }, { n: 'Recent trend', p: 6 }])}</div>`, dur;7000
        }, apply() { S.flow.prevent = 1; svcBump('demand') }
    },
    {
        t: 'Kitchen prepares', run: st => {
            st.innerHTML = `<span class="kicker">KITCHEN DISPLAY · PLAN ACCEPTED</span>
   <div class="rise" style="margin-top:14px"><h2 style="font-family:var(--serif);font-size:30px">940 meals prepared</h2><p class="muted small">Batch #K-0314 · veg thali service</p></div>
   <div style="max-width:460px;margin-top:22px" class="rise"><span class="kicker">LIVE SERVICE</span><div style="height:10px;background:var(--bg4);border-radius:6px;margin-top:8px;overflow:hidden"><div id="dServe" style="width:0;height:100%;background:var(--teal);border-radius:6px;transition:width 4s ease"></div></div>
   <div style="display:flex;justify-content:space-between;margin-top:8px" class="mono small"><span id="dServed">0 served</span><span id="dLeft">940 in hold</span></div></div>`;
            setTimeout(() => { $('#dServe').style.width = '93.6%'; let v = 0; const iv = setInterval(() => { v += 20; $('#dServed').textContent = Math.min(880, v) + ' served'; $('#dLeft').textContent = (940 - Math.min(880, v)) + ' in hold'; if (v >= 880) clearInterval(iv) }, 90) }, 600)
        }, dur: 6500, apply() { }
    },
    {
        t: 'Surplus detected', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 02 · REAL-TIME SURPLUS FLAG</span>
   <div class="rise" style="margin-top:16px;padding:20px;border:1px solid rgba(242,184,75,.4);background:rgba(242,184,75,.06);border-radius:14px;max-width:520px">
     <div style="display:flex;gap:16px;align-items:center"><div class="num" style="font-size:44px;color:var(--amber)">60 meals</div><div><span class="badge monitor">SURPLUS DETECTED</span><p class="small muted" style="margin-top:6px">≈ 24 kg cooked surplus at service close</p></div></div></div>
   <p class="small muted rise" style="margin-top:16px;max-width:520px">The surplus predictor flagged this risk at <b style="color:var(--ink)">87% probability</b> before cooking — prevention already avoided ~80 meals; this residual 60 is exactly what the redistribution chain is for.</p>`, dur; 6500
        }, apply() { addAlert('MEDIUM', 'Surplus detected: 60 meals (24 kg) at Campus Kitchen', 'batch K-0314 · quality check next', 'package-open'); svcBump('surplus'); S.flow.detect = 1 }
    },
    {
        t: 'FoodVision quality check', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 03 · FOODVISION AI</span>
   <div style="display:flex;gap:26px;align-items:center;margin-top:14px;flex-wrap:wrap">
   <div class="scanbox" style="width:300px;aspect-ratio:3/2" id="dScan"><canvas id="dFood" width="480" height="320" style="width:100%"></canvas><div class="scanGrid"></div><div class="scanline"></div><div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div></div>
   <div id="dVis"><div class="mono small" style="color:var(--acc)">Scanning tray…</div></div></div>`;
            paintFood($('#dFood'), 'rice');
            setTimeout(() => {
                $('#dScan').querySelector('.scanline')?.remove(); $('#dVis').innerHTML = `<span class="badge ok">QUALITY GOOD</span>
     <div style="margin-top:12px"><span class="kicker">Freshness</span><div class="num" style="font-size:30px">94%</div></div>
     <div style="margin-top:10px"><span class="kicker">Confidence</span><div class="num">91%</div></div>
     <p class="small muted" style="margin-top:10px;max-width:240px">No spoilage regions detected. Safe for redistribution. <span class="demo-note">Demo inference — not a safety certification.</span></p>`;
                $('#dScan').insertAdjacentHTML('beforeend', '<div class="dregion" style="left:18%;top:22%;width:34%;height:38%"><span class="rl">thali 0.94</span></div>')
            }, 2300)
        }, dur: 7500, apply() { svcBump('vision') }
    },
    {
        t: 'Shelf-life window', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 04 · SHELF-LIFE PREDICTION</span>
   <div class="countdown" style="font-size:64px;color:var(--acc);margin-top:14px" id="dCd">4:00:00</div><span class="kicker">remaining at 5 °C holding</span>
   <div class="rise" style="margin-top:18px;padding:14px;border:1px solid rgba(200,240,75,.3);border-radius:12px;max-width:420px"><span class="kicker" style="color:var(--acc)">✦ ACTION</span><p class="small" style="margin-top:4px">Redistribute before <b>7:00 PM</b>. Risk class: MONITOR → HIGH after 2 h.</p></div>`;
            let s = 4 * 3600; S._dCdIv = setInterval(() => { s -= 1; const el = $('#dCd'); if (el) el.textContent = `${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; else clearInterval(S._dCdIv) }, 1000)
        }, dur: 7000, apply() { svcBump('shelf') }
    },
    {
        t: 'NGO matching', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 07 · INTELLIGENT NGO MATCHING</span>
   <div style="margin-top:18px;display:flex;flex-direction:column;gap:14px;max-width:520px" id="dNgos">
   ${S.ngos.map((n, i) => `<div class="rise" style="padding:13px 16px;border:1px solid ${i === 0 ? 'rgba(200,240,75,.4)' : 'var(--line)'};border-radius:12px;background:var(--bg2)">
     <div style="display:flex;justify-content:space-between"><b>${n.name}</b><span class="num" style="color:${i === 0 ? 'var(--acc)' : 'var(--ink2)'}" id="dNs${i}">0%</span></div>
     <div class="faint small mono">${n.d} km · cap ${n.cap} · rel ${n.rel}%${i === 0 ? ' · <b style="color:var(--acc)">TOP MATCH</b>' : ''}</div></div>`).join('')}</div>`;
            S.ngos.forEach((n, i) => setTimeout(() => countUp($('#dNs' + i), n.score, { dur: 700, suffix: '%' }), 300 + i * 350))
        }, dur: 7500, apply() { svcBump('match'); S.flow.match = 1; logAudit('Demo: AI matched Helping Hands Foundation (96%)') }
    },
    {
        t: 'Route optimization', run: st => {
            st.innerHTML = `<span class="kicker">AI MODULE 08 · SMART LOGISTICS</span>
   <div class="rise" style="margin-top:12px" id="dMap">${routeMap(false)}</div>
   <div style="display:flex;gap:22px;margin-top:12px;flex-wrap:wrap" class="rise">
     <div><span class="kicker">Original</span><div class="num" style="font-size:20px">18.2 km</div></div>
     <div><span class="kicker">Optimized</span><div class="num" style="font-size:20px;color:var(--acc)">13.9 km</div></div>
     <div><span class="kicker">Reduction</span><div class="num" style="font-size:20px;color:var(--teal)">23.6%</div></div>
     <div><span class="kicker">ETA</span><div class="num" style="font-size:20px">24 min</div></div>
     <div><span class="kicker">CO₂ avoided (est.)</span><div class="num" style="font-size:20px;color:var(--teal)">1.8 kg</div></div></div>`;
            setTimeout(() => {
                const opt = $('#dMap #routeOpt'), orig = $('#dMap #routeOrig'); if (!opt) return;
                const L = opt.getTotalLength(); opt.style.strokeDasharray = L; opt.style.strokeDashoffset = L; opt.getBoundingClientRect(); opt.style.transition = 'stroke-dashoffset 1.8s ease'; opt.style.strokeDashoffset = 0
            }, 400)
        }, dur: 8000, apply() { svcBump('route'); S.flow.optimize = 1 }
    },
    {
        t: 'Pickup', run: st => {
            st.innerHTML = `<span class="kicker">LOGISTICS · PICKUP</span>
   <div class="rise" style="margin-top:16px;display:flex;gap:26px;align-items:center"><div class="num" style="font-size:40px;color:var(--acc)">EV-07</div><div><b>Pickup assigned</b><p class="small muted">Campus Kitchen gate 2 · 24 kg · cold box secured · 6:12 PM</p></div></div>
   <div class="timeline rise" style="margin-top:20px;max-width:380px">
     <div class="tl done"><div class="tdot"><i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i></div><div class="small">Request accepted by ${S.ngos[0].name}</div></div>
     <div class="tl done"><div class="tdot"><i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i></div><div class="small">Picked up · 24 kg verified</div></div>
     <div class="tl now"><div class="tdot"></div><div class="small">In transit — optimized route, ETA 24 min</div></div></div>`; icons()
        }, dur: 5500, apply() { addAlert('SUCCESS', 'Surplus picked up — 24 kg en route', 'EV-07 · Helping Hands Foundation', 'truck') }
    },
    {
        t: 'Delivery confirmed', run: st => {
            st.innerHTML = `<span class="kicker">DELIVERY</span>
   <div style="margin-top:14px"><h2 style="font-family:var(--serif);font-size:34px" class="rise">58 meals delivered.</h2>
   <p class="muted small rise">${S.ngos[0].name} · 6:38 PM · 2 meals handling loss (logged)</p></div>
   <div class="timeline rise" style="margin-top:20px;max-width:380px">
     <div class="tl done"><div class="tdot"><i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i></div><div class="small">Delivered & confirmed by NGO</div></div>
     <div class="tl done"><div class="tdot"><i data-lucide="check" style="width:10px;height:10px;color:#0B120E"></i></div><div class="small">Impact calculation triggered</div></div></div>`, dur; 6000
        },
        apply() { S.demoDelta = { meals: 58, kg: 23.2, co2: 52.5, water: 346, money: 2657 }; S.flow.redistribute = 1; logAudit('Demo: delivery confirmed · 58 meals to Helping Hands Foundation') }
    },
    {
        t: 'Impact measured', run: st => {
            st.innerHTML = `<span class="kicker">IMPACT ENGINE · ESTIMATED IMPACT · DEMO DATA</span>
   <div style="display:flex;gap:34px;flex-wrap:wrap;margin-top:20px">
   ${[['meals saved', '58', '#C8F04B'], ['route reduced', '23.6%', '#5BC8AF'], ['CO₂e avoided (est.)', '52.5 kg', '#5BC8AF'], ['water saved (est.)', '346 L', '#5BC8AF'], ['money saved (est.)', '₹2,657', '#F2B84B']].map((k, i) => `<div class="rise"><div class="num" style="font-size:36px;color:${k[2]}" id="dI${i}">0</div><span class="kicker">${k[0]}</span></div>`).join('')}</div>
   <p class="small muted rise" style="margin-top:18px;max-width:520px">Plus the prevention dividend: cooking 940 instead of 1,020 avoided ~80 meals of waste before it ever existed. Prevention + redistribution, measured in one ledger.</p>`;
            setTimeout(() => { countUp($('#dI0'), 58, { dur: 900 }); countUp($('#dI1'), 236, { dur: 900, fmt: v => (v / 10).toFixed(1) + '%' }); countUp($('#dI2'), 525, { dur: 900, fmt: v => (v / 10).toFixed(1) + ' kg' }); countUp($('#dI3'), 3460, { dur: 900, fmt: v => N(v / 10) + ' L' }); countUp($('#dI4'), 26570, { dur: 900, fmt: v => INR(v / 10) }) }, 400)
        }, dur: 7500, apply() { S.flow.measure = 1; svcBump('impact') }
    },
    {
        t: 'Complete chain', run: st => {
            st.innerHTML = `<span class="kicker">SCENARIO COMPLETE · FULL CHAIN EXECUTED</span>
   <h2 style="font-family:var(--serif);font-size:clamp(26px,4vw,40px);margin:14px 0;max-width:620px" class="rise">Predicted → prevented → detected → matched → optimized → redistributed → <em style="color:var(--acc)">measured.</em></h2>
   <div class="pipeline rise" style="max-width:640px;border:1px solid var(--line);border-radius:12px">${['PREDICT', 'PREVENT', 'DETECT', 'MATCH', 'OPTIMIZE', 'REDISTRIBUTE', 'MEASURE'].map(s => `<div class="pstage done"><i data-lucide="check" style="width:15px;height:15px"></i><div class="pl">${s}</div></div>`).join('')}</div>
   <div style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap">
     <button class="btn btn-acc" onclick="demoClose();${S.user ? "nav('dashboard')" : "location.hash='#/login'"}">Open the dashboard</button>
     <button class="btn" onclick="toggleCopilot(true);copAsk('Why did we save food today?')">✦ Ask Copilot why we saved food today</button>
     <button class="btn btn-ghost" onclick="demoRestart()">Replay</button></div>
   <p class="demo-note rise" style="margin-top:18px">Simulated scenario · demo models · all impact figures are estimates on synthetic data.</p>`; icons()
        }, dur: 0, apply() { }
    }
];
let D = { i: 0, playing: true, timer: null, snap: null, start: 0 };
function svcBump(id) { const s = S.services.find(x => x.id === id); s.count++; s.last = 'demo run · just now' }
function demoOpen() {
    D = { i: 0, playing: true, timer: null, snap: JSON.parse(JSON.stringify({ impact: S.impact, flow: S.flow, alertsLen: S.alerts.length, auditLen: S.audit.length, demoDelta: S.demoDelta })), start: now() };
    $('#demoOv').classList.add('open'); renderDemoSteps(); demoStep();
}
function renderDemoSteps() {
    $('#demoSteps').innerHTML = DEMO_STEPS.map((s, i) => `<div class="dstep ${i < D.i ? 'done' : i === D.i ? 'cur' : ''}" id="ds${i}"><span class="dn">${i < D.i ? '✓' : i + 1}</span><span>${s.t}</span></div>`).join('');
    $('#demoStepLbl').textContent = `Step ${Math.min(D.i + 1, 13)}/13`;
    $('#demoProg').style.width = (D.i / 12 * 100) + '%';
}
function demoStep() {
    if (D.timer) clearTimeout(D.timer);
    if (D.i >= DEMO_STEPS.length) { D.i = DEMO_STEPS.length - 1 }
    const step = DEMO_STEPS[D.i];
    renderDemoSteps();
    const stage = $('#demoStage'); stage.innerHTML = ''; stage.scrollTop = 0;
    step.run(stage); reveal(stage);
    step.apply && step.apply();
    demoImpactLine();
    if (step.dur && D.playing) { D.timer = setTimeout(() => { D.i++; demoStep() }, step.dur) }
}
function demoImpactLine() {
    const d = S.demoDelta; $('#demoImpact').innerHTML = d ?
        `<span>Meals saved <b>${N(S.impact.meals)}</b></span><span>Food <b>${N(S.impact.savedKg)} kg</b></span><span>CO₂e est. <b>${S.impact.co2T.toFixed(1)} t</b></span><span>Water est. <b>${N(S.impact.waterL)} L</b></span><span>Money est. <b>${INR(S.impact.money)}</b></span>`
        : `<span class="faint">Impact tickers activate as the chain completes…</span><span>Pipeline stage <b>${D.i + 1}/13</b></span>`;
}
function demoPause() {
    D.playing = !D.playing; $('#demoPauseBtn').textContent = D.playing ? 'Pause' : 'Resume';
    if (D.playing) { const rem = DEMO_STEPS[D.i].dur ? 3000 : 0; D.timer = setTimeout(() => { D.i++; demoStep() }, rem) } else if (D.timer) clearTimeout(D.timer)
}
function demoNext() { if (D.timer) clearTimeout(D.timer); D.i = Math.min(DEMO_STEPS.length - 1, D.i + 1); demoStep() }
function demoRestart() {
    const snap = D.snap; Object.assign(S.impact, snap.impact); Object.assign(S.flow, snap.flow); S.demoDelta = snap.demoDelta;
    S.alerts = snap.alertsLen ? S.alerts.slice(0, snap.alertsLen) : []; S.audit = snap.auditLen ? S.audit.slice(0, snap.auditLen) : [];
    D.i = 0; D.playing = true; $('#demoPauseBtn').textContent = 'Pause'; updateBell(); demoStep();
}
function demoSkip() {
    if (D.timer) clearTimeout(D.timer);
    for (let k = D.i; k < DEMO_STEPS.length; k++)DEMO_STEPS[k].apply && DEMO_STEPS[k].apply();
    D.i = DEMO_STEPS.length - 1; D.playing = false; $('#demoPauseBtn').textContent = 'Resume'; demoStep();
}
function demoClose() { if (D.timer) clearTimeout(D.timer); $('#demoOv').classList.remove('open'); if (location.hash.startsWith('#/app')) renderApp(); updateBell() }
function typeInto(el, text) { let i = 0; const iv = setInterval(() => { i += 2; el.innerHTML = text.slice(0, i) + '<span class="cur"></span>'; if (i >= text.length) { clearInterval(iv); el.textContent = text } }, 34) }
setInterval(() => { const c = $('#demoClock'); if (c && $('#demoOv').classList.contains('open')) { const s = Math.floor((now() - D.start) / 1000); c.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') } }, 500);