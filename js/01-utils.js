/* ============================================================
   FOODWISE AI · 01-utils.js
   DOM helpers, formatting, toasts, modals, count-up, reveal.
   ============================================================ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const N = x => Math.round(x).toLocaleString('en-IN');
const INR = x => '₹' + Math.round(x).toLocaleString('en-IN');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const now = () => Date.now();
function icons() { window.lucide && lucide.createIcons() }
function toast(msg, type = '') { const t = document.createElement('div'); t.className = 'toast ' + type; t.innerHTML = `<span class="dot ${type === 'warn' ? 'warn' : type === 'crit' ? 'crit' : type === 'ok' ? 'ok' : 'on'}"></span><span>${msg}</span>`; $('#toasts').appendChild(t); setTimeout(() => { t.style.opacity = 0; t.style.transition = '.4s'; setTimeout(() => t.remove(), 400) }, 4200) }
function openModal(title, body) { $('#modalRoot').innerHTML = `<div class="modal-back" onclick="if(event.target===this)closeModal()"><div class="modal"><button class="modal-x" onclick="closeModal()"><i data-lucide="x"></i></button><h2 style="font-family:var(--serif);font-size:22px;margin-bottom:14px">${title}</h2>${body}</div></div>`; icons() }
function closeModal() { $('#modalRoot').innerHTML = '' }
function countUp(el, to, { dur = 900, fmt = N, prefix = '', suffix = '' } = {}) { const from = 0, t0 = performance.now(); (function f(t) { const p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = prefix + fmt(from + (to - from) * e) + suffix; if (p < 1) requestAnimationFrame(f) })(t0) }
function reveal(root) { root.querySelectorAll('.rise').forEach((el, i) => { el.style.animationDelay = (i * 60) + 'ms' }); root.querySelectorAll('.frow .fb i').forEach((el, i) => { setTimeout(() => el.style.width = el.dataset.w + '%', 150 + i * 90) }) }