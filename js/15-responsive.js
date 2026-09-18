/* ============================================================
   FOODWISE AI · 15-responsive.js
   Mobile navigation: hamburger button + slide-in drawer +
   backdrop. Desktop (>768px) is untouched.
   ============================================================ */
function closeMobileNav() {
    const s = $('#app .side'); if (s) s.classList.remove('open');
    const bk = $('#fwSideBack'); if (bk) bk.classList.remove('open');
}
function mountMobileNav() {
    const tb = $('#app .topbar');
    if (!tb) return;
    if (window.innerWidth > 768) { closeMobileNav(); return }
    let b = document.getElementById('fwMenuBtn');
    if (!b) {
        b = document.createElement('button');
        b.id = 'fwMenuBtn'; b.className = 'menubtn'; b.title = 'Menu';
        b.innerHTML = '<i data-lucide="menu"></i>';
        b.onclick = () => {
            $('#app .side').classList.toggle('open');
            const bk = $('#fwSideBack'); if (bk) bk.classList.toggle('open');
        };
        tb.insertBefore(b, tb.firstChild);
        if (!document.getElementById('fwSideBack')) {
            const bk = document.createElement('div');
            bk.id = 'fwSideBack'; bk.className = 'sideback';
            bk.onclick = closeMobileNav; document.body.appendChild(bk);
        }
        /* close drawer when a nav item is tapped */
        tb.closest('.main').parentElement.addEventListener('click', e => {
            if (e.target.closest('.sitem')) closeMobileNav();
        });
    }
    icons();
}
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMobileNav() });
/* wrap render so the hamburger is mounted on every render */
const _renderAppR = renderApp;
renderApp = function () { _renderAppR(); mountMobileNav() };