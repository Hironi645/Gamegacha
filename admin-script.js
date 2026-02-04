/**
 * ADMIN SCRIPT - Emoji Battle Gacha
 * Complete Version with all features
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function formatDate(date) {
    return new Date(date).toLocaleString('id-ID');
}

function getRarityColor(rarity) {
    const colors = { common: '#9ca3af', uncommon: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
    return colors[rarity] || colors.common;
}

function getRarityStars(rarity) {
    const stars = { common: '⭐', uncommon: '⭐⭐', rare: '⭐⭐⭐', epic: '⭐⭐⭐⭐', legendary: '⭐⭐⭐⭐⭐' };
    return stars[rarity] || '⭐';
}

function getVipColor(vipLevel) {
    const colors = { 0: '#9ca3af', 1: '#22c55e', 2: '#3b82f6', 3: '#a855f7', 4: '#f59e0b', 5: '#ef4444' };
    return colors[vipLevel] || colors[0];
}

function getVipName(vipLevel) {
    const names = { 0: 'Non-VIP', 1: 'VIP Bronze', 2: 'VIP Silver', 3: 'VIP Gold', 4: 'VIP Platinum', 5: 'VIP Diamond' };
    return names[vipLevel] || names[0];
}

function getPassName(passType) {
    const names = { 'none': 'Tidak Ada', 'weekly': 'Weekly Pass', 'monthly': 'Monthly Pass', 'seasonal': 'Season Pass' };
    return names[passType] || names['none'];
}

function getPassColor(passType) {
    const colors = { 'none': '#9ca3af', 'weekly': '#22c55e', 'monthly': '#3b82f6', 'seasonal': '#f59e0b' };
    return colors[passType] || colors['none'];
}

// ========================================
// EMOJI CARDS DATA
// ========================================

const EMOJI_CARDS = [
    { id: 1, emoji: '🐶', name: 'Doggo', rarity: 'common', hp: 80, attack: 15, defense: 10, speed: 12, desc: 'Teman setia yang selalu siap bertarung!' },
    { id: 2, emoji: '🐱', name: 'Meow', rarity: 'common', hp: 75, attack: 18, defense: 8, speed: 15, desc: 'Kucing lincah dengan cakar tajam' },
    { id: 3, emoji: '🐭', name: 'Squeak', rarity: 'common', hp: 60, attack: 12, defense: 5, speed: 20, desc: 'Tikus kecil yang cepat dan lincah' },
    { id: 4, emoji: '🐹', name: 'Hammy', rarity: 'common', hp: 70, attack: 10, defense: 15, speed: 8, desc: 'Hamster menggemaskan dengan gigitan kuat' },
    { id: 5, emoji: '🐰', name: 'Bunny', rarity: 'common', hp: 72, attack: 14, defense: 9, speed: 18, desc: 'Kelinci cepat dengan tendangan kuat' },
    { id: 6, emoji: '🦊', name: 'Foxxy', rarity: 'common', hp: 78, attack: 16, defense: 11, speed: 14, desc: 'Rubus cerdas dan licik' },
    { id: 7, emoji: '🐻', name: 'Beary', rarity: 'common', hp: 90, attack: 14, defense: 12, speed: 6, desc: 'Beruang besar yang kuat' },
    { id: 8, emoji: '🐼', name: 'Panda', rarity: 'common', hp: 85, attack: 13, defense: 14, speed: 7, desc: 'Panda imut dengan kekuatan besar' },
    { id: 9, emoji: '🐨', name: 'Koala', rarity: 'common', hp: 82, attack: 11, defense: 16, speed: 5, desc: 'Koala pemalas tapi tangguh' },
    { id: 10, emoji: '🐯', name: 'Tiggy', rarity: 'common', hp: 88, attack: 17, defense: 10, speed: 13, desc: 'Harimau muda yang berani' },
    { id: 11, emoji: '🦁', name: 'Leo', rarity: 'uncommon', hp: 95, attack: 22, defense: 15, speed: 14, desc: 'Raja hutan yang gagah berani' },
    { id: 12, emoji: '🐮', name: 'Bully', rarity: 'uncommon', hp: 100, attack: 18, defense: 20, speed: 8, desc: 'Sapi kuat dengan tanduk tajam' },
    { id: 13, emoji: '🐷', name: 'Piggy', rarity: 'uncommon', hp: 92, attack: 19, defense: 18, speed: 9, desc: 'Babi cerdas dengan kekuatan tersembunyi' },
    { id: 14, emoji: '🐸', name: 'Froggy', rarity: 'uncommon', hp: 78, attack: 20, defense: 12, speed: 16, desc: 'Katak melompat dengan lidah cepat' },
    { id: 15, emoji: '🐵', name: 'Monky', rarity: 'uncommon', hp: 85, attack: 21, defense: 13, speed: 19, desc: 'Monyet lincah dan cerdik' },
    { id: 16, emoji: '🐔', name: 'Clucky', rarity: 'uncommon', hp: 75, attack: 17, defense: 11, speed: 17, desc: 'Ayam petarung yang tangguh' },
    { id: 17, emoji: '🐧', name: 'Pengu', rarity: 'uncommon', hp: 88, attack: 16, defense: 19, speed: 10, desc: 'Penguin dingin dengan pukulan es' },
    { id: 18, emoji: '🐦', name: 'Birdy', rarity: 'uncommon', hp: 70, attack: 19, defense: 8, speed: 22, desc: 'Burung cepat yang sulit ditangkap' },
    { id: 19, emoji: '🐤', name: 'Chicky', rarity: 'uncommon', hp: 68, attack: 18, defense: 9, speed: 20, desc: 'Anak ayam kecil yang penuh semangat' },
    { id: 20, emoji: '🦆', name: 'Ducky', rarity: 'uncommon', hp: 80, attack: 17, defense: 14, speed: 13, desc: 'Bebek dengan paruh kuat' },
    { id: 21, emoji: '🦅', name: 'Eagle', rarity: 'rare', hp: 90, attack: 28, defense: 16, speed: 24, desc: 'Elang raja langit yang perkasa' },
    { id: 22, emoji: '🦉', name: 'Owly', rarity: 'rare', hp: 85, attack: 26, defense: 18, speed: 15, desc: 'Burung hantu bijak dengan mata tajam' },
    { id: 23, emoji: '🦇', name: 'Batty', rarity: 'rare', hp: 78, attack: 24, defense: 14, speed: 26, desc: 'Kelelawar malam yang misterius' },
    { id: 24, emoji: '🐺', name: 'Wolfy', rarity: 'rare', hp: 95, attack: 27, defense: 17, speed: 22, desc: 'Serigala alpha dengan auman mematikan' },
    { id: 25, emoji: '🐗', name: 'Boary', rarity: 'rare', hp: 105, attack: 25, defense: 22, speed: 12, desc: 'Babi hutan liar dengan taring tajam' },
    { id: 26, emoji: '🐴', name: 'Horsey', rarity: 'rare', hp: 100, attack: 24, defense: 19, speed: 25, desc: 'Kuda cepat dengan tendangan fatal' },
    { id: 27, emoji: '🦄', name: 'Unicorn', rarity: 'rare', hp: 92, attack: 29, defense: 15, speed: 23, desc: 'Unicorn ajaib dengan tanduk berkilau' },
    { id: 28, emoji: '🐝', name: 'Bee', rarity: 'rare', hp: 65, attack: 30, defense: 10, speed: 28, desc: 'Lebah cepat dengan sengatan mematikan' },
    { id: 29, emoji: '🐛', name: 'Buggy', rarity: 'rare', hp: 88, attack: 23, defense: 25, speed: 11, desc: 'Serangga raksasa dengan cangkang keras' },
    { id: 30, emoji: '🦋', name: 'Butterfly', rarity: 'rare', hp: 72, attack: 25, defense: 12, speed: 27, desc: 'Kupu-kupu anggun dengan debu ajaib' },
    { id: 31, emoji: '🐌', name: 'Snailord', rarity: 'epic', hp: 150, attack: 20, defense: 40, speed: 3, desc: 'Siput raksasa dengan cangkang tak tertembus' },
    { id: 32, emoji: '🐞', name: 'Ladybug', rarity: 'epic', hp: 95, attack: 35, defense: 22, speed: 24, desc: 'Kumbang keberuntungan dengan kekuatan besar' },
    { id: 33, emoji: '🐜', name: 'Ant King', rarity: 'epic', hp: 110, attack: 32, defense: 30, speed: 18, desc: 'Raja semut dengan kekuatan koloni' },
    { id: 34, emoji: '🦟', name: 'Mosquito', rarity: 'epic', hp: 70, attack: 38, defense: 8, speed: 30, desc: 'Nyamuk vampir yang menghisap darah' },
    { id: 35, emoji: '🦗', name: 'Cricket', rarity: 'epic', hp: 88, attack: 33, defense: 18, speed: 26, desc: 'Jangkrik dengan lompatan dahsyat' },
    { id: 36, emoji: '🕷️', name: 'Spidey', rarity: 'epic', hp: 98, attack: 36, defense: 20, speed: 22, desc: 'Laba-laba dengan jaring mematikan' },
    { id: 37, emoji: '🦂', name: 'Scorpio', rarity: 'epic', hp: 105, attack: 37, defense: 25, speed: 16, desc: 'Kalajengking dengan bisa mematikan' },
    { id: 38, emoji: '🦕', name: 'Dino', rarity: 'epic', hp: 140, attack: 34, defense: 35, speed: 8, desc: 'Dinosaurus purba yang bangkit kembali' },
    { id: 39, emoji: '🦖', name: 'T-Rex', rarity: 'epic', hp: 145, attack: 39, defense: 32, speed: 10, desc: 'T-Rex predator puncak' },
    { id: 40, emoji: '🐙', name: 'Octo', rarity: 'epic', hp: 120, attack: 31, defense: 28, speed: 14, desc: 'Gurita laut dengan lengan mengerahkan' },
    { id: 41, emoji: '🐍', name: 'Serpent', rarity: 'legendary', hp: 130, attack: 42, defense: 26, speed: 25, desc: 'Ular raksasa dengan bisa mematikan' },
    { id: 42, emoji: '🐢', name: 'Tortoise', rarity: 'legendary', hp: 180, attack: 28, defense: 50, speed: 4, desc: 'Kura-kura kuno dengan cangkang legendaris' },
    { id: 43, emoji: '🐡', name: 'Puffer', rarity: 'legendary', hp: 115, attack: 40, defense: 35, speed: 12, desc: 'Ikan buntal dengan duri beracun' },
    { id: 44, emoji: '🐠', name: 'Fishy', rarity: 'legendary', hp: 100, attack: 38, defense: 22, speed: 32, desc: 'Ikan magis dengan sisik berkilauan' },
    { id: 45, emoji: '🐟', name: 'Swordfish', rarity: 'legendary', hp: 125, attack: 45, defense: 24, speed: 35, desc: 'Ikan pedang dengan moncong tajam' },
    { id: 46, emoji: '🐬', name: 'Dolphin', rarity: 'legendary', hp: 135, attack: 41, defense: 30, speed: 33, desc: 'Lumba-lumba cerdas dengan sonar' },
    { id: 47, emoji: '🐳', name: 'Whale', rarity: 'legendary', hp: 200, attack: 35, defense: 45, speed: 6, desc: 'Paus raksasa dengan semburan dahsyat' },
    { id: 48, emoji: '🦈', name: 'Shark', rarity: 'legendary', hp: 150, attack: 48, defense: 32, speed: 30, desc: 'Hiu pemburu lautan' },
    { id: 49, emoji: '🐊', name: 'Croc', rarity: 'legendary', hp: 160, attack: 44, defense: 38, speed: 15, desc: 'Buaya rawa dengan rahang besi' },
    { id: 50, emoji: '🐉', name: 'Dragon', rarity: 'legendary', hp: 175, attack: 50, defense: 40, speed: 28, desc: 'Naga legendaris dengan napas api' },
    { id: 51, emoji: '🦕', name: 'Bronto', rarity: 'legendary', hp: 190, attack: 36, defense: 48, speed: 5, desc: 'Brontosaurus dengan leher panjang' },
    { id: 52, emoji: '👾', name: 'Alien', rarity: 'legendary', hp: 140, attack: 46, defense: 34, speed: 29, desc: 'Alien dari luar angkasa dengan teknologi' },
    { id: 53, emoji: '🤖', name: 'Robot', rarity: 'legendary', hp: 155, attack: 43, defense: 42, speed: 18, desc: 'Robot canggih dengan senjata laser' },
    { id: 54, emoji: '👻', name: 'Ghost', rarity: 'legendary', hp: 110, attack: 47, defense: 20, speed: 31, desc: 'Hantu tak terlihat dengan teriakan menakutkan' },
    { id: 55, emoji: '🎃', name: 'Pumpkin', rarity: 'legendary', hp: 165, attack: 39, defense: 36, speed: 13, desc: 'Labu Halloween dengan sihir gelap' }
];

// ========================================
// ADMIN STATE
// ========================================

let currentTopupFilter = 'pending';
let notifInterval = null;
let autoRefreshInterval = null;

// ========================================
// INITIALIZATION
// ========================================

function initAdminStorage() {
    if (!getFromStorage('users')) saveToStorage('users', {});
    if (!getFromStorage('topupRequests')) saveToStorage('topupRequests', []);
    if (!getFromStorage('globalChat')) saveToStorage('globalChat', []);
    if (!getFromStorage('adminLogs')) saveToStorage('adminLogs', []);
}

// ========================================
// ADMIN LOGIN
// ========================================

function adminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminData();
        startNotificationCheck();
        startAutoRefresh();
    } else {
        document.getElementById('adminError').textContent = 'Username atau password admin salah!';
    }
}

function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('adminLogin').classList.remove('hidden');
    stopNotificationCheck();
    stopAutoRefresh();
}

// ========================================
// AUTO REFRESH
// ========================================

function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        updateAdminStats();
        renderUsersTable();
        renderTopupRequests();
        renderOnlinePlayers();
        updateNotificationBadge();
    }, 5000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
}

function manualRefresh() {
    updateAdminStats();
    renderUsersTable();
    renderTopupRequests();
    renderOnlinePlayers();
    updateNotificationBadge();
    renderAdminLogs();
    alert('Data berhasil di-refresh!');
}

// ========================================
// NAVIGATION
// ========================================

function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));

    const targetSection = document.getElementById('admin' + section.charAt(0).toUpperCase() + section.slice(1));
    if (targetSection) targetSection.classList.add('active');
    
    // Find and activate the corresponding nav button
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + section + "'")) {
            btn.classList.add('active');
        }
    });

    if (section === 'topup') renderTopupRequests();
    if (section === 'chat') renderChatHistory();
    if (section === 'vip') { renderVipStats(); renderVipManager(); }
    if (section === 'logs') renderAdminLogs();
}

// ========================================
// LOAD ADMIN DATA
// ========================================

function loadAdminData() {
    updateAdminStats();
    renderUsersTable();
    renderAdminCards();
    renderBattleHistory();
    renderTopPlayers();
    renderTopupRequests();
    updateNotificationBadge();
    renderOnlinePlayers();
    renderAdminLogs();
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function startNotificationCheck() {
    updateNotificationBadge();
    notifInterval = setInterval(updateNotificationBadge, 5000);
}

function stopNotificationCheck() {
    if (notifInterval) clearInterval(notifInterval);
}

function updateNotificationBadge() {
    const topups = getFromStorage('topupRequests', []);
    const pending = topups.filter(t => t.status === 'pending').length;
    const badge = document.getElementById('notifBadge');
    if (badge) {
        badge.textContent = pending;
        badge.style.display = pending > 0 ? 'flex' : 'none';
    }
}

function showNotifications() {
    const modal = document.getElementById('notificationsModal');
    const list = document.getElementById('notificationsList');
    const topups = getFromStorage('topupRequests', []);
    const pending = topups.filter(t => t.status === 'pending').reverse();

    if (pending.length === 0) {
        list.innerHTML = '<p class="no-notif">Tidak ada notifikasi baru</p>';
    } else {
        list.innerHTML = pending.map(t => `
            <div class="notification-item">
                <i class="fas fa-credit-card"></i>
                <div class="notif-content">
                    <p><strong>${t.username}</strong> request top up <strong>${t.amount} ${t.type}</strong></p>
                    <span class="notif-time">${formatDate(t.time)}</span>
                </div>
            </div>
        `).join('');
    }
    modal.classList.remove('hidden');
}

function closeNotifications() {
    document.getElementById('notificationsModal').classList.add('hidden');
}

// ========================================
// ADMIN LOGS
// ========================================

function addAdminLog(action, target, details) {
    const logs = getFromStorage('adminLogs', []);
    logs.push({
        id: generateId(),
        action,
        target,
        details,
        time: new Date().toISOString(),
        admin: 'admin'
    });
    if (logs.length > 100) logs.shift();
    saveToStorage('adminLogs', logs);
    renderAdminLogs();
}

function renderAdminLogs() {
    const container = document.getElementById('adminLogsList');
    if (!container) return;

    const logs = getFromStorage('adminLogs', []).slice().reverse().slice(0, 20);

    container.innerHTML = logs.map(log => `
        <div class="log-item">
            <span class="log-time">${formatDate(log.time)}</span>
            <span class="log-action ${log.action}">${log.action}</span>
            <span class="log-target">${log.target}</span>
            <span class="log-details">${log.details}</span>
        </div>
    `).join('') || '<p class="no-data">Belum ada aktivitas admin</p>';
}

// ========================================
// STATS & OVERVIEW
// ========================================

function updateAdminStats() {
    const users = getFromStorage('users', {});
    const userList = Object.values(users);
    const topups = getFromStorage('topupRequests', []);

    document.getElementById('totalUsers').textContent = userList.length;
    document.getElementById('activeUsers').textContent = userList.filter(u => u.status === 'active' || !u.status).length;
    document.getElementById('bannedUsers').textContent = userList.filter(u => u.status === 'banned').length;
    document.getElementById('totalCardsAll').textContent = userList.reduce((sum, u) => sum + (u.cards?.length || 0), 0);
    document.getElementById('totalBattles').textContent = userList.reduce((sum, u) => sum + (u.wins || 0) + (u.losses || 0), 0);
    document.getElementById('totalGacha').textContent = userList.reduce((sum, u) => sum + (u.activities?.filter(a => a.icon === 'fa-dice').length || 0), 0);
    document.getElementById('totalTopup').textContent = topups.filter(t => t.status === 'pending').length;

    const vipUsers = userList.filter(u => (u.vipLevel || 0) > 0).length;
    const vipEl = document.getElementById('vipUsers');
    if (vipEl) vipEl.textContent = vipUsers;
}

function renderTopPlayers() {
    const users = getFromStorage('users', {});
    const userList = Object.values(users);
    userList.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    const container = document.getElementById('topPlayersList');
    if (container) {
        container.innerHTML = userList.slice(0, 5).map((user, index) => `
            <div class="top-item">
                <div class="top-rank">${index + 1}</div>
                <div class="top-info">
                    <span class="top-name">${user.username} ${getVipBadge(user.vipLevel)}</span>
                    <span class="top-score">${user.wins || 0} menang</span>
                </div>
            </div>
        `).join('') || '<p style="text-align: center; color: var(--text-muted);">Belum ada data</p>';
    }
}

function getVipBadge(vipLevel) {
    if (!vipLevel || vipLevel === 0) return '';
    return `<span class="vip-badge-small" style="background: ${getVipColor(vipLevel)}">VIP${vipLevel}</span>`;
}

function renderOnlinePlayers() {
    const users = getFromStorage('users', {});
    const userList = Object.values(users).filter(u => u.status === 'active' || !u.status);
    const container = document.getElementById('onlinePlayersList');
    if (!container) return;

    container.innerHTML = userList.slice(0, 10).map(user => `
        <div class="online-player-item">
            <div class="player-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div class="player-info">
                <span class="player-name">${user.username} ${getVipBadge(user.vipLevel)}</span>
                <span class="player-stats">${user.wins || 0} menang | ${user.coins?.toLocaleString()} koin</span>
            </div>
            <span class="status-dot ${user.status || 'active'}"></span>
        </div>
    `).join('') || '<p class="no-data">Tidak ada pemain online</p>';
}

// ========================================
// USERS MANAGEMENT
// ========================================

function renderUsersTable() {
    const users = getFromStorage('users', {});
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = Object.values(users).map(user => {
        const statusClass = user.status || 'active';
        const statusText = { active: 'Aktif', suspended: 'Suspend', banned: 'Banned' }[statusClass];
        const vipLevel = user.vipLevel || 0;

        return `
        <tr>
            <td><span class="status-dot ${statusClass}"></span></td>
            <td>
                <div class="user-name-cell">
                    <span class="username-text">${user.username}</span>
                    ${vipLevel > 0 ? `<span class="vip-badge-small" style="background: ${getVipColor(vipLevel)}">VIP${vipLevel}</span>` : ''}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.coins?.toLocaleString()}</td>
            <td>${user.gems?.toLocaleString()}</td>
            <td>${user.cards?.length || 0}</td>
            <td>${user.wins || 0}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-action-small btn-view" onclick="viewUser('${user.username}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn-action-small btn-edit" onclick="editUser('${user.username}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-action-small btn-warning" onclick="warnUser('${user.username}')" title="Warning"><i class="fas fa-exclamation-triangle"></i></button>
                <button class="btn-action-small btn-delete" onclick="banUser('${user.username}')" title="Ban"><i class="fas fa-ban"></i></button>
            </td>
        </tr>
    `}).join('') || '<tr><td colspan="9" style="text-align: center;">Tidak ada data</td></tr>';
}

function searchUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const users = getFromStorage('users', {});
    const tbody = document.getElementById('usersTableBody');
    const filtered = Object.values(users).filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
    );

    tbody.innerHTML = filtered.map(user => {
        const statusClass = user.status || 'active';
        const statusText = { active: 'Aktif', suspended: 'Suspend', banned: 'Banned' }[statusClass];
        const vipLevel = user.vipLevel || 0;

        return `
        <tr>
            <td><span class="status-dot ${statusClass}"></span></td>
            <td>
                <div class="user-name-cell">
                    <span class="username-text">${user.username}</span>
                    ${vipLevel > 0 ? `<span class="vip-badge-small" style="background: ${getVipColor(vipLevel)}">VIP${vipLevel}</span>` : ''}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.coins?.toLocaleString()}</td>
            <td>${user.gems?.toLocaleString()}</td>
            <td>${user.cards?.length || 0}</td>
            <td>${user.wins || 0}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-action-small btn-view" onclick="viewUser('${user.username}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn-action-small btn-edit" onclick="editUser('${user.username}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-action-small btn-warning" onclick="warnUser('${user.username}')" title="Warning"><i class="fas fa-exclamation-triangle"></i></button>
                <button class="btn-action-small btn-delete" onclick="banUser('${user.username}')" title="Ban"><i class="fas fa-ban"></i></button>
            </td>
        </tr>
    `}).join('') || '<tr><td colspan="9" style="text-align: center;">Tidak ada data</td></tr>';
}

function viewUser(username) {
    const users = getFromStorage('users', {});
    const user = users[username];
    if (!user) return;

    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');
    const vipLevel = user.vipLevel || 0;
    const passType = user.passType || 'none';

    content.innerHTML = `
        <div class="user-detail-header">
            <div class="user-detail-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div class="user-detail-title">
                <h3>${user.username} ${vipLevel > 0 ? `<span class="vip-badge" style="background: ${getVipColor(vipLevel)}">${getVipName(vipLevel)}</span>` : ''}</h3>
                <p class="user-pass-badge" style="color: ${getPassColor(passType)}">${getPassName(passType)}</p>
            </div>
        </div>
        <div class="user-detail-grid">
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${user.email}</span></div>
            <div class="detail-item"><span class="detail-label">Koin</span><span class="detail-value coin-value">${user.coins?.toLocaleString()}</span></div>
            <div class="detail-item"><span class="detail-label">Gem</span><span class="detail-value gem-value">${user.gems?.toLocaleString()}</span></div>
            <div class="detail-item"><span class="detail-label">Kartu</span><span class="detail-value">${user.cards?.length || 0}</span></div>
            <div class="detail-item"><span class="detail-label">Menang</span><span class="detail-value win-value">${user.wins || 0}</span></div>
            <div class="detail-item"><span class="detail-label">Kalah</span><span class="detail-value lose-value">${user.losses || 0}</span></div>
            <div class="detail-item"><span class="detail-label">PvP Menang</span><span class="detail-value">${user.pvpWins || 0}</span></div>
            <div class="detail-item"><span class="detail-label">PvP Poin</span><span class="detail-value">${user.pvpPoints || 0}</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ${user.status || 'active'}">${user.status === 'banned' ? 'Banned' : user.status === 'suspended' ? 'Suspend' : 'Aktif'}</span></span></div>
            <div class="detail-item"><span class="detail-label">Terdaftar</span><span class="detail-value">${formatDate(user.createdAt)}</span></div>
            <div class="detail-item"><span class="detail-label">Login Terakhir</span><span class="detail-value">${formatDate(user.lastLogin)}</span></div>
            ${user.statusReason ? `<div class="detail-item full-width"><span class="detail-label">Alasan Status</span><span class="detail-value warning-text">${user.statusReason}</span></div>` : ''}
        </div>
        <div class="user-detail-actions">
            <button class="btn-primary" onclick="editUser('${user.username}')"><i class="fas fa-edit"></i> Edit User</button>
            <button class="btn-warning" onclick="changeUserName('${user.username}')"><i class="fas fa-user-edit"></i> Ganti Nama</button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.add('hidden');
}

function editUser(username) {
    const users = getFromStorage('users', {});
    const user = users[username];
    if (!user) return;

    document.getElementById('editTargetUser').value = username;
    document.getElementById('editUserName').textContent = user.username;
    document.getElementById('editUserEmail').textContent = user.email || '-';
    document.getElementById('editUserCreated').textContent = user.createdAt ? formatDate(user.createdAt) : '-';
    document.getElementById('editUserLastLogin').textContent = user.lastLogin ? formatDate(user.lastLogin) : '-';
    
    // Set input values for editing
    document.getElementById('editUserNameInput').value = user.username;
    document.getElementById('editUserEmailInput').value = user.email || '';
    
    document.getElementById('editUserCoins').value = user.coins || 0;
    document.getElementById('editUserGems').value = user.gems || 0;
    document.getElementById('editUserStatus').value = user.status || 'active';
    document.getElementById('editUserReason').value = user.statusReason || '';
    document.getElementById('editUserVip').value = user.vipLevel || 0;
    document.getElementById('editUserPass').value = user.passType || 'none';
    
    // Render warnings list
    renderUserWarnings(user);

    document.getElementById('editUserModal').classList.remove('hidden');
}

function renderUserWarnings(user) {
    const warningsList = document.getElementById('userWarningsList');
    if (!warningsList) return;
    
    if (!user.warnings || user.warnings.length === 0) {
        warningsList.innerHTML = '<p class="no-data">Tidak ada peringatan</p>';
        return;
    }
    
    warningsList.innerHTML = user.warnings.map(w => `
        <div class="warning-item">
            <span class="warning-severity ${w.severity || 'medium'}">${w.severity || 'medium'}</span>
            <div class="warning-content">
                <div class="warning-reason">${w.reason}</div>
                <div class="warning-time">${formatDate(w.time)}</div>
            </div>
        </div>
    `).join('');
}

function adjustCurrency(type, amount) {
    const input = document.getElementById('editUser' + (type === 'coins' ? 'Coins' : 'Gems'));
    input.value = parseInt(input.value || 0) + amount;
}

function saveUserEdit() {
    let username = document.getElementById('editTargetUser').value;
    const users = getFromStorage('users', {});
    let user = users[username];
    if (!user) return;

    const oldCoins = user.coins || 0;
    const oldGems = user.gems || 0;
    const oldUsername = user.username;
    const oldEmail = user.email;
    
    // Get new values
    const newUsername = document.getElementById('editUserNameInput').value.trim();
    const newEmail = document.getElementById('editUserEmailInput').value.trim();

    // Validate new username
    if (!newUsername) {
        alert('Username tidak boleh kosong!');
        return;
    }
    
    // Check if username is taken by another user
    if (newUsername !== oldUsername && users[newUsername]) {
        alert('Username sudah digunakan oleh user lain!');
        return;
    }

    // Update user data
    user.coins = parseInt(document.getElementById('editUserCoins').value) || 0;
    user.gems = parseInt(document.getElementById('editUserGems').value) || 0;
    user.status = document.getElementById('editUserStatus').value;
    user.statusReason = document.getElementById('editUserReason').value;
    user.vipLevel = parseInt(document.getElementById('editUserVip').value) || 0;
    user.passType = document.getElementById('editUserPass').value;
    user.email = newEmail;
    
    // Handle username change
    if (newUsername !== oldUsername) {
        // Create new entry with new username
        users[newUsername] = { ...user, username: newUsername };
        delete users[oldUsername];
        username = newUsername;
        user = users[newUsername];
        
        // Notify user about username change
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            type: 'username_changed',
            message: `Username kamu diubah dari "${oldUsername}" menjadi "${newUsername}" oleh admin.`,
            time: new Date().toISOString(),
            read: false
        });
    }
    
    // Notify about email change
    if (newEmail !== oldEmail) {
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            type: 'email_changed',
            message: `Email kamu diubah dari "${oldEmail || '-'}" menjadi "${newEmail}" oleh admin.`,
            time: new Date().toISOString(),
            read: false
        });
    }

    if (oldCoins !== user.coins || oldGems !== user.gems) {
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            type: 'currency_changed',
            message: `Admin mengubah koin: ${oldCoins} → ${user.coins}, gem: ${oldGems} → ${user.gems}`,
            time: new Date().toISOString(),
            read: false
        });
    }

    if (user.status !== 'active') {
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            type: 'status_changed',
            message: `Akun kamu ${user.status === 'banned' ? 'dibanned' : 'disuspend'}. Alasan: ${user.statusReason}`,
            time: new Date().toISOString(),
            read: false
        });
    }

    saveToStorage('users', users);
    addAdminLog('edit_user', username, `Username: ${oldUsername}->${newUsername}, Coins: ${oldCoins}->${user.coins}, Gems: ${oldGems}->${user.gems}, Status: ${user.status}`);
    closeEditUserModal();
    renderUsersTable();
    alert('Perubahan berhasil disimpan!');
}

function resetUserPassword() {
    const username = document.getElementById('editTargetUser').value;
    const users = getFromStorage('users', {});
    const user = users[username];
    if (!user) return;
    
    const newPassword = prompt('Masukkan password baru:');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }
    
    user.password = btoa(newPassword); // Simple encoding
    
    if (!user.notifications) user.notifications = [];
    user.notifications.push({
        type: 'password_reset',
        message: 'Password kamu telah direset oleh admin.',
        time: new Date().toISOString(),
        read: false
    });
    
    saveToStorage('users', users);
    addAdminLog('password_reset', username, 'Password direset oleh admin');
    alert('Password berhasil direset!');
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden');
}

// ========================================
// CHANGE USERNAME
// ========================================

function changeUserName(oldUsername) {
    closeUserDetailModal();
    document.getElementById('changeNameTargetUser').value = oldUsername;
    document.getElementById('changeNameOld').textContent = oldUsername;
    document.getElementById('changeNameNew').value = '';
    document.getElementById('changeNameModal').classList.remove('hidden');
}

function saveNameChange() {
    const oldUsername = document.getElementById('changeNameTargetUser').value;
    const newUsername = document.getElementById('changeNameNew').value.trim();

    if (!newUsername || newUsername.length < 3) {
        alert('Username baru minimal 3 karakter!');
        return;
    }

    const users = getFromStorage('users', {});

    if (users[newUsername] && newUsername !== oldUsername) {
        alert('Username sudah digunakan!');
        return;
    }

    const user = users[oldUsername];
    if (!user) return;

    user.username = newUsername;
    users[newUsername] = user;
    delete users[oldUsername];

    if (!user.notifications) user.notifications = [];
    user.notifications.push({
        type: 'name_changed',
        message: `Username kamu telah diubah dari "${oldUsername}" menjadi "${newUsername}" oleh admin.`,
        time: new Date().toISOString(),
        read: false
    });

    saveToStorage('users', users);
    addAdminLog('change_name', `${oldUsername} → ${newUsername}`, 'Username changed by admin');
    closeChangeNameModal();
    renderUsersTable();
    alert(`Username berhasil diubah dari "${oldUsername}" menjadi "${newUsername}"!`);
}

function closeChangeNameModal() {
    document.getElementById('changeNameModal').classList.add('hidden');
}

// ========================================
// WARN USER
// ========================================

function warnUser(username) {
    document.getElementById('warnTargetUser').value = username;
    document.getElementById('warnUserName').textContent = username;
    document.getElementById('warnReason').value = '';
    document.getElementById('warnSeverity').value = 'medium';
    document.getElementById('warnUserModal').classList.remove('hidden');
}

function sendWarning() {
    const username = document.getElementById('warnTargetUser').value;
    const reason = document.getElementById('warnReason').value.trim();
    const severity = document.getElementById('warnSeverity').value;

    if (!reason) {
        alert('Alasan peringatan harus diisi!');
        return;
    }

    const users = getFromStorage('users', {});
    const user = users[username];
    if (!user) return;

    if (!user.warnings) user.warnings = [];
    user.warnings.push({
        reason,
        severity,
        time: new Date().toISOString(),
        by: 'admin'
    });

    if (!user.notifications) user.notifications = [];
    user.notifications.push({
        type: 'warning',
        message: `PERINGATAN [${severity.toUpperCase()}]: ${reason}`,
        time: new Date().toISOString(),
        read: false
    });

    saveToStorage('users', users);
    addAdminLog('warn_user', username, `Severity: ${severity}, Reason: ${reason}`);
    closeWarnModal();
    alert(`Peringatan telah dikirim ke ${username}!`);
}

function closeWarnModal() {
    document.getElementById('warnUserModal').classList.add('hidden');
}

// ========================================
// BAN USER
// ========================================

function banUser(username) {
    document.getElementById('banTargetUser').value = username;
    document.getElementById('banUserName').textContent = username;
    document.getElementById('banReason').value = '';
    document.getElementById('banType').value = 'cheat';
    document.getElementById('banDuration').value = 'permanent';
    document.getElementById('banUserModal').classList.remove('hidden');
}

function executeBan() {
    const username = document.getElementById('banTargetUser').value;
    const reason = document.getElementById('banReason').value.trim();
    const banType = document.getElementById('banType').value;
    const duration = document.getElementById('banDuration').value;

    if (!reason) {
        alert('Alasan ban harus diisi!');
        return;
    }

    const users = getFromStorage('users', {});
    const user = users[username];
    if (!user) return;

    user.status = duration === 'permanent' ? 'banned' : 'suspended';
    user.statusReason = `[${banType.toUpperCase()}] ${reason}`;
    user.bannedAt = new Date().toISOString();
    user.banDuration = duration;

    if (!user.notifications) user.notifications = [];
    user.notifications.push({
        type: 'banned',
        message: `Akun kamu telah ${duration === 'permanent' ? 'DIBANNED' : 'DISUSPEND'} karena ${banType}: ${reason}`,
        time: new Date().toISOString(),
        read: false
    });

    saveToStorage('users', users);
    addAdminLog('ban_user', username, `Type: ${banType}, Duration: ${duration}, Reason: ${reason}`);
    closeBanModal();
    renderUsersTable();
    alert(`User ${username} telah ${duration === 'permanent' ? 'dibanned' : 'disuspend'}!`);
}

function closeBanModal() {
    document.getElementById('banUserModal').classList.add('hidden');
}

function deleteUser(username) {
    if (!confirm(`Yakin ingin menghapus pengguna ${username}?`)) return;
    const users = getFromStorage('users', {});
    delete users[username];
    saveToStorage('users', users);
    renderUsersTable();
    updateAdminStats();
}

// ========================================
// TOP UP MANAGEMENT
// ========================================

function renderTopupRequests() {
    const topups = getFromStorage('topupRequests', []);
    const tbody = document.getElementById('topupTableBody');
    if (!tbody) return;

    const filtered = topups.filter(t => t.status === currentTopupFilter).reverse();

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>${formatDate(t.time)}</td>
            <td>${t.username}</td>
            <td>${t.type === 'coins' ? '🪙 Koin' : t.type === 'gems' ? '💎 Gem' : '👑 Paket'}</td>
            <td>${typeof t.amount === 'number' ? t.amount.toLocaleString() : t.amount}</td>
            <td>Rp ${t.price?.toLocaleString() || '-'}</td>
            <td><span class="status-badge ${t.status}">${t.status}</span></td>
            <td>
                ${t.status === 'pending' ? `
                    <button class="btn-action-small btn-view" onclick="approveTopup('${t.id}')">Setuju</button>
                    <button class="btn-action-small btn-delete" onclick="rejectTopup('${t.id}')">Tolak</button>
                ` : '-'}
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" style="text-align: center;">Tidak ada data</td></tr>';
}

function filterTopup(status) {
    currentTopupFilter = status;
    document.querySelectorAll('.topup-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderTopupRequests();
}

function refreshTopupList() {
    renderTopupRequests();
    updateNotificationBadge();
}

function approveTopup(id) {
    const topups = getFromStorage('topupRequests', []);
    const topup = topups.find(t => t.id === id);
    if (!topup) return;

    const users = getFromStorage('users', {});
    const user = users[topup.username];
    if (!user) return;

    if (topup.type === 'coins') user.coins = (user.coins || 0) + topup.amount;
    else if (topup.type === 'gems') user.gems = (user.gems || 0) + topup.amount;
    else if (topup.type === 'package' && topup.amount === 'sultan') {
        user.coins = (user.coins || 0) + 5000;
        user.gems = (user.gems || 0) + 1000;
    }

    topup.status = 'approved';
    topup.processedAt = new Date().toISOString();

    saveToStorage('users', users);
    saveToStorage('topupRequests', topups);

    if (!user.notifications) user.notifications = [];
    user.notifications.push({
        type: 'topup_approved',
        message: `Top up ${typeof topup.amount === 'number' ? topup.amount.toLocaleString() : topup.amount} ${topup.type} telah disetujui!`,
        time: new Date().toISOString(),
        read: false
    });
    saveToStorage('users', users);

    addAdminLog('approve_topup', topup.username, `${topup.amount} ${topup.type}`);

    alert('Top up berhasil disetujui!');
    renderTopupRequests();
    updateNotificationBadge();
}

function rejectTopup(id) {
    const reason = prompt('Alasan penolakan:');
    if (reason === null) return;

    const topups = getFromStorage('topupRequests', []);
    const topup = topups.find(t => t.id === id);
    if (!topup) return;

    topup.status = 'rejected';
    topup.reason = reason;
    topup.processedAt = new Date().toISOString();

    saveToStorage('topupRequests', topups);

    const users = getFromStorage('users', {});
    const user = users[topup.username];
    if (user) {
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            type: 'topup_rejected',
            message: `Top up ${topup.amount} ${topup.type} ditolak. Alasan: ${reason}`,
            time: new Date().toISOString(),
            read: false
        });
        saveToStorage('users', users);
    }

    addAdminLog('reject_topup', topup.username, `Reason: ${reason}`);

    alert('Top up ditolak!');
    renderTopupRequests();
    updateNotificationBadge();
}

// ========================================
// VIP MANAGEMENT
// ========================================

function renderVipStats() {
    const users = getFromStorage('users', {});
    const userList = Object.values(users);

    const vipStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const passStats = { none: 0, weekly: 0, monthly: 0, seasonal: 0 };

    userList.forEach(user => {
        const vipLevel = user.vipLevel || 0;
        vipStats[vipLevel]++;

        const passType = user.passType || 'none';
        passStats[passType]++;
    });

    for (let i = 0; i <= 5; i++) {
        const el = document.getElementById(`vip${i}Count`);
        if (el) el.textContent = vipStats[i];
    }

    ['none', 'weekly', 'monthly', 'seasonal'].forEach(type => {
        const el = document.getElementById(`pass${type}Count`);
        if (el) el.textContent = passStats[type];
    });

    const vipUsers = userList.filter(u => (u.vipLevel || 0) > 0).sort((a, b) => (b.vipLevel || 0) - (a.vipLevel || 0));
    const container = document.getElementById('vipUsersList');
    if (container) {
        container.innerHTML = vipUsers.map(user => `
            <div class="vip-user-item">
                <div class="vip-user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <div class="vip-user-info">
                    <span class="vip-user-name">${user.username}</span>
                    <span class="vip-user-level" style="color: ${getVipColor(user.vipLevel || 0)}">${getVipName(user.vipLevel || 0)}</span>
                </div>
                <span class="vip-badge-small" style="background: ${getVipColor(user.vipLevel || 0)}">VIP${user.vipLevel || 0}</span>
            </div>
        `).join('') || '<p class="no-data">Belum ada user VIP</p>';
    }
}

// ========================================
// VIP MANAGER
// ========================================

const DEFAULT_VIP_CONFIG = {
    1: { name: 'VIP Bronze', price: 100, color: '#22c55e', bonus: 10, benefits: ['+10% Bonus Koin', 'Badge Eksklusif'], desc: 'Level VIP pemula dengan benefit dasar' },
    2: { name: 'VIP Silver', price: 250, color: '#3b82f6', bonus: 20, benefits: ['+20% Bonus Koin', 'Badge Eksklusif', 'Daily Reward'], desc: 'Level VIP menengah dengan benefit lebih' },
    3: { name: 'VIP Gold', price: 500, color: '#a855f7', bonus: 30, benefits: ['+30% Bonus Koin', 'Badge Eksklusif', 'Daily Reward+', 'Priority Support'], desc: 'Level VIP premium dengan benefit istimewa' },
    4: { name: 'VIP Platinum', price: 1000, color: '#f59e0b', bonus: 40, benefits: ['+40% Bonus Koin', 'Badge Eksklusif', 'Daily Reward++', 'Priority Support', 'Exclusive Items'], desc: 'Level VIP elit dengan benefit maksimal' },
    5: { name: 'VIP Diamond', price: 2500, color: '#ef4444', bonus: 50, benefits: ['+50% Bonus Koin', 'Badge Eksklusif', 'Daily Reward+++', 'Priority Support', 'Exclusive Items', 'Custom Badge'], desc: 'Level VIP tertinggi dengan benefit eksklusif' }
};

function getVipConfig() {
    return getFromStorage('vipConfig', DEFAULT_VIP_CONFIG);
}

function saveVipConfig(config) {
    saveToStorage('vipConfig', config);
}

function renderVipManager() {
    const config = getVipConfig();
    
    for (let level = 1; level <= 5; level++) {
        const vip = config[level];
        if (vip) {
            const priceEl = document.getElementById(`vip${level}Price`);
            const benefitsEl = document.getElementById(`vip${level}Benefits`);
            
            if (priceEl) priceEl.textContent = vip.price;
            if (benefitsEl) {
                benefitsEl.innerHTML = vip.benefits.map(b => `<li><i class="fas fa-check"></i> ${b}</li>`).join('');
            }
        }
    }
}

function editVipConfig(level) {
    const config = getVipConfig();
    const vip = config[level] || DEFAULT_VIP_CONFIG[level];
    
    document.getElementById('editVipLevel').value = level;
    document.getElementById('vipEditName').value = vip.name;
    document.getElementById('vipEditPrice').value = vip.price;
    document.getElementById('vipEditColor').value = vip.color;
    document.getElementById('vipEditBonus').value = vip.bonus;
    document.getElementById('vipEditDesc').value = vip.desc || '';
    
    // Render benefits editor
    const benefitsEditor = document.getElementById('vipBenefitsEditor');
    if (benefitsEditor) {
        benefitsEditor.innerHTML = vip.benefits.map(b => `
            <div class="vip-benefit-item">
                <input type="text" value="${b}" placeholder="Benefit...">
                <button class="btn-remove-benefit" onclick="removeVipBenefit(this)"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }
    
    document.getElementById('vipEditModal').classList.remove('hidden');
}

function addVipBenefit() {
    const benefitsEditor = document.getElementById('vipBenefitsEditor');
    if (benefitsEditor) {
        const newItem = document.createElement('div');
        newItem.className = 'vip-benefit-item';
        newItem.innerHTML = `
            <input type="text" placeholder="Benefit baru...">
            <button class="btn-remove-benefit" onclick="removeVipBenefit(this)"><i class="fas fa-trash"></i></button>
        `;
        benefitsEditor.appendChild(newItem);
    }
}

function removeVipBenefit(btn) {
    const item = btn.closest('.vip-benefit-item');
    if (item) item.remove();
}

function closeVipEditModal() {
    document.getElementById('vipEditModal').classList.add('hidden');
}

function saveVipConfig() {
    const level = parseInt(document.getElementById('editVipLevel').value);
    if (!level || level < 1 || level > 5) {
        alert('Error: Level VIP tidak valid!');
        return;
    }
    
    const config = getVipConfig();
    
    // Collect benefits
    const benefits = [];
    document.querySelectorAll('#vipBenefitsEditor .vip-benefit-item input').forEach(input => {
        if (input.value.trim()) benefits.push(input.value.trim());
    });
    
    const name = document.getElementById('vipEditName').value.trim();
    if (!name) {
        alert('Nama VIP tidak boleh kosong!');
        return;
    }
    
    config[level] = {
        name: name,
        price: parseInt(document.getElementById('vipEditPrice').value) || 0,
        color: document.getElementById('vipEditColor').value,
        bonus: parseInt(document.getElementById('vipEditBonus').value) || 0,
        benefits: benefits,
        desc: document.getElementById('vipEditDesc').value
    };
    
    // Use saveToStorage instead of recursive call
    saveToStorage('vipConfig', config);
    renderVipManager();
    closeVipEditModal();
    
    addAdminLog('edit_vip_config', `VIP Level ${level}`, `Updated ${config[level].name}`);
    alert('Konfigurasi VIP berhasil disimpan!');
}

// ========================================
// ADMIN MENU DROPDOWN
// ========================================

function toggleAdminMenu() {
    const menu = document.getElementById('adminDropdownMenu');
    const btn = document.getElementById('adminMenuBtn');
    if (menu && btn) {
        menu.classList.toggle('hidden');
        btn.classList.toggle('active');
    }
}

function goToGame() {
    window.location.href = 'index.html';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('adminDropdownMenu');
    const btn = document.getElementById('adminMenuBtn');
    if (dropdown && btn && !dropdown.contains(event.target) && !btn.contains(event.target)) {
        dropdown.classList.add('hidden');
        btn.classList.remove('active');
    }
});

// ========================================
// CARDS MANAGEMENT
// ========================================

function renderAdminCards() {
    const grid = document.getElementById('adminCardGrid');
    if (!grid) return;

    grid.innerHTML = EMOJI_CARDS.map(card => `
        <div class="admin-card-item ${card.rarity}" onclick="editCard(${card.id})">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)}</div>
        </div>
    `).join('');
}

function filterAdminCards(rarity) {
    const grid = document.getElementById('adminCardGrid');
    if (!grid) return;

    let cards = EMOJI_CARDS;
    if (rarity !== 'all') cards = cards.filter(c => c.rarity === rarity);

    grid.innerHTML = cards.map(card => `
        <div class="admin-card-item ${card.rarity}" onclick="editCard(${card.id})">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)}</div>
        </div>
    `).join('');
}

function showAddCardModal() {
    document.getElementById('cardEditModal').classList.remove('hidden');
    document.getElementById('cardModalTitle').innerHTML = '<i class="fas fa-plus"></i> Tambah Kartu';
}

function closeCardEditModal() {
    document.getElementById('cardEditModal').classList.add('hidden');
}

function editCard(id) {
    const card = EMOJI_CARDS.find(c => c.id === id);
    if (!card) return;

    document.getElementById('cardEmoji').value = card.emoji;
    document.getElementById('cardName').value = card.name;
    document.getElementById('cardRarity').value = card.rarity;
    document.getElementById('cardHp').value = card.hp;
    document.getElementById('cardAttack').value = card.attack;
    document.getElementById('cardDefense').value = card.defense;
    document.getElementById('cardSpeed').value = card.speed;
    document.getElementById('cardDesc').value = card.desc;

    document.getElementById('cardModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Kartu';
    document.getElementById('cardEditModal').classList.remove('hidden');
}

function saveCard() {
    alert('Fitur edit kartu akan segera hadir!');
    closeCardEditModal();
}

// ========================================
// BATTLE HISTORY
// ========================================

function renderBattleHistory() {
    const users = getFromStorage('users', {});
    const tbody = document.getElementById('battlesTableBody');
    if (!tbody) return;

    let battles = [];
    Object.values(users).forEach(user => {
        if (user.activities) {
            user.activities.forEach(act => {
                if (act.icon === 'fa-trophy' || act.icon === 'fa-skull') {
                    battles.push({
                        user: user.username,
                        time: act.time,
                        message: act.message,
                        won: act.icon === 'fa-trophy'
                    });
                }
            });
        }
    });

    battles.sort((a, b) => new Date(b.time) - new Date(a.time));

    tbody.innerHTML = battles.slice(0, 50).map(battle => `
        <tr>
            <td>${formatDate(battle.time)}</td>
            <td>${battle.user}</td>
            <td>-</td>
            <td style="color: ${battle.won ? '#10b981' : '#ef4444'}">${battle.won ? 'Menang' : 'Kalah'}</td>
            <td>${battle.won ? '50+ koin' : '10 koin'}</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align: center;">Belum ada data pertarungan</td></tr>';
}

// ========================================
// CHAT MODERATION
// ========================================

function renderChatHistory() {
    const chats = getFromStorage('globalChat', []);
    const container = document.getElementById('chatHistory');
    if (!container) return;

    container.innerHTML = chats.slice(-100).map(c => `
        <div class="chat-message-admin">
            <span class="chat-time">${formatDate(c.time)}</span>
            <span class="chat-username">${c.username}:</span>
            <span class="chat-text">${escapeHtml(c.message)}</span>
            <button class="btn-delete-small" onclick="deleteChatMessage('${c.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('') || '<p class="no-data">Belum ada pesan chat</p>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function deleteChatMessage(id) {
    if (!confirm('Hapus pesan ini?')) return;
    let chats = getFromStorage('globalChat', []);
    chats = chats.filter(c => c.id !== id);
    saveToStorage('globalChat', chats);
    renderChatHistory();
}

function clearAllChat() {
    if (!confirm('Hapus SEMUA pesan chat?')) return;
    saveToStorage('globalChat', []);
    renderChatHistory();
}

// ========================================
// SETTINGS
// ========================================

function saveGachaRates() {
    alert('Rate gacha berhasil disimpan!');
}

function saveStartingResources() {
    alert('Resource awal berhasil disimpan!');
}

function saveBattleSettings() {
    alert('Pengaturan pertarungan berhasil disimpan!');
}

// ========================================
// DANGER ZONE
// ========================================

function backupData() {
    const data = {
        users: getFromStorage('users', {}),
        topupRequests: getFromStorage('topupRequests', []),
        globalChat: getFromStorage('globalChat', []),
        adminLogs: getFromStorage('adminLogs', []),
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gacha-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetAllData() {
    if (!confirm('Yakin ingin mereset SEMUA data?')) return;
    if (!confirm('SERIUS? Semua data akan hilang permanen!')) return;

    localStorage.clear();
    initAdminStorage();
    location.reload();
}

function clearAllUsers() {
    if (!confirm('Yakin ingin menghapus semua pengguna?')) return;
    saveToStorage('users', {});
    renderUsersTable();
    updateAdminStats();
}

// ========================================
// INITIALIZE ON LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initAdminStorage();

    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminData();
        startNotificationCheck();
        startAutoRefresh();
    }
});

// Close modals on outside click
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});
