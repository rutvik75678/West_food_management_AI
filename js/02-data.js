/* ============================================================
   FOODWISE AI · 02-data.js
   Global application state + synthetic DEMO DATA.
   Users/auth live in auth.js — do not duplicate here.
   ============================================================ */
const H = now();
const S = {
    user: null,
    page: 'dashboard',
    impact: { savedKg: 1240, meals: 3100, co2T: 2.8, waterL: 18500, money: 142000, preventedKg: 860, energyKwh: 640, ngoCount: 14 },
    demoDelta: null,
    flow: { predict: 0, prevent: 0, detect: 0, match: 0, optimize: 0, redistribute: 0, measure: 0 },
    hist: [862, 905, 918, 871, 930, 946, 812, 875, 912, 924, 883, 941, 952, 806, 912],
    f7: [{ d: 'Tue', date: 'Mar 4', v: 920, c: 94 }, { d: 'Wed', date: 'Mar 5', v: 908, c: 91 }, { d: 'Thu', date: 'Mar 6', v: 934, c: 92 }, { d: 'Fri', date: 'Mar 7', v: 946, c: 90 }, { d: 'Sat', date: 'Mar 8', v: 968, c: 87, event: true }, { d: 'Sun', date: 'Mar 9', v: 842, c: 89 }, { d: 'Mon', date: 'Mar 10', v: 899, c: 91 }],
    selDay: 0, range: '7', vSel: 'tomato',
    surplus: {
        prob: 87, kg: 48, risk: 'HIGH', action: 'Prepare 35 kg less food — set tomorrow\'s production to 940 meals.', accepted: false,
        factors: [{ n: 'Production plan above forecast', p: 44 }, { n: 'Historical Tuesday surplus', p: 26 }, { n: 'Event cancellation risk', p: 18 }, { n: 'Rain probability (evening)', p: 12 }]
    },
    waste: {
        kg: 37, afterKg: 31, causes: [{ n: 'Overproduction', p: 61 }, { n: 'Spoilage / storage', p: 22 }, { n: 'Plate waste', p: 11 }, { n: 'Processing loss', p: 6 }],
        factors: [{ n: 'Planned vs forecast gap', p: 34 }, { n: 'Tuesday surplus history', p: 27 }, { n: 'Inventory expiry pressure', p: 18 }, { n: 'Attendance variance', p: 12 }, { n: 'Ambient temperature', p: 9 }]
    },
    wasteTrend: [52, 44, 61, 38, 47, 55, 72, 41, 49, 58],
    surplusTrend: [31, 38, 44, 29, 36, 47, 58],
    redisTrend: [86, 102, 74, 118, 96, 64, 132],
    inv: [
        { id: 'S-207', name: 'Fresh salad bowls', q: 6, u: 'kg', hrs: 3, ts: H + 3 * 36e5, qual: 71, store: 'Cold A', risk: 'CRITICAL', rate: '−42% vs plan', note: 'Consumption far below expectation. Redistribute within 3 hours or log as waste.' },
        { id: 'C-118', name: 'Chapati (evening batch)', q: 80, u: 'pcs', hrs: 5, ts: H + 5 * 36e5, qual: 84, store: 'Hot hold', risk: 'HIGH', rate: '−28% vs plan', note: 'Dinner attendance trending lower. Offer with thali combos first.' },
        { id: 'V-091', name: 'Mixed veg curry', q: 18, u: 'kg', hrs: 6, ts: H + 6 * 36e5, qual: 88, store: 'Hot hold', risk: 'HIGH', rate: '−19% vs plan', note: 'FEFO priority at dinner service.' },
        { id: 'M-102', name: 'Milk (toned)', q: 40, u: 'L', hrs: 9, ts: H + 9 * 36e5, qual: 90, store: 'Cold A', risk: 'HIGH', rate: '−31% vs plan', note: 'Consumption rate lower than expected. Prioritize this batch for consumption or redistribution.' },
        { id: 'Y-044', name: 'Curd', q: 15, u: 'kg', hrs: 11, ts: H + 11 * 36e5, qual: 92, store: 'Cold A', risk: 'HIGH', rate: '−15% vs plan', note: 'Bundle with lunch thalis tomorrow.' },
        { id: 'P-056', name: 'Paneer', q: 8, u: 'kg', hrs: 12, ts: H + 12 * 36e5, qual: 94, store: 'Cold A', risk: 'MONITOR', rate: 'on plan', note: 'Stable. Keep at ≤4°C.' },
        { id: 'R-133', name: 'Steamed rice', q: 24, u: 'kg', hrs: 20, ts: H + 20 * 36e5, qual: 86, store: 'Hot hold', risk: 'MONITOR', rate: '−8% vs plan', note: 'Cook 24 kg less tomorrow (AI rec).' },
        { id: 'B-071', name: 'Bread', q: 60, u: 'pcs', hrs: 30, ts: H + 30 * 36e5, qual: 95, store: 'Dry', risk: 'MONITOR', rate: 'on plan', note: 'Stable.' },
        { id: 'D-201', name: 'Dal tadka', q: 30, u: 'kg', hrs: 24, ts: H + 24 * 36e5, qual: 91, store: 'Hot hold', risk: 'SAFE', rate: 'on plan', note: 'Stable.' },
        { id: 'F-310', name: 'Seasonal fruit', q: 12, u: 'kg', hrs: 36, ts: H + 36e5 * 36, qual: 96, store: 'Cold B', risk: 'SAFE', rate: '+6% vs plan', note: 'Healthy draw rate.' }
    ],
    ngos: [
        { name: 'Helping Hands Foundation', d: 2.4, cap: 200, need: 'Veg meals · daily', urg: 'HIGH', avail: true, rel: 98, score: 96, br: { Distance: 27, Capacity: 22, 'Food compatibility': 18, Urgency: 12, Availability: 9, Reliability: 8 } },
        { name: 'FoodCare Trust', d: 5.1, cap: 120, need: 'Any veg', urg: 'MEDIUM', avail: true, rel: 94, score: 89, br: { Distance: 21, Capacity: 19, 'Food compatibility': 18, Urgency: 12, Availability: 10, Reliability: 9 } },
        { name: 'Annaseva Seva Sanstha', d: 7.8, cap: 300, need: 'Dry + cooked', urg: 'LOW', avail: false, rel: 91, score: 84, br: { Distance: 17, Capacity: 23, 'Food compatibility': 14, Urgency: 8, Availability: 8, Reliability: 14 } }
    ],
    route: { orig: 18.2, opt: 13.9, eta: 24, co2: 1.8 },
    listing: null, matchState: 'idle', selNgo: null, dispatch: 0, delivered: false, routeOptimized: false, dispatchTimer: null,
    sensors: [
        { name: 'Cold Storage A', type: 'Cold room', temp: 4.2, hum: 68, gas: 'LOW', door: 'CLOSED', kwh: 3.1, safe: [2, 6], status: 'NORMAL', hist: Array.from({ length: 30 }, (_, i) => 4 + Math.sin(i / 4) * .5), base: 4 },
        { name: 'Cold Storage B', type: 'Cold room', temp: 4.1, hum: 66, gas: 'LOW', door: 'CLOSED', kwh: 3.4, safe: [2, 6], status: 'NORMAL', hist: Array.from({ length: 30 }, (_, i) => 4.1 + Math.sin(i / 5) * .4), base: 4.1, drift: 0 },
        { name: 'Dry Warehouse', type: 'Ambient', temp: 23.6, hum: 45, gas: 'LOW', door: 'OPEN', kwh: 1.2, safe: [18, 28], status: 'NORMAL', hist: Array.from({ length: 30 }, (_, i) => 23.5 + Math.sin(i / 6)), base: 23.5 },
        { name: 'Freezer Unit F1', type: 'Freezer', temp: -18.3, hum: 58, gas: 'LOW', door: 'CLOSED', kwh: 4.6, safe: [-22, -15], status: 'NORMAL', hist: Array.from({ length: 30 }, (_, i) => -18 + Math.sin(i / 4) * .6), base: -18.2 }
    ],
    energy: { hours: Array.from({ length: 24 }, (_, i) => i), actual: [10.2, 10.1, 9.8, 9.9, 10.4, 11.2, 12.1, 12.8, 13.4, 13.1, 12.9, 13.3, 13.8, 14.6, 18.7, 18.1, 17.4, 14.2, 13.6, 12.9, 12.4, 11.8, 11.2, 10.6], expected: Array.from({ length: 24 }, (_, i) => 12.8 + Math.sin((i - 4) / 24 * 6.28) * 1.6) },
    energyResolved: false, energyResolvedIoT: false, iotAlerted: false, coldBFixed: false,
    processing: {
        lines: [{ n: 'Line 1 · Milling', oee: 91, loss: 3.2 }, { n: 'Line 2 · Pulping', oee: 74, loss: 11.4, flag: true }, { n: 'Line 3 · Packing', oee: 88, loss: 4.1 }],
        anomaly: { title: 'Raw material loss increased by 18%', z: 2.81, if: 0.81, factors: [{ n: 'Machine downtime (2.3 h)', p: 44 }, { n: 'Rejection rate ↑ 4.2 pts', p: 33 }, { n: 'Production imbalance', p: 23 }], action: 'Inspect Processing Line 2.' }
    },
    alerts: [
        { sev: 'HIGH', t: 'Storage temperature exceeded safe operating threshold.', s: 'Cold Storage B · 9.8 °C · 4 min ago', icon: 'thermometer' },
        { sev: 'MEDIUM', t: 'Milk batch M-102 approaching expiry.', s: 'Shelf life 9 h · consumption −31%', icon: 'milk' },
        { sev: 'INFO', t: 'AI recommends reducing tomorrow\'s production.', s: 'Forecast 920 meals · recommend 940 (plan: 1,020)', icon: 'brain-circuit' },
        { sev: 'SUCCESS', t: 'Donation successfully delivered.', s: 'Helping Hands Foundation · 118 meals · yesterday', icon: 'check-circle-2' }
    ],
    audit: [
        { t: 'system', a: 'Synthetic seed data loaded (DEMO DATA)', ts: H - 864e5 * 3 },
        { t: 'institution', a: 'Production plan approved for Monday service', ts: H - 864e5 },
        { t: 'ngo', a: 'Helping Hands Foundation confirmed pickup capacity', ts: H - 72e5 },
        { t: 'logistics', a: 'Route EV-07 completed · 132 kg redistributed', ts: H - 36e5 }
    ],
    recs: [
        { id: 'rice', icon: 'chef-hat', t: 'Reduce rice production by 18 kg', s: 'Waste forecast drops 37 → 31 kg tomorrow', on: true, applied: false },
        { id: 'milk', icon: 'milk', t: 'Redistribute milk batch M-102', s: 'Expiry risk HIGH · 40 L · best match: Helping Hands', on: true, applied: false },
        { id: 'coldB', icon: 'refrigerator', t: 'Inspect cold storage unit B', s: 'IoT anomaly: temperature trending to threshold', on: true, applied: false }
    ],
    services: [
        { id: 'demand', name: 'Demand Forecasting', icon: 'trending-up', count: 1247, conf: 92, last: '920 meals · Tue', model: 'Gradient Boosting (demo)' },
        { id: 'surplus', name: 'Surplus Prediction', icon: 'alert-triangle', count: 968, conf: 88, last: '48 kg · prob 87%', model: 'Logistic baseline (demo)' },
        { id: 'vision', name: 'FoodVision AI', icon: 'scan-eye', count: 412, conf: 91, last: 'Tomato · GOOD 82%', model: 'CV interface · heuristic demo' },
        { id: 'shelf', name: 'Shelf-Life Prediction', icon: 'timer', count: 1105, conf: 90, last: 'M-102 · 9 h', model: 'Arrhenius-style heuristic (demo)' },
        { id: 'waste', name: 'Waste Prediction', icon: 'trash-2', count: 864, conf: 89, last: '37 kg · overprod 61%', model: 'Random Forest (demo)' },
        { id: 'match', name: 'NGO Matching', icon: 'heart-handshake', count: 397, conf: 96, last: 'Helping Hands · 96%', model: 'Weighted scoring (demo)' },
        { id: 'route', name: 'Route Optimization', icon: 'route', count: 289, conf: 95, last: '13.9 km (−23.6%)', model: 'Nearest-neighbour + 2-opt (demo)' },
        { id: 'anomaly', name: 'Anomaly Detection', icon: 'radar', count: 5340, conf: 89, last: 'Energy +41.6% · unit B', model: 'Isolation-style scoring (demo)' },
        { id: 'impact', name: 'Impact Engine', icon: 'leaf', count: 621, conf: 97, last: '+58 meals · today', model: 'Factor-based estimation' },
        { id: 'copilot', name: 'FoodWise Copilot', icon: 'sparkles', count: 214, conf: 93, last: 'Context: campus kitchen', model: 'Local rule-based demo' }
    ],
    copilotLog: []
};
