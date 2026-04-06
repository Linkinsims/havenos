const STATE = {
    currency: 'R', vat: 15, hotelName: 'HavenOS', checkinTime: '14:00',
    theme: 'luxury', sidebarCollapsed: window.innerWidth < 900
};

const DATA = {
    reservations: [
        { ref: 'RES-7023', guest: 'Sarah Jenkins', room: '302', dates: '15 Apr - 17 Apr', nights: 2, total: 3250.00, source: 'Direct', status: 'Upcoming' },
        { ref: 'RES-7024', guest: 'Johan van der Merwe', room: '101', dates: '14 Apr - 18 Apr', nights: 4, total: 4800.00, source: 'Booking.com', status: 'Active' },
        { ref: 'RES-7025', guest: 'Noluthando Nkosi', room: '205', dates: '10 Apr - 15 Apr', nights: 5, total: 6000.00, source: 'Corporate', status: 'Checked Out' },
        { ref: 'RES-7026', guest: 'Aisha Patel', room: '108', dates: '16 Apr - 19 Apr', nights: 3, total: 4200.00, source: 'Direct', status: 'Cancelled' }
    ],
    rooms: [
        { num: '101', type: 'Standard', status: 'occupied', floor: 1 }, { num: '102', type: 'Standard', status: 'available', floor: 1 },
        { num: '103', type: 'Deluxe', status: 'cleaning', floor: 1 }, { num: '104', type: 'Deluxe', status: 'available', floor: 1 },
        { num: '105', type: 'Suite', status: 'reserved', floor: 1 }, { num: '201', type: 'Standard', status: 'available', floor: 2 },
        { num: '202', type: 'Standard', status: 'occupied', floor: 2 }, { num: '203', type: 'Deluxe', status: 'available', floor: 2 },
        { num: '204', type: 'Deluxe', status: 'maintenance', floor: 2 }, { num: '205', type: 'Suite', status: 'occupied', floor: 2 },
        { num: '301', type: 'Suite', status: 'available', floor: 3 }, { num: '302', type: 'Suite', status: 'reserved', floor: 3 }
    ],
    guests: [
        { name: 'Sarah Jenkins', email: 's.jenkins@mail.com', phone: '082 555 1234', stays: 1, total: 3250, type: 'Standard', last: 'Pending' },
        { name: 'Johan van der Merwe', email: 'johan@corp.co.za', phone: '071 234 5678', stays: 12, total: 45000, type: 'Corporate', last: '2 weeks ago' },
        { name: 'Noluthando Nkosi', email: 'nolu@gmail.com', phone: '065 987 6543', stays: 4, total: 18000, type: 'VIP', last: '1 month ago' },
        { name: 'Sipho Khumalo', email: 'skhumalo@mweb.co.za', phone: '083 111 2222', stays: 2, total: 5400, type: 'Standard', last: '3 months ago' }
    ],
    staff: [
        { name: 'Grace Mokoena', role: 'Front Desk', dept: 'Reception', shift: '08:00 - 16:00', status: 'On Duty' },
        { name: 'Pieter Steyn', role: 'Concierge', dept: 'Guest Services', shift: '10:00 - 18:00', status: 'On Duty' },
        { name: 'Linda Dlamini', role: 'Housekeeping Supervisor', dept: 'Housekeeping', shift: '07:00 - 15:00', status: 'On Duty' },
        { name: 'David Smith', role: 'Bartender', dept: 'Restaurant', shift: '16:00 - 00:00', status: 'Off Duty' }
    ],
    posOrders: [
        { ref: 'Ord-441', target: 'Room 101', items: 3, total: 420.00, status: 'Preparing' },
        { ref: 'Ord-442', target: 'Table 4', items: 2, total: 180.00, status: 'Delivered' }
    ],
    posCart: []
};

// Utilities
const formatCurr = (num) => parseFloat(num).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const updateCurrencyDisplays = () => document.querySelectorAll('.currency-display').forEach(el => el.textContent = STATE.currency);
const updateHotelName = () => document.querySelectorAll('.hotel-name-display').forEach(el => el.textContent = STATE.hotelName);

// Toast
function showToast(msg, type='success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<div class="toast-icon">${type === 'success' ? '✓' : '!'}</div><div class="toast-message">${msg}</div>`;
    c.appendChild(t);
    void t.offsetWidth; // trigger reflow
    t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2800);
}

// Navigation
function switchPage(pageId, title) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-target="${pageId}"]`).classList.add('active');
    document.getElementById('page-title').textContent = title;
}

// Modals
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function closeModalAndToast(msg, type, id) { closeModal(id); showToast(msg, type); }

document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', e => {
    e.target.closest('.modal').classList.remove('show');
}));

// Setup Event Listeners
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if(btn.dataset.target === 'notifications') {
            document.querySelector('.notification-badge').style.display = 'none';
        }
        switchPage(btn.dataset.target, btn.querySelector('.text').textContent);
        if(window.innerWidth < 900) { document.getElementById('sidebar').classList.add('collapsed'); }
    });
});

document.getElementById('sidebar-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

document.querySelectorAll('.settings-trigger').forEach(b => b.addEventListener('click', () => openModal('modal-settings')));

// Page Renderers
function renderDashboard() {
    document.getElementById('dashboard-kpis').innerHTML = `
        <div class="kpi-card"><div class="kpi-icon">🛏️</div><div><div class="kpi-value">78%</div><div class="kpi-label">Occupancy Rate</div><div class="kpi-trend trend-up">↑ 4% this wk</div></div></div>
        <div class="kpi-card"><div class="kpi-icon">💰</div><div><div class="kpi-value"><span class="currency-display">${STATE.currency}</span>34,500</div><div class="kpi-label">Revenue Today</div><div class="kpi-trend trend-up">↑ 12% vs yst</div></div></div>
        <div class="kpi-card"><div class="kpi-icon">🔑</div><div><div class="kpi-value">12 / 15</div><div class="kpi-label">Check-ins Done</div><div class="kpi-trend trend-down">3 Pending</div></div></div>
        <div class="kpi-card"><div class="kpi-icon">🧹</div><div><div class="kpi-value">6</div><div class="kpi-label">Rooms to Clean</div><div class="kpi-trend trend-up">2 IN PROGRESS</div></div></div>
    `;
    
    document.getElementById('dashboard-revenue-chart').innerHTML = [40, 65, 45, 80, 50, 95, 70].map((h, i) => 
        `<div class="bar-col" style="height:${h}%;"><div class="bar-val">${h}k</div><div class="bar-label">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div></div>`
    ).join('');

    document.getElementById('dashboard-room-status').innerHTML = `
        <svg viewBox="0 0 100 100" class="donut-svg">
            <circle cx="50" cy="50" r="40" class="donut-segment" stroke="var(--success)" stroke-dasharray="251.2" stroke-dashoffset="50" title="Available"></circle>
            <circle cx="50" cy="50" r="40" class="donut-segment" stroke="var(--navy)" stroke-dasharray="251.2" stroke-dashoffset="150" title="Occupied"></circle>
        </svg>
        <div class="donut-center">78%</div>
    `;

    const tb = document.querySelector('#table-dashboard-checkins tbody');
    tb.innerHTML = DATA.reservations.filter(r => r.status === 'Upcoming' || r.status === 'Active').map(r => `
        <tr><td>${r.guest}</td><td>${r.room}</td><td>${r.source}</td>
        <td><span class="badge badge-${r.status === 'Upcoming' ? 'warning' : 'success'}">${r.status}</span></td>
        <td><button class="btn btn-outline btn-sm" onclick="editReservation('${r.ref}')">View</button></td></tr>
    `).join('');

    document.getElementById('dashboard-activity').innerHTML = `
        <li class="activity-item"><div class="activity-dot bg-success" style="background:var(--success)"></div><div class="activity-content"><div class="activity-text">Sarah Jenkins checked in to Room 302</div><div class="activity-time">10 mins ago</div></div></li>
        <li class="activity-item"><div class="activity-dot bg-warning" style="background:var(--warning)"></div><div class="activity-content"><div class="activity-text">New reservation: RES-7030 via Booking.com</div><div class="activity-time">25 mins ago</div></div></li>
        <li class="activity-item"><div class="activity-dot bg-info" style="background:var(--info)"></div><div class="activity-content"><div class="activity-text">Room 103 cleaning completed by Linda Dlamini</div><div class="activity-time">1 hour ago</div></div></li>
    `;
}

function renderReservations(filter = 'All') {
    const list = filter === 'All' ? DATA.reservations : DATA.reservations.filter(r => r.status === filter);
    const getBadge = s => ({'Upcoming':'warning','Active':'success','Checked Out':'gray','Cancelled':'danger'})[s] || 'info';
    
    document.querySelector('#table-reservations tbody').innerHTML = list.map(r => `
        <tr>
            <td class="fw-bold">${r.ref}</td><td>${r.guest}</td><td>${r.room}</td><td>${r.dates}</td>
            <td>${r.nights}</td><td><span class="currency-display">${STATE.currency}</span>${formatCurr(r.total)}</td><td>${r.source}</td>
            <td><span class="badge badge-${getBadge(r.status)}">${r.status}</span></td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-outline btn-sm" onclick="editReservation('${r.ref}')">Edit</button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="deleteReservation('${r.ref}')">Delete</button>
                    ${r.status!=='Cancelled' ? `<button class="btn btn-gold btn-sm" onclick="openInvoice('${r.ref}')">Invoice</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    updateCurrencyDisplays();
}

function openNewReservation() {
    document.querySelector('#modal-reservation .modal-header h2').textContent = 'New Reservation';
    const inputs = document.querySelector('#modal-reservation').querySelectorAll('.input-field');
    const textareas = document.querySelector('#modal-reservation').querySelectorAll('textarea');
    
    // Reset inputs
    inputs.forEach(i => i.value = '');
    textareas.forEach(t => t.value = '');
    inputs[5].value = '1'; // Number of guests
    inputs[6].value = '1200.00'; // Rate

    document.querySelector('#modal-reservation .btn-primary').textContent = 'Create Booking';
    document.querySelector('#modal-reservation .btn-primary').onclick = function() {
        const name = inputs[0].value;
        if(!name) return showToast('Guest Name is required', 'error');

        const newRes = {
            ref: `RES-${Math.floor(7000 + Math.random() * 999)}`,
            guest: name,
            room: inputs[4].value || 'TBD',
            dates: `${inputs[2].value} - ${inputs[3].value}`,
            nights: 1, // Simplified
            total: parseFloat(inputs[6].value) || 0,
            source: inputs[7].value,
            status: 'Upcoming'
        };

        DATA.reservations.unshift(newRes);
        renderReservations();
        renderDashboard();
        renderBilling();
        closeModalAndToast('Reservation Confirmed', 'success', 'modal-reservation');
    };
    openModal('modal-reservation');
}

function editReservation(ref) {
    const r = DATA.reservations.find(x => x.ref === ref);
    if(r) {
        document.querySelector('#modal-reservation .modal-header h2').textContent = `Edit Reservation: ${ref}`;
        const inputs = document.querySelector('#modal-reservation').querySelectorAll('.input-field');
        
        inputs[0].value = r.guest;
        inputs[6].value = r.total;
        inputs[7].value = r.source;
        
        document.querySelector('#modal-reservation .btn-primary').textContent = 'Save Changes';
        document.querySelector('#modal-reservation .btn-primary').onclick = function() {
            r.guest = inputs[0].value;
            r.total = parseFloat(inputs[6].value) || 0;
            r.source = inputs[7].value;
            
            renderReservations();
            renderDashboard();
            renderBilling();
            closeModalAndToast('Reservation Updated', 'success', 'modal-reservation');
        };
        openModal('modal-reservation');
    }
}

function deleteReservation(ref) {
    if(confirm(`Are you sure you want to delete reservation ${ref}?`)) {
        DATA.reservations = DATA.reservations.filter(r => r.ref !== ref);
        renderReservations();
        renderDashboard();
        renderBilling();
        showToast('Reservation deleted successfully', 'success');
    }
}

function renderRooms() {
    let html = '';
    [1, 2, 3].forEach(floor => {
        const fRooms = DATA.rooms.filter(r => r.floor === floor);
        if(fRooms.length) {
            html += `<h4 class="rooms-floor-label">Floor ${floor}</h4><div class="rooms-grid mb-4">`;
            html += fRooms.map(r => `
                <div class="room-tile tile-${r.status}" onclick="showToast('Room ${r.num} Details Opened')">
                    <div class="room-num">${r.num}</div><div class="room-type">${r.type}</div>
                    <div class="badge badge-${r.status==='available'?'success':r.status==='occupied'?'info':r.status==='maintenance'?'danger':'warning'} mt-2 p-0 text-center" style="font-size:0.6rem; padding: 2px 6px;">${r.status}</div>
                </div>
            `).join('');
            html += `</div>`;
        }
    });
    document.getElementById('rooms-grid').innerHTML = html;
}

function renderGuests() {
    document.querySelector('#table-guests tbody').innerHTML = DATA.guests.map(g => {
        const inits = g.name.split(' ').map(n=>n[0]).join('');
        return `
        <tr>
            <td><div class="flex align-center gap-3"><div class="avatar" style="width:32px;height:32px;font-size:0.8rem;">${inits}</div>
            <div><div class="fw-bold">${g.name}</div></div></div></td>
            <td><div class="text-sm">${g.email}</div><div class="text-sm text-muted">${g.phone}</div></td>
            <td>${g.stays}</td><td><span class="currency-display">${STATE.currency}</span>${formatCurr(g.total)}</td>
            <td><span class="badge ${g.type==='VIP'?'badge-warning':'badge-gray'}">${g.type}</span></td>
            <td class="text-muted text-sm">${g.last}</td>
        </tr>
    `}).join('');
}

function renderHousekeeping() {
    const list = [
        {room:'108', task:'Departure Clean', staff:'L. Dlamini', col:'kb-pending', prog:0},
        {room:'204', task:'Deep Clean', staff:'M. Nkosi', col:'kb-pending', prog:0},
        {room:'103', task:'Stayover Clean', staff:'L. Dlamini', col:'kb-progress', prog:60},
        {room:'201', task:'Departure Clean', staff:'J. Smith', col:'kb-inspect', prog:100},
        {room:'102', task:'Stayover Clean', staff:'M. Nkosi', col:'kb-done', prog:100}
    ];
    ['kb-pending','kb-progress','kb-inspect','kb-done'].forEach(id => document.getElementById(id).innerHTML = '');
    list.forEach(i => {
        document.getElementById(i.col).insertAdjacentHTML('beforeend', `
            <div class="kb-card">
                <div class="kb-header"><div class="kb-room">${i.room}</div><div class="kb-task">${i.task}</div></div>
                <div class="kb-body"><div class="kb-staff"><div class="staff-ava">${i.staff[0]}</div> ${i.staff}</div></div>
                <div class="kb-progress"><div class="kb-progress-bar" style="width:${i.prog}%"></div></div>
                <div class="kb-actions mt-3">
                    ${i.col==='kb-pending' ? `<button class="btn btn-outline w-full btn-sm" onclick="showToast('Task started')">Start Task</button>` : ''}
                    ${i.col==='kb-progress' ? `<button class="btn btn-primary w-full btn-sm" onclick="showToast('Sent for inspection')">Request Inspection</button>` : ''}
                    ${i.col==='kb-inspect' ? `<button class="btn btn-success w-half btn-sm" style="background:var(--success);color:white" onclick="showToast('Passed')">Pass</button><button class="btn btn-danger w-half btn-sm">Fail</button>` : ''}
                </div>
            </div>
        `);
    });
}

function renderStaff() {
    document.querySelector('#table-staff tbody').innerHTML = DATA.staff.map(s => `
        <tr>
            <td class="fw-bold">${s.name}</td><td>${s.role}</td><td>${s.dept}</td><td>${s.shift}</td>
            <td><span class="badge ${s.status==='On Duty'?'badge-success':'badge-gray'}">${s.status}</span></td>
        </tr>
    `).join('');
}

// Checkin-Checkout
function nextCheckinStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    for(let i=1; i<=3; i++) {
        document.getElementById(`checkin-step-${i}`).style.display = i === step ? 'block' : 'none';
        if(i < step) document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
        if(i === step) document.querySelector(`.step[data-step="${i}"]`).classList.add('active');
    }
}
function completeCheckin() {
    showToast('Check-in successful. Key issued for Room 302', 'success');
    setTimeout(() => nextCheckinStep(1), 2000);
}
document.getElementById('checkout-room-select').addEventListener('change', e => {
    document.getElementById('checkout-details').style.display = e.target.value ? 'block' : 'none';
});
function processCheckout() {
    showToast('Payment processed. Room marked for cleaning.', 'success');
    document.getElementById('checkout-room-select').value = "";
    document.getElementById('checkout-details').style.display = 'none';
}

// POS System
function addPosItem(sel) {
    if(!sel.value) return;
    const [name, price] = sel.value.split('|');
    DATA.posCart.push({name, price: parseFloat(price)});
    renderPosCart();
    sel.value = "";
}
function removePosItem(index) {
    DATA.posCart.splice(index, 1);
    renderPosCart();
}
function renderPosCart() {
    const list = document.getElementById('pos-cart-items');
    list.innerHTML = DATA.posCart.map((i, idx) => `
        <li class="flex justify-between mb-2"><span>${i.name}</span>
        <span><span class="currency-display">${STATE.currency}</span>${formatCurr(i.price)} <button onclick="removePosItem(${idx})" class="text-danger ml-2 bg-transparent border-none" style="margin-left:8px;cursor:pointer">×</button></span></li>
    `).join('');
    
    const sub = DATA.posCart.reduce((sum, i) => sum + i.price, 0);
    const vat = sub * (STATE.vat / 100);
    const tot = sub + vat;
    document.getElementById('pos-subtotal').textContent = formatCurr(sub);
    document.getElementById('pos-vat').textContent = formatCurr(vat);
    document.getElementById('pos-total').textContent = formatCurr(tot);
    updateCurrencyDisplays();
}
function submitPosOrder() {
    if(!DATA.posCart.length) return showToast('Cart is empty', 'error');
    showToast('Order placed successfully to ' + document.getElementById('pos-charge-to').value);
    DATA.posCart = [];
    renderPosCart();
}

// Invoices
function renderBilling() {
    document.querySelector('#table-billing tbody').innerHTML = DATA.reservations.map(r => `
        <tr>
            <td class="fw-bold">INV-${r.ref.split('-')[1]}</td>
            <td>15 Apr 2026</td>
            <td>${r.guest}</td>
            <td><span class="currency-display">${STATE.currency}</span>${formatCurr(r.total)}</td>
            <td><span class="currency-display">${STATE.currency}</span>${formatCurr(r.total * (STATE.vat/100))}</td>
            <td><span class="badge ${r.status==='Active'?'badge-success':'badge-warning'}">${r.status==='Active'?'Paid':'Pending'}</span></td>
            <td><button class="btn btn-outline btn-sm" onclick="openInvoice('${r.ref}')">View</button></td>
        </tr>
    `).join('');
}

function openInvoice(ref) {
    const r = DATA.reservations.find(x => x.ref === ref);
    if(!r) return;
    document.getElementById('inv-ref').textContent = `INV-${ref.split('-')[1]}`;
    document.getElementById('inv-date').textContent = new Date().toLocaleDateString('en-ZA');
    document.getElementById('inv-guest').textContent = r.guest;
    document.getElementById('inv-room').textContent = `Room ${r.room}`;
    document.getElementById('inv-dates').textContent = r.dates;
    
    const sub = r.total;
    const vat = sub * (STATE.vat / 100);
    
    document.getElementById('inv-lines').innerHTML = `
        <tr><td>Accommodation (${r.nights} nights)</td><td class="text-right"><span class="currency-display">${STATE.currency}</span>${formatCurr(sub)}</td></tr>
    `;
    document.getElementById('inv-subtotal').textContent = formatCurr(sub);
    document.getElementById('inv-vat').textContent = formatCurr(vat);
    document.getElementById('inv-total').textContent = formatCurr(sub + vat);
    
    updateCurrencyDisplays();
    document.querySelectorAll('.vat-display').forEach(e => e.textContent = STATE.vat);
    openModal('modal-invoice');
}

// Settings
document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', e => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        const theme = e.target.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        STATE.theme = theme;
    });
});

function saveSettings() {
    STATE.hotelName = document.getElementById('setting-name').value;
    STATE.currency = document.getElementById('setting-currency').value;
    STATE.vat = document.getElementById('setting-vat').value;
    updateCurrencyDisplays();
    updateHotelName();
    document.querySelectorAll('.vat-display').forEach(e => e.textContent = STATE.vat);
    closeModalAndToast('Settings updated successfully');
}

// Tab Listeners
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', e => {
        e.target.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderReservations(e.target.dataset.filter);
    });
});

// Topbar dynamic actions helper
const pageActionsConfig = {
    'dashboard': '<button class="btn btn-primary" onclick="openNewReservation()">+ New Booking</button>',
    'reservations': '<button class="btn btn-primary" onclick="openNewReservation()">+ New Booking</button>',
    'guests': '<button class="btn btn-primary" onclick="openModal(\'modal-guest\')">+ Add Guest</button>'
};

// Override switchPage to handle topbar actions implicitly using Observer
const observer = new MutationObserver(() => {
    const act = document.querySelector('.page.active');
    if(act) {
        const id = act.id.replace('page-', '');
        document.getElementById('topbar-actions').innerHTML = pageActionsConfig[id] || '';
    }
});
observer.observe(document.getElementById('page-container'), {attributes: true, subtree: true, attributeFilter: ['class']});


// Init
function initApp() {
    renderDashboard();
    renderReservations();
    renderRooms();
    renderGuests();
    renderHousekeeping();
    renderStaff();
    renderBilling();
    updateHotelName();
    updateCurrencyDisplays();
    document.querySelectorAll('.vat-display').forEach(e => e.textContent = STATE.vat);
    
    // Default Topbar Action
    document.getElementById('topbar-actions').innerHTML = pageActionsConfig['dashboard'];
    
    // Bind pos module orders static table logic manually since short
    document.querySelector('#table-pos-orders tbody').innerHTML = DATA.posOrders.map(o => `
        <tr><td>${o.target}</td><td>${o.items} items</td><td><span class="currency-display">${STATE.currency}</span>${formatCurr(o.total)}</td>
        <td><span class="badge ${o.status==='Delivered'?'badge-success':'badge-warning'}">${o.status}</span></td></tr>
    `).join('');

    setTimeout(() => {
        showToast('Welcome to HavenOS', 'success');
        document.querySelector('.notification-badge').style.display = 'inline-flex';
        document.querySelector('.notification-badge').textContent = '2';
    }, 1000);
}

window.onload = initApp;
