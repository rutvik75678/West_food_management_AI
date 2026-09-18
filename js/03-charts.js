/* ============================================================
   FOODWISE AI · 03-charts.js
   Zero-dependency canvas chart engine (line/area/bars/band/
   confidence intervals, hover tooltips), sparklines, gauges.
   Theme-aware: reads the global palette object C.
   ============================================================ */
const CHARTS = [];
const C = { ink: '#EDF2E4', ink2: '#9DAF9E', ink3: '#66786A', acc: '#C8F04B', teal: '#5BC8AF', amber: '#F2B84B', red: '#F27059', grid: 'rgba(226,240,222,.07)', pt: '#0B120E' };
function hexA(hex, a) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r},${g},${b},${a})` }
function fillA(col, a) { if (col[0] === '#') return hexA(col, a); const m = col.match(/\d+/g); return m ? 'rgba(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + a + ')' : col }
function prep(cv) { const dpr = devicePixelRatio || 1, w = cv.parentNode.clientWidth, h = cfg_h(cv); cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px'; const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return { x, w, h } }
function cfg_h(cv) { return parseInt(cv.parentNode.dataset.h || '220') }
function chart(parent, cfg) {
    const wrap = document.createElement('div'); wrap.className = 'chartwrap';
    const cv = document.createElement('canvas'); wrap.appendChild(cv);
    const tip = document.createElement('div'); tip.className = 'tip'; wrap.appendChild(tip);
    (typeof parent === 'string' ? $(parent) : parent).appendChild(wrap);
    const st = { cfg, cv, tip, t: 0 };
    CHARTS.push(st); requestAnimationFrame(() => { st.t0 = performance.now(); draw(st) });
    if (cfg.hover !== false) {
        wrap.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); hover(st, e.clientX - r.left) });
        wrap.addEventListener('mouseleave', () => { tip.style.display = 'none'; draw(st) });
    }
    return st;
}
function draw(st) {
    const { x, w, h } = prep(st.cv), c = st.cfg, P = st.t ? clamp((performance.now() - st.t0) / 700, 0, 1) : 1, e = 1 - Math.pow(1 - P, 3);
    const padL = 38, padR = 10, padT = 12, padB = 22, iw = w - padL - padR, ih = h - padT - padB;
    let all = []; c.series.forEach(s => all = all.concat(s.data.filter(v => v != null))); if (c.band) all = all.concat(c.band.lo, c.band.hi); if (c.bars) all = all.concat(c.bars.data);
    let mn = c.min != null ? c.min : Math.min(...all), mx = c.max != null ? c.max : Math.max(...all);
    if (c.band) { mn = Math.min(mn, ...c.band.lo.filter(v => v != null)); mx = Math.max(mx, ...c.band.hi.filter(v => v != null)) }
    const rg = (mx - mn) || 1; mn -= rg * .12; mx += rg * .12;
    const n = c.labels.length, X = i => padL + iw * (n === 1 ? .5 : i / (n - 1)), Y = v => padT + ih * (1 - (v - mn) / (mx - mn));
    x.clearRect(0, 0, w, h);
    x.strokeStyle = C.grid; x.lineWidth = 1; x.font = '10px JetBrains Mono'; x.fillStyle = C.ink3;
    for (let g = 0; g <= 3; g++) { const v = mn + (mx - mn) * g / 3, y = Y(v); x.beginPath(); x.moveTo(padL, y); x.lineTo(w - padR, y); x.stroke(); x.fillText(c.yFmt ? c.yFmt(v) : Math.round(v), 4, y + 3) }
    x.textAlign = 'center';
    const step = Math.max(1, Math.ceil(n / 8));
    c.labels.forEach((l, i) => { if (i % step === 0) x.fillText(l, X(i), h - 6) });
    x.textAlign = 'left';
    if (c.splitAt != null) {
        x.strokeStyle = hexA(C.acc, .45); x.setLineDash([3, 4]); x.beginPath(); x.moveTo(X(c.splitAt - .5), padT); x.lineTo(X(c.splitAt - .5), padT + ih); x.stroke(); x.setLineDash([]);
        x.fillStyle = C.acc; x.fillText(c.splitLbl || 'forecast →', X(c.splitAt - .5) + 5, padT + 9); x.fillStyle = C.ink3
    }
    if (c.band) {
        x.fillStyle = hexA(C.acc, .10); x.beginPath(); let started = false;
        for (let i = c.splitAt; i < n; i++) { if (c.band.hi[i] == null) continue; if (!started) { x.moveTo(X(i), Y(c.band.hi[i])); started = true } else x.lineTo(X(i), Y(c.band.hi[i])) }
        for (let i = n - 1; i >= c.splitAt; i--) { if (c.band.lo[i] == null) continue; x.lineTo(X(i), Y(c.band.lo[i])) } x.closePath(); x.fill()
    }
    if (c.bars) { const bw = Math.min(26, iw / n * .55); c.bars.data.forEach((v, i) => { const bx = X(i) - bw / 2, by = Y(v); x.fillStyle = c.bars.color || (i === c.bars.hl ? C.acc : hexA(C.ink2, .45)); x.beginPath(); x.roundRect(bx, by, bw, padT + ih - by, [4, 4, 0, 0]); x.fill() }) }
    c.series.forEach(s => {
        x.strokeStyle = s.color; x.lineWidth = s.w || 2;
        if (s.dash) x.setLineDash(s.dash);
        if (s.fill) {
            x.beginPath(); let st2 = false;
            s.data.forEach((v, i) => { if (v == null) return; if (!st2) { x.moveTo(X(i), Y(v)); st2 = true } else x.lineTo(X(i), Y(v)) });
            const li = s.data.reduce((a, v, i) => v != null ? i : a, 0); x.lineTo(X(li), padT + ih); x.lineTo(X(s.data.findIndex(v => v != null)), padT + ih); x.closePath(); x.fillStyle = s.fill; x.fill()
        }
        x.beginPath(); let pen = false, pts = [];
        s.data.forEach((v, i) => { if (v == null) { pen = false; return } const px = X(i), py = Y(v); pts.push([px, py, v, i]); if (!pen) { x.moveTo(px, py); pen = true } else x.lineTo(px, py) });
        x.save(); if (P < 1) { x.beginPath(); x.rect(0, 0, padL + iw * e + 4, h); x.clip(); x.beginPath(); pen = false; pts.forEach(([px, py], k) => { if (!k) x.moveTo(px, py); else x.lineTo(px, py) }); x.stroke() } else x.stroke(); x.restore();
        if (s.pts && P >= 1) { pts.forEach(([px, py]) => { x.beginPath(); x.arc(px, py, 3, 0, 7); x.fillStyle = s.color; x.fill(); x.strokeStyle = C.pt; x.lineWidth = 1.5; x.stroke() }) }
        x.setLineDash([]);
    });
    st.hoverIdx = -1; st.geom = { padL, iw, n, X, Y, w, h };
    st._hover = px => {
        const i = clamp(Math.round((px - padL) / iw * (n - 1)), 0, n - 1); draw(st); st.hoverIdx = i;
        x.strokeStyle = fillA(C.ink, .22); x.beginPath(); x.moveTo(X(i), padT); x.lineTo(X(i), padT + ih); x.stroke();
        c.series.forEach(s => { const v = s.data[i]; if (v == null) return; x.beginPath(); x.arc(X(i), Y(v), 3.5, 0, 7); x.fillStyle = s.color; x.fill() });
        let rows = c.series.filter(s => s.data[i] != null).map(s => `<div>${s.name || ''} <b>${c.tipFmt ? c.tipFmt(s.data[i]) : N(s.data[i])}</b></div>`).join('');
        if (c.band && i >= c.splitAt && c.band.lo[i] != null) rows += `<div class="faint">range <b>${N(c.band.lo[i])}–${N(c.band.hi[i])}</b></div>`;
        if (rows) {
            st.tip.innerHTML = `<div class="faint">${c.labels[i]}</div>` + rows; st.tip.style.display = 'block';
            st.tip.style.left = clamp(X(i) + 12, 4, w - 140) + 'px'; st.tip.style.top = padT + 'px'
        }
    };
}
function hover(st, px) { st._hover(px) }
function spark(parent, data, color, h = 30) {
    color = color || C.acc;
    if (color.indexOf('200,240,75') > -1) color = C.acc;
    if (color.indexOf('91,200,175') > -1) color = C.teal;
    const cv = document.createElement('canvas'); cv.style.width = '100%'; cv.style.height = h + 'px'; cv.dataset.h = h; (typeof parent === 'string' ? $(parent) : parent).appendChild(cv);
    requestAnimationFrame(() => {
        if (!cv.isConnected) return; const { x, w } = prep(cv); const mn = Math.min(...data), mx = Math.max(...data);
        x.strokeStyle = color; x.lineWidth = 1.6; x.beginPath();
        data.forEach((v, i) => { const px = 2 + (w - 4) * i / (data.length - 1), py = h - 3 - (h - 7) * (v - mn) / ((mx - mn) || 1); i ? x.lineTo(px, py) : x.moveTo(px, py) }); x.stroke();
        x.lineTo(w - 2, h); x.lineTo(2, h); x.closePath(); x.fillStyle = fillA(color, .10); x.fill()
    });
}
function gaugeSVG(val, color = '#C8F04B', size = 110, label = '') { const r = 44, c = 2 * Math.PI * r * .75; return `<svg width="${size}" height="${size}" viewBox="0 0 110 110" style="transform:rotate(135deg)"><circle cx="55" cy="55" r="${r}" fill="none" stroke="var(--bg4)" stroke-width="9" stroke-dasharray="${c} 999" stroke-linecap="round"/><circle cx="55" cy="55" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-dasharray="${c * val / 100} 999" stroke-linecap="round" style="transition:stroke-dasharray 1s cubic-bezier(.22,.8,.3,1)"/></svg><div style="margin-top:-68px;text-align:center"><div class="num" style="font-size:24px">${label || val + '%'}</div></div><div style="height:34px"></div>` }
window.addEventListener('resize', () => CHARTS.forEach(st => { st.t0 = performance.now() - 700; draw(st) }));