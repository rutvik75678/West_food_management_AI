/* ============================================================
   FOODWISE AI · 13-theme.js
   Dark / light theme engine: palette swap for canvas charts,
   toggle, localStorage persistence, button mounting.
   ============================================================ */
const FW_THEMES = {
    dark: { ink: '#EDF2E4', ink2: '#9DAF9E', ink3: '#66786A', acc: '#C8F04B', teal: '#5BC8AF', amber: '#F2B84B', red: '#F27059', grid: 'rgba(226,240,222,.07)', pt: '#0B120E' },
    light: { ink: '#1B2417', ink2: '#57654F', ink3: '#7E8A7B', acc: '#5E7C0C', teal: '#0B7F68', amber: '#A96F06', red: '#C2482F', grid: 'rgba(27,36,23,.10)', pt: '#FCFDF9' }
};
function initTheme() {
    S.theme = localStorage.getItem('fw_theme') || 'dark';
    document.documentElement.dataset.theme = S.theme;
    Object.assign(C, FW_THEMES[S.theme]);
}
function toggleTheme() {
    S.theme = S.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fw_theme', S.theme);
    applyTheme();
}
function applyTheme() {
    document.documentElement.dataset.theme = S.theme;
    Object.assign(C, FW_THEMES[S.theme]);
    if (location.hash.startsWith('#/app') && S.user) renderApp();
    else if (location.hash === '#/login') renderLogin();
    else renderLanding();
}
function mountThemeBtn() {
    let b = document.getElementById('fwThemeBtn');
    if (!b) { b = document.createElement('button'); b.id = 'fwThemeBtn'; b.className = 'thbtn'; b.title = 'Toggle dark / light theme'; b.onclick = toggleTheme; document.body.appendChild(b) }
    b.innerHTML = '<i data-lucide="' + (S.theme === 'dark' ? 'sun' : 'moon') + '"></i>';
    const tb = $('#app .topbar'), lt = $('#app .ltop');
    if (tb && location.hash.startsWith('#/app') && S.user) { b.style.cssText = ''; const a = tb.querySelector('.bellbtn'); a ? tb.insertBefore(b, a) : tb.appendChild(b) }
    else if (lt) { b.style.cssText = ''; lt.children.length > 1 ? lt.insertBefore(b, lt.children[lt.children.length - 1]) : lt.appendChild(b) }
    else { b.style.cssText = 'position:fixed;top:18px;right:18px;z-index:60' }
    icons();
}