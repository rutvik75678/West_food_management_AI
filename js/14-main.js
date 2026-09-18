/* ============================================================
   FOODWISE AI · 14-main.js  — BOOT
   1. Apply saved theme (before first render)
   2. Start hash router
   3. Start the global countdown / time-ago ticker
   ============================================================ */
initTheme();
render();
setInterval(() => {
    $$('[data-cd]').forEach(el => {
        const rem = +el.dataset.cd - now();
        if (rem <= 0) { el.textContent = 'EXPIRED'; return }
        const h = Math.floor(rem / 36e5), m = Math.floor(rem % 36e5 / 6e4), s = Math.floor(rem % 6e4 / 1000);
        el.textContent = (h > 0 ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
    });
    $$('[data-ago]').forEach(el => { const d = Math.round((now() - +el.dataset.ago) / 1000); el.textContent = d < 5 ? 'just now' : d < 60 ? d + 's ago' : Math.round(d / 60) + 'm ago' });
}, 1000);