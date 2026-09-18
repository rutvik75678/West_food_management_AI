/* ============================================================
   FOODWISE AI · 10-pages-intel.js
   AI Module 11 Impact & ESG report, AI Control Center,
   AI Model Lab (training console + synthetic CSV export).
   ============================================================ */
function pgImpact() {
    const p = $('#page'); const I = S.impact;
    p.innerHTML = `${pageHead('AI Module 11 · Carbon Footprint Engine', 'Impact you can audit.', 'Transparent factor-based estimation — clearly labelled as estimated impact, never presented as exact measurement.')}
  <div class="statline rise" style="margin-bottom:16px">
    <div><span class="kicker">Food saved</span><div class="num" id="i1">0</div><span class="muted small">kg · 90 days</span></div>
    <div><span class="kicker">Meals redistributed</span><div class="num" id="i2">0</div><span class="muted small">beneficiary servings</span></div>
    <div><span class="kicker">Estimated CO₂e avoided</span><div class="num" id="i3">0</div><span class="muted small">tonnes · est.</span></div>
    <div><span class="kicker">Estimated water saved</span><div class="num" id="i4">0</div><span class="muted small">litres · est.</span></div>
    <div><span class="kicker">Estimated cost saved</span><div class="num" id="i5">0</div><span class="muted small">ingredient + disposal · est.</span></div>
  </div>
  <div class="grid" style="grid-template-columns:1.4fr 1fr">
    <div class="card rise"><div class="card-h"><span class="kicker">CUMULATIVE FOOD SAVED (KG) · 90 DAYS</span><span class="badge dim">DEMO DATA</span></div><div id="impChart" data-h="230"></div></div>
    <div class="card rise"><details class="expandable" open><summary>How is this calculated?</summary>
      <div class="small muted" style="margin-top:12px;display:flex;flex-direction:column;gap:9px">
        <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--line);padding-bottom:7px"><span>CO₂e per kg food saved</span><b class="mono" style="color:var(--ink)">2.26 kg CO₂e</b></div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--line);padding-bottom:7px"><span>Water per kg (blended meals)</span><b class="mono" style="color:var(--ink)">14.9 L</b></div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--line);padding-bottom:7px"><span>Energy per kg</span><b class="mono" style="color:var(--ink)">3.2 kWh</b></div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--line);padding-bottom:7px"><span>Cost per kg (ingredients + disposal)</span><b class="mono" style="color:var(--ink)">₹114.5</b></div>
        <div style="display:flex;justify-content:space-between"><span>Meals per kg</span><b class="mono" style="color:var(--ink)">2.5</b></div>
        <p style="margin-top:8px">Worked example: 1,240 kg × 2.26 ≈ 2.8 t CO₂e · 1,240 × 14.9 ≈ 18,500 L.</p>
        <p class="demo-note">ESTIMATED IMPACT — directional estimates from published food-footprint ranges, applied to demo transaction data. Not measured values.</p></div></details>
      <div class="hr"></div><span class="kicker">ESG REPORT</span>
      <p class="small muted" style="margin:6px 0 12px">Environmental · Social · Governance — compiled from live demo data and the audit log.</p>
      <button class="btn btn-acc btn-sm" onclick="genESG()"><i data-lucide="file-text"></i> Generate ESG Report</button>
    </div>
  </div>`;
    icons(); reveal(p);
    countUp($('#i1'), I.savedKg, { dur: 1100 }); countUp($('#i2'), I.meals, { dur: 1100 });
    countUp($('#i3'), I.co2T, { dur: 1100, fmt: v => v.toFixed(1) }); countUp($('#i4'), I.waterL, { dur: 1100 }); countUp($('#i5'), I.money, { dur: 1100, fmt: INR });
    chart($('#impChart'), { labels: ['D-90', '', 'D-60', '', 'D-30', '', 'today'], series: [{ data: [120, 240, 380, 510, 660, 800, 930, 1050, 1160, Math.round(I.savedKg)], name: 'food saved', color: C.teal, fill: hexA(C.teal, .1) }], tipFmt: Math.round });
}
function genESG() {
    const I = S.impact;
    const html = `<div class="esgprint" style="font-family:Georgia,serif;color:#111">
    <div style="border-bottom:3px solid #333;padding-bottom:14px;margin-bottom:18px"><h1 style="font-size:26px">FoodWise AI — Sustainability & ESG Report</h1><p style="color:#555">Generated ${new Date().toLocaleString('en-IN')} · Scope: demo deployment (synthetic data) · Prepared for: ${S.user.name} (${S.user.role})</p></div>
    <h2 style="font-size:16px;margin:14px 0 6px">Environmental</h2><ul style="margin-left:20px;line-height:1.9"><li>Food saved: <b>${N(I.savedKg)} kg</b> · Waste prevented: <b>${N(I.preventedKg)} kg</b></li><li>CO₂e avoided (est.): <b>${I.co2T} tonnes</b> @ 2.26 kg/kg</li><li>Water saved (est.): <b>${N(I.waterL)} L</b> @ 14.9 L/kg · Energy saved (est.): <b>${N(I.energyKwh)} kWh</b></li></ul>
    <h2 style="font-size:16px;margin:14px 0 6px">Social</h2><ul style="margin-left:20px;line-height:1.9"><li>Meals redistributed: <b>${N(I.meals)}</b> · NGOs supported: <b>${I.ngoCount}</b> · Beneficiaries reached (est.): <b>${N(I.meals * 1.8)}</b></li></ul>
    <h2 style="font-size:16px;margin:14px 0 6px">Governance</h2><ul style="margin-left:20px;line-height:1.9"><li>Traceability: every batch carries source, quality assessment, and handling chain</li><li>Audit log entries: <b>${S.audit.length}</b> (append-only) · Latest: ${S.audit.slice(0, 3).map(a => a.a).join(' · ')}</li></ul>
    <p style="margin-top:16px;color:#777;font-size:12px">Methodology: factor-based estimation from published food-footprint ranges applied to platform transaction records. Figures are ESTIMATED IMPACT from DEMO DATA, not measured values. Quality outputs are indicators, not food-safety certifications.</p></div>`;
    openModal('ESG Report — preview', html + `<div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn-acc btn-sm" onclick="downloadESG()"><i data-lucide="download"></i> Download HTML</button><button class="btn btn-sm" onclick="window.print()"><i data-lucide="printer"></i> Print</button></div>`);
    window._esg = html;
}
function downloadESG() { const b = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>FoodWise ESG Report</title></head><body style="max-width:760px;margin:40px auto">` + window._esg + `</body></html>`], { type: 'text/html' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'foodwise-esg-report.html'; a.click(); toast('ESG report downloaded.', 'ok'); logAudit('ESG report generated & downloaded') }
function pgControl() {
    const p = $('#page');
    p.innerHTML = `${pageHead('AI Control Center', 'Every model, one glass panel.', 'Live service registry for the demo deployment. All models are DEMO MODELS on synthetic data — accuracy metrics are shown only where a validation run exists, honestly labelled.')}
  <div class="card rise" style="border-color:rgba(200,240,75,.3);margin-bottom:16px;display:flex;gap:12px;align-items:center"><span class="ai-chip">Demo deployment</span><span class="small muted">No fabricated accuracy: "confidence" is model self-reported certainty in the demo pipeline; "validation" metrics are computed on a synthetic holdout and labelled as such.</span></div>
  <div class="grid" style="grid-template-columns:1fr 1fr" id="svcGrid">
    ${S.services.map((s, i) => `<div class="card rise"><div class="card-h"><div style="display:flex;align-items:center;gap:9px"><span class="dot on"></span><b>${s.name}</b></div><span class="badge ok">ONLINE</span></div>
      <div class="mono small muted" style="margin-bottom:8px">${s.model}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px" class="small">
        <div><span class="kicker">Predictions served</span><div class="num" id="svcN${i}">${N(s.count)}</div></div>
        <div><span class="kicker">Avg confidence</span><div class="num">${s.conf}%</div></div>
        <div style="grid-column:1/3"><span class="kicker">Last prediction</span><div class="small">${s.last} · <span data-ago="${now()}" class="mono faint">just now</span></div></div>
      </div></div>`).join('')}
  </div>
  <div class="card rise" style="margin-top:16px"><div class="card-h"><span class="kicker">REQUEST PATH</span><span class="badge dim">ARCHITECTURE</span></div>
    <div class="mqttdiag">${['React Frontend', 'Node.js API Gateway', 'AI Gateway', 'Python FastAPI', 'Model Registry', 'AI Models'].map((n, i) => `<div class="mnode">${n}</div>${i < 5 ? '<div class="mflow"></div>' : ''}`).join('')}</div>
    <p class="demo-note" style="margin-top:8px">Endpoints: /ai/demand/predict · /ai/surplus/predict · /ai/waste/predict · /ai/quality/analyze · /ai/shelf-life/predict · /ai/ngo/match · /ai/routes/optimize · /ai/anomaly/detect · /ai/impact/calculate · /ai/copilot/query — simulated locally in this prototype.</p></div>`;
    icons(); reveal(p);
}
const MODELS = [
    { n: 'Demand Forecaster', ds: 'food_demand.csv · 180 d synthetic', type: 'Gradient Boosting Regressor', feats: 15, metric: 'MAE 3.1% (synthetic holdout)', page: 'forecast' },
    { n: 'Surplus Classifier', ds: 'food_waste.csv · 180 d synthetic', type: 'Logistic Regression baseline', feats: 11, metric: 'ROC-AUC 0.87 (synthetic holdout)', page: 'surplus' },
    { n: 'Waste Regressor', ds: 'food_waste.csv + production_data.csv', type: 'Random Forest', feats: 14, metric: 'MAE 4.6 kg (synthetic holdout)', page: 'surplus' },
    { n: 'FoodVision Quality', ds: 'image set · demo', type: 'YOLO-compatible interface (heuristic demo)', feats: '—', metric: 'Not evaluated — DEMO MODEL', page: 'foodvision' },
    { n: 'Anomaly Detector', ds: 'sensor_data.csv + energy_records.csv', type: 'Isolation-style scoring / z-score', feats: 8, metric: 'Precision 0.91 on seeded faults (demo)', page: 'processing' },
    { n: 'NGO Matcher', ds: 'ngo_data.csv', type: 'Weighted scoring / recommender', feats: 6, metric: 'Rule-based · fully explainable', page: 'redistribute' }
];
function pgLab() {
    const p = $('#page');
    p.innerHTML = `${pageHead('AI Model Lab', 'Train, evaluate, predict.', 'Registry of demo models with datasets, features and honestly-labelled validation metrics. Designed for retraining on real institutional data.')}
  <div class="grid" style="grid-template-columns:1.6fr 1fr">
  <div class="card pad0 rise"><div class="card-h" style="padding:16px 20px 0"><div><span class="kicker">MODEL REGISTRY</span><h3>6 registered models</h3></div><span class="badge dim">DEMO WEIGHTS</span></div>
  <table class="tbl"><thead><tr><th>Model</th><th>Type</th><th>Validation</th><th>Actions</th></tr></thead><tbody>
  ${MODELS.map((m, i) => `<tr><td><b>${m.n}</b><div class="faint mono small">${m.ds}</div></td><td class="small muted">${m.type}<div class="faint mono small">${m.feats} features</div></td><td><span class="badge ${m.metric.includes('Not') ? 'dim' : 'ok'}">${m.metric}</span></td>
    <td style="white-space:nowrap"><button class="btn btn-sm" onclick="labTrain(${i},this)">Train</button> <button class="btn btn-sm" onclick="labEval(${i})">Evaluate</button> <button class="btn btn-sm btn-acc" onclick="nav('${m.page}')">Predict</button></td></tr>`).join('')}
  </tbody></table></div>
  <div style="display:flex;flex-direction:column;gap:16px">
    <div class="card rise"><div class="card-h"><div><span class="kicker">TRAINING DATASETS · SYNTHETIC</span><h3>food_demand.csv</h3></div><button class="btn btn-sm" onclick="downloadCSV()"><i data-lucide="download"></i> CSV</button></div>
      <div style="overflow-x:auto"><table class="tbl" style="font-size:11px;font-family:var(--mono)"><thead><tr><th>date</th><th>dow</th><th>attendance</th><th>event</th><th>temp_c</th><th>meals</th></tr></thead><tbody>
      ${S.hist.slice(0, 7).map((v, i) => `<tr><td>2025-02-${17 + i}</td><td>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</td><td>${940 + i * 4}</td><td>${i === 5 ? 'fest' : '—'}</td><td>${(22 + Math.sin(i) * 4).toFixed(1)}</td><td>${v}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="demo-note" style="margin-top:8px">DEMO DATA — 6 months of realistic synthetic history. Preview shows first 7 rows; download generates the full CSV locally.</p></div>
    <div class="card rise"><div class="card-h"><span class="kicker">TRAINING CONSOLE</span><h3 id="labTitle">Idle</h3></div>
      <div id="labOut" class="mono small muted">Select an action. Train / Evaluate run locally on synthetic data (demo).</div></div>
  </div></div>`;
    icons(); reveal(p);
}
function labTrain(i, btn) {
    btn.disabled = true; btn.textContent = '…'; const m = MODELS[i]; $('#labTitle').textContent = 'Training ' + m.n;
    let s = 0; const iv = setInterval(() => { s += Math.random() * 22; $('#labOut').innerHTML = `<span style="color:var(--acc)">▮</span> ${m.n}: epoch ${Math.min(12, Math.ceil(s / 8))}/12 · loss ${(1.9 - s / 40).toFixed(3)} · synthetic batch 64/64…`; if (s >= 100) { clearInterval(iv); $('#labTitle').textContent = m.n + ' trained'; $('#labOut').innerHTML = `<span style="color:var(--teal)">✓ Training complete (demo weights re-initialized on synthetic data).</span><br>Validation: ${m.metric}<br><span class="faint">Trained ${new Date().toLocaleTimeString('en-IN')} · by ${S.user.name}</span>`; logAudit('Model trained (demo): ' + m.n); toast(m.n + ' trained (demo weights).', 'ok'); btn.disabled = false; btn.textContent = 'Train' } }, 300)
}
function labEval(i) { const m = MODELS[i]; $('#labTitle').textContent = 'Evaluating ' + m.n; $('#labOut').innerHTML = `Holdout split: 80/20 chronological · synthetic data only.<br>Metric: <b style="color:var(--acc)">${m.metric}</b><br><span class="faint">This is a synthetic-holdout result for the DEMO MODEL — not a claim of real-world accuracy.</span>`; logAudit('Model evaluated (demo): ' + m.n) }
function downloadCSV() {
    let rows = 'date,dow,attendance,event,temp_c,meals\n'; const dw = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; for (let i = 0; i < 180; i++) { const v = 880 + Math.round(Math.sin(i / 7 * 6.28) * 45 + Math.sin(i / 29) * 22 + (i % 7 === 2 ? 38 : 0)); rows += `2024-09-${String(1 + i % 30).padStart(2, '0')},${dw[i % 7]},${940 + ((i * 13) % 80)},${i % 14 === 5 ? 'fest' : '—'},${(20 + Math.sin(i / 5) * 6).toFixed(1)},${v}\n` }
    const b = new Blob([rows], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'food_demand.csv'; a.click(); toast('food_demand.csv generated (180 rows, synthetic).', 'ok')
}