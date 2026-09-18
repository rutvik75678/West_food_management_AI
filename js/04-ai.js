/* ============================================================
   FOODWISE AI · 04-ai.js
   Demo AI models (clearly labelled), audit log, alert engine,
   and shared UI builders used by every page.
   ============================================================ */
const AI = {
    demand(i) { const d = S.f7[i]; const dev = (1 - d.c / 100) * 1.2; return { lo: d.v * (1 - dev), hi: d.v * (1 + dev), rec: Math.round(d.v * 1.022 / 5) * 5 } },
    forecast30() { const out = []; for (let i = 0; i < 30; i++) { const dow = (i + 2) % 7; const base = [842, 899, 920, 908, 934, 946, 968][dow]; out.push({ v: base + Math.round(Math.sin(i / 4) * 14), c: 86 + ((i * 7) % 9) }) } return out },
    shelfLife(item, temp, hum) { const base = { kg: 8, L: 9, pcs: 5 }[item.u] || 12; const qf = item.qual / 100; const tf = Math.pow(2, (temp - 4) / 10); return Math.max(1, Math.round(item.hrs * qf / tf * (hum > 75 ? .75 : 1))) },
    ngoScore(n, kg) { return n.score }
};
function logAudit(a, t = S.user?.role || 'system') { S.audit.unshift({ t, a, ts: now() }) }
function addAlert(sev, t, s, icon) { S.alerts.unshift({ sev, t, s, icon }); updateBell() }

/* ---- shared UI builders ---- */
function pageHead(kick, title, sub, extra = '') { return `<div class="pagehead rise"><span class="kicker">${kick}</span><h1>${title}</h1><p>${sub}</p>${extra}</div>` }
function factorBars(fs) { return fs.map(f => `<div class="frow"><span class="muted">${f.n}</span><div class="fb"><i data-w="${f.p * 2.2}"></i></div><b>${f.p}%</b></div>`).join('') }
function confPill(c) { return `<span class="ai-chip">${c}% confidence</span>` }
function riskBadge(r) { const m = { SAFE: 'safe', MONITOR: 'monitor', 'HIGH RISK': 'high', 'HIGH': 'high', CRITICAL: 'crit' }; return `<span class="badge ${m[r] || 'dim'}">${r}</span>` }
function card(kick, title, body, extra = '') { return `<div class="card rise"><div class="card-h"><div><span class="kicker">${kick}</span><h3>${title}</h3></div>${extra}</div>${body}</div>` }
function pipelineHTML() {
    const stages = [['predict', 'PREDICT', 'trending-up'], ['prevent', 'PREVENT', 'shield-check'], ['detect', 'DETECT', 'scan-eye'], ['match', 'MATCH', 'heart-handshake'], ['optimize', 'OPTIMIZE', 'route'], ['redistribute', 'REDISTRIBUTE', 'truck'], ['measure', 'MEASURE', 'leaf']];
    return `<div class="card pad0 rise"><div class="pipeline">${stages.map((s, i) => { const st = S.flow[s[0]]; return `<div class="pstage ${st === 1 ? 'done' : st === 2 ? 'active' : ''}" style="cursor:pointer" onclick="nav('${['forecast', 'surplus', 'foodvision', 'redistribute', 'redistribute', 'redistribute', 'impact'][i]}')"><i data-lucide="${s[2]}" style="width:17px;height:17px"></i><div class="pl">${s[1]}</div></div>` }).join('')}</div></div>`
}
function flowSet(f, v) { S.flow[f] = v }