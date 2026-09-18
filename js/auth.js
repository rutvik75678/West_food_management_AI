/* ============================================================
   FOODWISE AI · auth.js
   Demo user store (localStorage). DEMO ONLY — a real backend
   must hash with bcrypt and serve sessions via JWT (see README).
   Loads AFTER 01-utils.js (needs now()) and 02-data.js (needs S).
   ============================================================ */
function pwHash(p) { let h = 5381; for (let i = 0; i < p.length; i++)h = ((h << 5) + h + p.charCodeAt(i)) >>> 0; return 'pw' + h.toString(16) }
function normPhone(v) { return (v || '').replace(/\D/g, '').slice(-10) }
const AUTH = {
    users() { try { const raw = JSON.parse(localStorage.getItem('fw_users') || 'null'); if (!raw) return this._seed(); const admin = raw.find(u => u.id === 'u_admin'); if (admin && !admin.phone) return this._seed(); return raw } catch (e) { return this._seed() } },
    _seed() {
        const u = [
            { id: 'u_admin', name: 'System Admin', role: 'ADMIN', email: 'admin@foodwise.demo', phone: '1234567890', org: 'FoodWise Platform', pass: pwHash('demo123'), joined: now() - 90 * 864e5 },
            { id: 'u_biz', name: 'Campus Kitchen', role: 'BIZ', email: 'kitchen@foodwise.demo', phone: '2345678901', org: 'IIT Campus Mess', pass: pwHash('demo123'), joined: now() - 60 * 864e5 },
            { id: 'u_ngo', name: 'Helping Hands Foundation', role: 'NGO', email: 'ngo@foodwise.demo', phone: '3456789012', org: 'Helping Hands Foundation', pass: pwHash('demo123'), joined: now() - 45 * 864e5 },
            { id: 'u_log', name: 'GreenWheel Logistics', role: 'LOGISTICS', email: 'logistics@foodwise.demo', phone: '4567890123', org: 'GreenWheel', pass: pwHash('demo123'), joined: now() - 30 * 864e5 }];
        localStorage.setItem('fw_users', JSON.stringify(u)); return u
    },
    save(users) { localStorage.setItem('fw_users', JSON.stringify(users)) },
    session() { try { return JSON.parse(localStorage.getItem('fw_session') || 'null') } catch (e) { return null } },
    setSession(id) { localStorage.setItem('fw_session', JSON.stringify({ id, ts: now() })) },
    clearSession() { localStorage.removeItem('fw_session') },
    findById(id) { return this.users().find(u => u.id === id) },
    findByIdentifier(v) {
        v = (v || '').trim().toLowerCase();
        const dig = v.replace(/\D/g, '');
        return this.users().find(u => (u.email || '').toLowerCase() === v ||
            (dig && dig.length >= 10 && normPhone(u.phone) === dig.slice(-10)))
    },
    login(identifier, pass) { const u = this.findByIdentifier(identifier); if (!u || u.pass !== pwHash(pass)) return null; this.setSession(u.id); return u },
    signup(o) {
        const phone = normPhone(o.phone);
        if (this.findByIdentifier(o.email) || this.findByIdentifier(phone)) return { err: 'An account with this email or phone already exists. Please sign in.' };
        const u = { id: 'u_' + now().toString(36), name: o.name, role: o.role, email: o.email || '', phone: phone, org: o.org || o.name, pass: pwHash(o.pass), joined: now() };
        this.save([...this.users(), u]); this.setSession(u.id); return { user: u }
    },
    upgradeRole(id, role, extra) { const us = this.users(), u = us.find(x => x.id === id); if (u) { u.role = role; Object.assign(u, extra || {}); this.save(us) } return u },
    logout() { this.clearSession() }
};
const ROLES = {
    ADMIN: { label: 'Administrator', icon: 'shield', desc: 'Full platform access · user management' },
    USER: { label: 'Community User', icon: 'user', desc: 'List surplus food · track it · join NGO / partner' },
    NGO: { label: 'NGO / Food Bank', icon: 'heart-handshake', desc: 'Accept food requests · connect delivery partner' },
    BIZ: { label: 'Hotel · Mess · Hospital', icon: 'chef-hat', desc: 'Add surplus · AI redistribution · analytics' },
    LOGISTICS: { label: 'Delivery Partner', icon: 'truck', desc: 'Pickup & delivery tasks' }
};
const PERMS = {
    ADMIN: ['*'],
    USER: ['dashboard', 'addfood', 'mylistings', 'foodvision', 'impact'],
    NGO: ['dashboard', 'foodpool', 'foodvision', 'impact', 'mylistings'],
    BIZ: ['dashboard', 'addfood', 'mylistings', 'forecast', 'surplus', 'foodvision', 'inventory', 'redistribute', 'processing', 'iot', 'impact'],
    LOGISTICS: ['dashboard', 'foodpool', 'redistribute', 'impact', 'mylistings']
};
function can(p) { if (!S.user) return false; const l = PERMS[S.user.role] || []; return l.includes('*') || l.includes(p) }
function syncSessionUser() { const s = AUTH.session(); if (!s) { S.user = null; return } const u = AUTH.findById(s.id); if (u) { const { pass, ...safe } = u; S.user = safe } else { S.user = null; AUTH.clearSession() } }
syncSessionUser();

/* ---- Marketplace data: surplus listings + delivery partners ---- */
S.listings = [
    { id: 'L-104', food: 'Veg thali meals (dinner)', kind: 'Cooked meal', qty: '60 meals', kg: 24, fresh: 94, hrsLeft: 4, risk: 'HIGH', by: 'IIT Campus Mess', status: 'LISTED', ngo: null, partner: null, window: 'Before 7:00 PM', loc: 'North Campus, Delhi', ts: now() - 36e5 },
    { id: 'L-103', food: 'Fruit baskets (cut)', kind: 'Fruit', qty: '12 kg', kg: 12, fresh: 71, hrsLeft: 3, risk: 'CRITICAL', by: 'City General Hospital', status: 'LISTED', ngo: null, partner: null, window: 'Before 6:30 PM', loc: 'Civil Lines, Delhi', ts: now() - 5e6 },
    { id: 'L-102', food: 'Packaged bread + buns', kind: 'Packaged', qty: '80 pcs', kg: 6, fresh: 95, hrsLeft: 30, risk: 'MONITOR', by: 'Sunrise Caterers', status: 'CLAIMED', ngo: 'Helping Hands Foundation', partner: null, window: 'Before 9:00 PM', loc: 'Gurugram', ts: now() - 8e6 },
    { id: 'L-101', food: 'Steamed rice + dal', kind: 'Cooked meal', qty: '40 meals', kg: 16, fresh: 88, hrsLeft: 6, risk: 'HIGH', by: 'IIT Campus Mess', status: 'DELIVERED', ngo: 'Helping Hands Foundation', partner: 'GreenWheel Logistics', window: 'Before 8:00 PM', loc: 'North Campus, Delhi', ts: now() - 9e6 }
];
S.partners = [
    { name: 'GreenWheel Logistics', eta: '24 min', cap: '150 kg', rel: 98 },
    { name: 'RapidRelay Bikes', eta: '12 min', cap: '30 kg', rel: 94 },
    { name: 'CityCold Vans', eta: '35 min', cap: '400 kg', rel: 96 }
];
const LSTATUS = ['LISTED', 'CLAIMED', 'ASSIGNED', 'PICKED', 'DELIVERED'];
function lBadge(s) { return { LISTED: '<span class="badge acc">AVAILABLE</span>', CLAIMED: '<span class="badge monitor">ACCEPTED BY NGO</span>', ASSIGNED: '<span class="badge acc">PARTNER ASSIGNED</span>', PICKED: '<span class="badge monitor">IN TRANSIT</span>', DELIVERED: '<span class="badge ok">DELIVERED</span>' }[s] || '' }
function riskOf(f, hrs) { return hrs < 4 || f < 60 ? 'CRITICAL' : hrs < 8 || f < 80 ? 'HIGH' : hrs < 24 ? 'MONITOR' : 'SAFE' }
function advanceListing(id, to, patch) {
    const l = S.listings.find(x => x.id === id); if (!l) return;
    l.status = to; Object.assign(l, patch || {});
    if (to === 'CLAIMED') { logAudit('Listing ' + id + ' accepted by ' + l.ngo); addAlert('INFO', 'Food request accepted: ' + l.food, l.ngo + ' · ' + l.qty, 'heart-handshake'); toast('Accepted — now connect a delivery partner.', 'ok') }
    if (to === 'ASSIGNED') { logAudit('Partner assigned to ' + id + ': ' + l.partner); addAlert('INFO', 'Delivery partner connected', l.partner + ' · ' + l.food, 'truck'); toast('Delivery partner connected.', 'ok') }
    if (to === 'PICKED') { logAudit('Pickup completed: ' + id); addAlert('SUCCESS', 'Pickup completed', l.food + ' · ' + l.qty, 'package-check'); toast('Pickup confirmed.', 'ok') }
    if (to === 'DELIVERED') {
        const meals = Math.round(l.kg * 2.5);
        Object.assign(S.impact, { savedKg: S.impact.savedKg + l.kg, meals: S.impact.meals + meals, co2T: +(S.impact.co2T + l.kg * 2.26 / 1000).toFixed(2), waterL: S.impact.waterL + Math.round(l.kg * 14.9), money: S.impact.money + Math.round(l.kg * 114.5), preventedKg: S.impact.preventedKg + Math.round(l.kg * .2) });
        logAudit('Delivery confirmed: ' + l.food + ' → ' + l.ngo); addAlert('SUCCESS', 'Donation successfully delivered.', meals + ' meals · ' + l.ngo, 'check-circle-2'); toast('Delivered — impact engine updated (+' + meals + ' meals).', 'ok')
    }
    renderApp();
}