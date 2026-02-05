/**
 * ADMIN SCRIPT - Emoji Battle Gacha (SUPABASE VERSION)
 * Complete Version with Real-time Online Database
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
// ADMIN STATE
// ========================================

let currentTopupFilter = 'pending';
let currentPasswordResetFilter = 'pending';
let notifInterval = null;
let autoRefreshInterval = null;
let topupSubscription = null;
let passwordResetSubscription = null;
let gameSettings = null;
let paymentSettings = null;

// ========================================
// INITIALIZATION
// ========================================

window.addEventListener('load', async function() {
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        await loadAdminData();
        startNotificationCheck();
        startAutoRefresh();
        startSubscriptions();
    }
});

async function loadAdminData() {
    await loadSettings();
    await updateAdminStats();
    await renderUsersTable();
    await renderAdminCards();
    await renderTopPlayers();
    await renderTopupRequests();
    await renderPasswordResetList();
    await updateNotificationBadge();
    await renderOnlinePlayers();
    await renderAdminLogs();
    await renderPaymentSettings();
    await renderTopupPackagesAdmin();
}

async function loadSettings() {
    if (!SupaDB.isConnected()) return;
    gameSettings = await SupaDB.getGameSettings();
    paymentSettings = await SupaDB.getPaymentSettings();
}

function startSubscriptions() {
    if (!SupaDB.isConnected()) return;
    
    // Subscribe to topup changes
    topupSubscription = SupaDB.subscribeToTopups((payload) => {
        renderTopupRequests();
        updateNotificationBadge();
        showNotificationToast('Ada permintaan top up baru!', 'info');
    });
    
    // Subscribe to password reset changes
    passwordResetSubscription = SupaDB.subscribeToPasswordResets((payload) => {
        renderPasswordResetList();
        updateNotificationBadge();
        showNotificationToast('Ada permintaan reset password baru!', 'info');
    });
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
        startSubscriptions();
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
    
    if (topupSubscription) {
        SupaDB.unsubscribe(topupSubscription);
        topupSubscription = null;
    }
    if (passwordResetSubscription) {
        SupaDB.unsubscribe(passwordResetSubscription);
        passwordResetSubscription = null;
    }
}

function goToGame() {
    window.location.href = 'index.html';
}

// ========================================
// AUTO REFRESH
// ========================================

function startAutoRefresh() {
    autoRefreshInterval = setInterval(async () => {
        await updateAdminStats();
        await renderUsersTable();
        await renderTopupRequests();
        await renderOnlinePlayers();
        await updateNotificationBadge();
        await renderPasswordResetList();
    }, 5000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
}

async function manualRefresh() {
    await updateAdminStats();
    await renderUsersTable();
    await renderTopupRequests();
    await renderOnlinePlayers();
    await updateNotificationBadge();
    await renderPasswordResetList();
    await renderAdminLogs();
    showNotificationToast('Data berhasil di-refresh!', 'success');
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
    if (section === 'vip') { renderVipStats(); renderVipUsersList(); }
    if (section === 'logs') renderAdminLogs();
    if (section === 'passwordReset') renderPasswordResetList();
    if (section === 'cards') renderAdminCards();
    if (section === 'payment') { renderPaymentSettings(); renderTopupPackagesAdmin(); }
}

function toggleAdminMenu() {
    const menu = document.getElementById('adminDropdownMenu');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('adminDropdownMenu');
    const btn = document.getElementById('adminMenuBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

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

async function updateNotificationBadge() {
    if (!SupaDB.isConnected()) return;
    
    const topups = await SupaDB.getAllTopups();
    const resets = await SupaDB.getAllPasswordResets();
    
    const pendingTopups = topups.filter(t => t.status === 'pending').length;
    const pendingResets = resets.filter(r => r.status === 'pending').length;
    const total = pendingTopups + pendingResets;
    
    const badge = document.getElementById('notifBadge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
    
    // Update password reset badge
    const resetBadge = document.getElementById('passwordResetBadge');
    if (resetBadge) {
        resetBadge.textContent = pendingResets;
        resetBadge.style.display = pendingResets > 0 ? 'inline' : 'none';
    }
}

async function showNotifications() {
    const modal = document.getElementById('notificationsModal');
    const list = document.getElementById('notificationsList');
    
    const topups = await SupaDB.getAllTopups();
    const resets = await SupaDB.getAllPasswordResets();
    
    const pendingTopups = topups.filter(t => t.status === 'pending').reverse();
    const pendingResets = resets.filter(r => r.status === 'pending').reverse();
    
    let html = '';
    
    if (pendingTopups.length > 0) {
        html += '<h4 style="margin-bottom: 10px; color: var(--primary);">Top Up Pending</h4>';
        html += pendingTopups.map(t => `
            <div class="notification-item">
                <i class="fas fa-credit-card"></i>
                <div class="notif-content">
                    <p><strong>${t.username}</strong> request top up <strong>${t.amount} ${t.type}</strong></p>
                    <span class="notif-time">${formatDate(t.time)}</span>
                </div>
            </div>
        `).join('');
    }
    
    if (pendingResets.length > 0) {
        html += '<h4 style="margin: 15px 0 10px; color: var(--warning);">Reset Password Pending</h4>';
        html += pendingResets.map(r => `
            <div class="notification-item">
                <i class="fas fa-key"></i>
                <div class="notif-content">
                    <p><strong>${r.username}</strong> request reset password</p>
                    <span class="notif-time">${formatDate(r.time)}</span>
                </div>
            </div>
        `).join('');
    }
    
    if (pendingTopups.length === 0 && pendingResets.length === 0) {
        html = '<p class="no-notif">Tidak ada notifikasi baru</p>';
    }
    
    list.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeNotifications() {
    document.getElementById('notificationsModal').classList.add('hidden');
}

function showNotificationToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// STATS & OVERVIEW
// ========================================

async function updateAdminStats() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
    const userList = Object.values(users);
    const topups = await SupaDB.getAllTopups();

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

async function renderTopPlayers() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
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

async function renderOnlinePlayers() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
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

async function renderUsersTable() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
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

async function searchUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
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

async function viewUser(username) {
    const user = await SupaDB.getUser(username);
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
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.add('hidden');
}

async function editUser(username) {
    const user = await SupaDB.getUser(username);
    if (!user) return;

    document.getElementById('editTargetUser').value = username;
    document.getElementById('editUserName').textContent = user.username;
    document.getElementById('editUserEmail').textContent = user.email || '-';
    document.getElementById('editUserCreated').textContent = user.createdAt ? formatDate(user.createdAt) : '-';
    document.getElementById('editUserLastLogin').textContent = user.lastLogin ? formatDate(user.lastLogin) : '-';
    
    document.getElementById('editUserNameInput').value = user.username;
    document.getElementById('editUserEmailInput').value = user.email || '';
    document.getElementById('editUserCoins').value = user.coins || 0;
    document.getElementById('editUserGems').value = user.gems || 0;
    document.getElementById('editUserStatus').value = user.status || 'active';
    document.getElementById('editUserReason').value = user.statusReason || '';
    document.getElementById('editUserVip').value = user.vipLevel || 0;
    document.getElementById('editUserPass').value = user.passType || 'none';
    
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

async function saveUserEdit() {
    let username = document.getElementById('editTargetUser').value;
    const user = await SupaDB.getUser(username);
    if (!user) return;

    const oldCoins = user.coins || 0;
    const oldGems = user.gems || 0;
    const oldUsername = user.username;
    const oldEmail = user.email;
    
    const newUsername = document.getElementById('editUserNameInput').value.trim();
    const newEmail = document.getElementById('editUserEmailInput').value.trim();

    if (!newUsername) {
        alert('Username tidak boleh kosong!');
        return;
    }
    
    // Update user data
    const updates = {
        coins: parseInt(document.getElementById('editUserCoins').value) || 0,
        gems: parseInt(document.getElementById('editUserGems').value) || 0,
        status: document.getElementById('editUserStatus').value,
        statusReason: document.getElementById('editUserReason').value,
        vipLevel: parseInt(document.getElementById('editUserVip').value) || 0,
        passType: document.getElementById('editUserPass').value,
        email: newEmail
    };
    
    // Handle username change
    if (newUsername !== oldUsername) {
        const success = await SupaDB.changeUsername(oldUsername, newUsername);
        if (!success) {
            alert('Username sudah digunakan oleh user lain!');
            return;
        }
        username = newUsername;
        await SupaDB.addNotification(newUsername, 'username_changed', `Username kamu diubah dari "${oldUsername}" menjadi "${newUsername}" oleh admin.`);
    }
    
    // Apply updates
    await SupaDB.updateUser(username, updates);
    
    // Add notifications for changes
    if (oldCoins !== updates.coins || oldGems !== updates.gems) {
        await SupaDB.addNotification(username, 'currency_changed', `Admin mengubah koin: ${oldCoins} → ${updates.coins}, gem: ${oldGems} → ${updates.gems}`);
    }
    
    if (newEmail !== oldEmail) {
        await SupaDB.addNotification(username, 'email_changed', `Email kamu diubah dari "${oldEmail || '-'}" menjadi "${newEmail}" oleh admin.`);
    }
    
    if (updates.status !== 'active') {
        await SupaDB.addNotification(username, 'status_changed', `Akun kamu ${updates.status === 'banned' ? 'dibanned' : 'disuspend'}. Alasan: ${updates.statusReason}`);
    }
    
    await SupaDB.addAdminLog('edit_user', username, `Coins: ${oldCoins}->${updates.coins}, Gems: ${oldGems}->${updates.gems}, Status: ${updates.status}`);
    
    closeEditUserModal();
    renderUsersTable();
    showNotificationToast('Perubahan berhasil disimpan!', 'success');
}

async function resetUserPassword() {
    const username = document.getElementById('editTargetUser').value;
    const user = await SupaDB.getUser(username);
    if (!user) return;
    
    const newPassword = prompt('Masukkan password baru:');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }
    
    await SupaDB.updateUser(username, { password: newPassword });
    await SupaDB.addNotification(username, 'password_reset', 'Password kamu telah direset oleh admin.');
    await SupaDB.addAdminLog('password_reset', username, 'Password direset oleh admin');
    
    showNotificationToast('Password berhasil direset!', 'success');
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden');
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

async function sendWarning() {
    const username = document.getElementById('warnTargetUser').value;
    const reason = document.getElementById('warnReason').value.trim();
    const severity = document.getElementById('warnSeverity').value;

    if (!reason) {
        alert('Alasan peringatan harus diisi!');
        return;
    }

    const user = await SupaDB.getUser(username);
    if (!user) return;

    const warnings = user.warnings || [];
    warnings.push({
        reason,
        severity,
        time: new Date().toISOString(),
        by: 'admin'
    });

    await SupaDB.updateUser(username, { warnings });
    await SupaDB.addNotification(username, 'warning', `PERINGATAN [${severity.toUpperCase()}]: ${reason}`);
    await SupaDB.addAdminLog('warn_user', username, `Severity: ${severity}, Reason: ${reason}`);
    
    closeWarnModal();
    showNotificationToast(`Peringatan telah dikirim ke ${username}!`, 'success');
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

async function executeBan() {
    const username = document.getElementById('banTargetUser').value;
    const reason = document.getElementById('banReason').value.trim();
    const banType = document.getElementById('banType').value;
    const duration = document.getElementById('banDuration').value;

    if (!reason) {
        alert('Alasan ban harus diisi!');
        return;
    }

    const user = await SupaDB.getUser(username);
    if (!user) return;

    const status = duration === 'permanent' ? 'banned' : 'suspended';
    const statusReason = `[${banType.toUpperCase()}] ${reason}`;

    await SupaDB.updateUser(username, {
        status,
        statusReason,
        bannedAt: new Date().toISOString(),
        banDuration: duration
    });

    await SupaDB.addNotification(username, 'banned', `Akun kamu telah ${duration === 'permanent' ? 'DIBANNED' : 'DISUSPEND'} karena ${banType}: ${reason}`);
    await SupaDB.addAdminLog('ban_user', username, `Type: ${banType}, Duration: ${duration}, Reason: ${reason}`);
    
    closeBanModal();
    renderUsersTable();
    showNotificationToast(`User ${username} telah ${duration === 'permanent' ? 'dibanned' : 'disuspend'}!`, 'success');
}

function closeBanModal() {
    document.getElementById('banUserModal').classList.add('hidden');
}

async function deleteUser(username) {
    if (!confirm(`Yakin ingin menghapus pengguna ${username}?`)) return;
    await SupaDB.deleteUser(username);
    renderUsersTable();
    updateAdminStats();
}

// ========================================
// TOP UP MANAGEMENT
// ========================================

async function renderTopupRequests() {
    if (!SupaDB.isConnected()) return;
    
    const topups = await SupaDB.getAllTopups();
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

async function refreshTopupList() {
    await renderTopupRequests();
    await updateNotificationBadge();
}

async function approveTopup(id) {
    const success = await SupaDB.approveTopup(id);
    if (success) {
        showNotificationToast('Top up berhasil disetujui!', 'success');
        renderTopupRequests();
        updateNotificationBadge();
    }
}

async function rejectTopup(id) {
    const reason = prompt('Alasan penolakan:');
    if (reason === null) return;

    const success = await SupaDB.rejectTopup(id, reason);
    if (success) {
        showNotificationToast('Top up ditolak!', 'warning');
        renderTopupRequests();
        updateNotificationBadge();
    }
}

// ========================================
// PAYMENT SETTINGS (EDIT TOPUP & BANK)
// ========================================

async function renderPaymentSettings() {
    if (!paymentSettings) return;
    
    const container = document.getElementById('paymentSettingsContent');
    if (!container) return;
    
    const methods = paymentSettings.paymentMethods || [];
    
    container.innerHTML = `
        <div class="payment-methods-list">
            <h4>Metode Pembayaran</h4>
            ${methods.map((m, i) => `
                <div class="payment-method-item">
                    <div class="method-info">
                        <span class="method-name">${m.name}</span>
                        <span class="method-number">${m.number}</span>
                        <span class="method-holder">a/n ${m.holder}</span>
                    </div>
                    <button class="btn-action-small btn-edit" onclick="editPaymentMethod(${i})"><i class="fas fa-edit"></i></button>
                    <button class="btn-action-small btn-delete" onclick="deletePaymentMethod(${i})"><i class="fas fa-trash"></i></button>
                </div>
            `).join('')}
            <button class="btn-secondary" onclick="showAddPaymentMethodModal()"><i class="fas fa-plus"></i> Tambah Metode</button>
        </div>
    `;
}

async function renderTopupPackagesAdmin() {
    if (!paymentSettings) return;
    
    const container = document.getElementById('topupPackagesAdmin');
    if (!container) return;
    
    const packages = paymentSettings.topupPackages || [];
    
    container.innerHTML = `
        <div class="topup-packages-admin">
            <h4>Paket Top Up</h4>
            ${packages.map((pkg, i) => `
                <div class="topup-package-admin-item ${pkg.popular ? 'popular' : ''} ${pkg.legendary ? 'legendary' : ''}">
                    <div class="package-admin-header">
                        <span class="package-icon">${pkg.icon}</span>
                        <span class="package-name">${pkg.name}</span>
                        ${pkg.popular ? '<span class="badge popular">POPULER</span>' : ''}
                        ${pkg.legendary ? '<span class="badge legendary">LEGENDARY</span>' : ''}
                    </div>
                    <div class="package-admin-details">
                        <p>Type: ${pkg.type}</p>
                        <p>Amount: ${pkg.amount}</p>
                        <p>Price: Rp ${pkg.price.toLocaleString()}</p>
                        <p>Benefits: ${pkg.benefits.join(', ')}</p>
                    </div>
                    <div class="package-admin-actions">
                        <button class="btn-action-small btn-edit" onclick="editTopupPackage(${i})"><i class="fas fa-edit"></i></button>
                        <button class="btn-action-small btn-delete" onclick="deleteTopupPackage(${i})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
            <button class="btn-secondary" onclick="showAddTopupPackageModal()"><i class="fas fa-plus"></i> Tambah Paket</button>
        </div>
    `;
}

// Payment Method Functions
function showAddPaymentMethodModal() {
    document.getElementById('paymentMethodModalTitle').textContent = 'Tambah Metode Pembayaran';
    document.getElementById('paymentMethodIndex').value = '';
    document.getElementById('paymentMethodName').value = '';
    document.getElementById('paymentMethodNumber').value = '';
    document.getElementById('paymentMethodHolder').value = '';
    document.getElementById('paymentMethodModal').classList.remove('hidden');
}

function editPaymentMethod(index) {
    const method = paymentSettings.paymentMethods[index];
    if (!method) return;
    
    document.getElementById('paymentMethodModalTitle').textContent = 'Edit Metode Pembayaran';
    document.getElementById('paymentMethodIndex').value = index;
    document.getElementById('paymentMethodName').value = method.name;
    document.getElementById('paymentMethodNumber').value = method.number;
    document.getElementById('paymentMethodHolder').value = method.holder;
    document.getElementById('paymentMethodModal').classList.remove('hidden');
}

async function savePaymentMethod() {
    const index = document.getElementById('paymentMethodIndex').value;
    const name = document.getElementById('paymentMethodName').value.trim();
    const number = document.getElementById('paymentMethodNumber').value.trim();
    const holder = document.getElementById('paymentMethodHolder').value.trim();
    
    if (!name || !number || !holder) {
        alert('Semua field harus diisi!');
        return;
    }
    
    const methods = paymentSettings.paymentMethods || [];
    
    if (index === '') {
        // Add new
        methods.push({ name, number, holder });
    } else {
        // Edit existing
        methods[parseInt(index)] = { name, number, holder };
    }
    
    await SupaDB.updatePaymentSettings({ paymentMethods: methods });
    paymentSettings.paymentMethods = methods;
    
    closePaymentMethodModal();
    renderPaymentSettings();
    showNotificationToast('Metode pembayaran berhasil disimpan!', 'success');
}

async function deletePaymentMethod(index) {
    if (!confirm('Yakin ingin menghapus metode pembayaran ini?')) return;
    
    const methods = paymentSettings.paymentMethods || [];
    methods.splice(index, 1);
    
    await SupaDB.updatePaymentSettings({ paymentMethods: methods });
    paymentSettings.paymentMethods = methods;
    
    renderPaymentSettings();
    showNotificationToast('Metode pembayaran berhasil dihapus!', 'success');
}

function closePaymentMethodModal() {
    document.getElementById('paymentMethodModal').classList.add('hidden');
}

// Topup Package Functions
function showAddTopupPackageModal() {
    document.getElementById('topupPackageModalTitle').textContent = 'Tambah Paket Top Up';
    document.getElementById('topupPackageIndex').value = '';
    document.getElementById('topupPackageName').value = '';
    document.getElementById('topupPackageType').value = 'coins';
    document.getElementById('topupPackageAmount').value = '';
    document.getElementById('topupPackagePrice').value = '';
    document.getElementById('topupPackageIcon').value = '🪙';
    document.getElementById('topupPackageBenefits').value = '';
    document.getElementById('topupPackagePopular').checked = false;
    document.getElementById('topupPackageLegendary').checked = false;
    document.getElementById('topupPackageModal').classList.remove('hidden');
}

function editTopupPackage(index) {
    const pkg = paymentSettings.topupPackages[index];
    if (!pkg) return;
    
    document.getElementById('topupPackageModalTitle').textContent = 'Edit Paket Top Up';
    document.getElementById('topupPackageIndex').value = index;
    document.getElementById('topupPackageName').value = pkg.name;
    document.getElementById('topupPackageType').value = pkg.type;
    document.getElementById('topupPackageAmount').value = pkg.amount;
    document.getElementById('topupPackagePrice').value = pkg.price;
    document.getElementById('topupPackageIcon').value = pkg.icon;
    document.getElementById('topupPackageBenefits').value = pkg.benefits.join('\n');
    document.getElementById('topupPackagePopular').checked = pkg.popular || false;
    document.getElementById('topupPackageLegendary').checked = pkg.legendary || false;
    document.getElementById('topupPackageModal').classList.remove('hidden');
}

async function saveTopupPackage() {
    const index = document.getElementById('topupPackageIndex').value;
    const name = document.getElementById('topupPackageName').value.trim();
    const type = document.getElementById('topupPackageType').value;
    const amount = document.getElementById('topupPackageAmount').value;
    const price = parseInt(document.getElementById('topupPackagePrice').value);
    const icon = document.getElementById('topupPackageIcon').value;
    const benefits = document.getElementById('topupPackageBenefits').value.split('\n').filter(b => b.trim());
    const popular = document.getElementById('topupPackagePopular').checked;
    const legendary = document.getElementById('topupPackageLegendary').checked;
    
    if (!name || !amount || !price) {
        alert('Nama, amount, dan price harus diisi!');
        return;
    }
    
    const packages = paymentSettings.topupPackages || [];
    const pkgId = index === '' ? `pkg_${Date.now()}` : packages[parseInt(index)].id;
    
    const newPackage = {
        id: pkgId,
        name,
        type,
        amount: type === 'package' ? amount : parseInt(amount),
        price,
        icon,
        benefits,
        popular,
        legendary
    };
    
    if (index === '') {
        packages.push(newPackage);
    } else {
        packages[parseInt(index)] = newPackage;
    }
    
    await SupaDB.updatePaymentSettings({ topupPackages: packages });
    paymentSettings.topupPackages = packages;
    
    closeTopupPackageModal();
    renderTopupPackagesAdmin();
    showNotificationToast('Paket top up berhasil disimpan!', 'success');
}

async function deleteTopupPackage(index) {
    if (!confirm('Yakin ingin menghapus paket top up ini?')) return;
    
    const packages = paymentSettings.topupPackages || [];
    packages.splice(index, 1);
    
    await SupaDB.updatePaymentSettings({ topupPackages: packages });
    paymentSettings.topupPackages = packages;
    
    renderTopupPackagesAdmin();
    showNotificationToast('Paket top up berhasil dihapus!', 'success');
}

function closeTopupPackageModal() {
    document.getElementById('topupPackageModal').classList.add('hidden');
}

// ========================================
// PASSWORD RESET MANAGEMENT (FIXED)
// ========================================

async function renderPasswordResetList() {
    if (!SupaDB.isConnected()) return;
    
    const resets = await SupaDB.getAllPasswordResets();
    const tbody = document.getElementById('passwordResetTableBody');
    if (!tbody) return;

    const filtered = resets.filter(r => r.status === currentPasswordResetFilter).reverse();

    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${formatDate(r.time)}</td>
            <td>${r.username}</td>
            <td>${r.email}</td>
            <td><span class="status-badge ${r.status}">${r.status}</span></td>
            <td>${r.newPassword || '-'}</td>
            <td>
                ${r.status === 'pending' ? `
                    <button class="btn-action-small btn-view" onclick="processPasswordReset('${r.id}')">Reset & Kirim</button>
                ` : '-'}
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align: center;">Tidak ada data</td></tr>';
}

function filterPasswordReset(status) {
    currentPasswordResetFilter = status;
    document.querySelectorAll('.password-reset-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderPasswordResetList();
}

async function refreshPasswordResetList() {
    await renderPasswordResetList();
    await updateNotificationBadge();
}

async function processPasswordReset(id) {
    const newPassword = prompt('Masukkan password baru untuk user:');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }

    const success = await SupaDB.processPasswordReset(id, newPassword);
    if (success) {
        showNotificationToast('Password berhasil direset! Copy password dan kirim ke email user.', 'success');
        renderPasswordResetList();
        updateNotificationBadge();
    }
}

// ========================================
// VIP MANAGEMENT
// ========================================

async function renderVipStats() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
    const userList = Object.values(users);

    const vipStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const passStats = { none: 0, weekly: 0, monthly: 0, seasonal: 0 };

    userList.forEach(user => {
        const vipLevel = user.vipLevel || 0;
        vipStats[vipLevel]++;

        const passType = user.passType || 'none';
        passStats[passType]++;
    });

    // Update VIP counts
    for (let i = 0; i <= 5; i++) {
        const el = document.getElementById(`vip${i}Count`);
        if (el) el.textContent = vipStats[i];
    }

    // Update Pass counts
    ['none', 'weekly', 'monthly', 'seasonal'].forEach(type => {
        const el = document.getElementById(`pass${type}Count`);
        if (el) el.textContent = passStats[type];
    });
}

async function renderVipUsersList() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
    const vipUsers = Object.values(users).filter(u => (u.vipLevel || 0) > 0);
    const container = document.getElementById('vipUsersList');
    if (!container) return;

    container.innerHTML = vipUsers.map(user => `
        <div class="vip-user-item">
            <div class="vip-user-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div class="vip-user-info">
                <span class="vip-user-name">${user.username}</span>
                <span class="vip-user-level" style="color: ${getVipColor(user.vipLevel)}">${getVipName(user.vipLevel)}</span>
            </div>
        </div>
    `).join('') || '<p class="no-data">Tidak ada user VIP</p>';
}

// ========================================
// CARD MANAGEMENT
// ========================================

let currentCardFilter = 'all';

function renderAdminCards() {
    const grid = document.getElementById('adminCardGrid');
    if (!grid) return;

    let cards = EMOJI_CARDS;
    if (currentCardFilter !== 'all') {
        cards = cards.filter(c => c.rarity === currentCardFilter);
    }

    grid.innerHTML = cards.map(card => `
        <div class="admin-card-item ${card.rarity}" onclick="editCard(${card.id})">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)}</div>
        </div>
    `).join('');
}

function filterAdminCards(rarity) {
    currentCardFilter = rarity;
    document.querySelectorAll('.rarity-filter .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderAdminCards();
}

function showAddCardModal() {
    document.getElementById('cardModalTitle').innerHTML = '<i class="fas fa-plus"></i> Tambah Kartu';
    document.getElementById('editCardId').value = '';
    document.getElementById('cardEmoji').value = '';
    document.getElementById('cardName').value = '';
    document.getElementById('cardRarity').value = 'common';
    document.getElementById('cardHp').value = 100;
    document.getElementById('cardAttack').value = 20;
    document.getElementById('cardDefense').value = 10;
    document.getElementById('cardSpeed').value = 10;
    document.getElementById('cardDesc').value = '';
    document.getElementById('cardEditModal').classList.remove('hidden');
}

function editCard(cardId) {
    const card = EMOJI_CARDS.find(c => c.id === cardId);
    if (!card) return;

    document.getElementById('cardModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Kartu';
    document.getElementById('editCardId').value = card.id;
    document.getElementById('cardEmoji').value = card.emoji;
    document.getElementById('cardName').value = card.name;
    document.getElementById('cardRarity').value = card.rarity;
    document.getElementById('cardHp').value = card.hp;
    document.getElementById('cardAttack').value = card.attack;
    document.getElementById('cardDefense').value = card.defense;
    document.getElementById('cardSpeed').value = card.speed;
    document.getElementById('cardDesc').value = card.desc;
    document.getElementById('cardEditModal').classList.remove('hidden');
}

function saveCard() {
    const cardId = document.getElementById('editCardId').value;
    const cardData = {
        emoji: document.getElementById('cardEmoji').value,
        name: document.getElementById('cardName').value,
        rarity: document.getElementById('cardRarity').value,
        hp: parseInt(document.getElementById('cardHp').value),
        attack: parseInt(document.getElementById('cardAttack').value),
        defense: parseInt(document.getElementById('cardDefense').value),
        speed: parseInt(document.getElementById('cardSpeed').value),
        desc: document.getElementById('cardDesc').value
    };

    if (!cardData.emoji || !cardData.name) {
        alert('Emoji dan nama kartu harus diisi!');
        return;
    }

    if (cardId) {
        // Edit existing card
        const card = EMOJI_CARDS.find(c => c.id === parseInt(cardId));
        if (card) {
            Object.assign(card, cardData);
        }
    } else {
        // Add new card
        const newId = Math.max(...EMOJI_CARDS.map(c => c.id)) + 1;
        EMOJI_CARDS.push({ id: newId, ...cardData });
    }

    closeCardEditModal();
    renderAdminCards();
    showNotificationToast('Kartu berhasil disimpan!', 'success');
}

function closeCardEditModal() {
    document.getElementById('cardEditModal').classList.add('hidden');
}

// ========================================
// CHAT MODERATION
// ========================================

async function renderChatHistory() {
    if (!SupaDB.isConnected()) return;
    
    const container = document.getElementById('chatHistory');
    if (!container) return;

    const messages = await SupaDB.getChatMessages(100);

    container.innerHTML = messages.map(msg => `
        <div class="chat-message-admin">
            <span class="chat-time">${formatDate(msg.time)}</span>
            <span class="chat-username">${msg.username}</span>
            <span class="chat-text">${escapeHtml(msg.message)}</span>
            <button class="btn-delete-small" onclick="deleteChatMessage('${msg.id}')">Hapus</button>
        </div>
    `).join('') || '<p class="no-data">Tidak ada pesan chat</p>';
}

async function deleteChatMessage(messageId) {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;
    await SupaDB.deleteChatMessage(messageId);
    renderChatHistory();
    showNotificationToast('Pesan berhasil dihapus!', 'success');
}

async function clearAllChat() {
    if (!confirm('Yakin ingin menghapus SEMUA pesan chat?')) return;
    await SupaDB.clearAllChat();
    renderChatHistory();
    showNotificationToast('Semua chat berhasil dihapus!', 'success');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// ADMIN LOGS
// ========================================

async function renderAdminLogs() {
    if (!SupaDB.isConnected()) return;
    
    const container = document.getElementById('adminLogsList');
    if (!container) return;

    const logs = await SupaDB.getAdminLogs(20);

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
// SETTINGS
// ========================================

async function saveGachaRates() {
    const settings = {
        gachaRates: {
            normal: {
                common: parseInt(document.getElementById('commonRate').value),
                uncommon: parseInt(document.getElementById('uncommonRate').value),
                rare: parseInt(document.getElementById('rareRate').value),
                epic: parseInt(document.getElementById('epicRate').value),
                legendary: parseInt(document.getElementById('legendaryRate').value)
            }
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Gacha rates berhasil disimpan!', 'success');
}

async function saveStartingResources() {
    const settings = {
        startingResources: {
            coins: parseInt(document.getElementById('startingCoins').value),
            gems: parseInt(document.getElementById('startingGems').value)
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Starting resources berhasil disimpan!', 'success');
}

async function saveBattleSettings() {
    const settings = {
        battleRewards: {
            winCoins: parseInt(document.getElementById('winCoins').value),
            winExp: parseInt(document.getElementById('winExp').value),
            loseCoins: parseInt(document.getElementById('loseCoins').value)
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Battle settings berhasil disimpan!', 'success');
}

async function saveShopPrices() {
    const settings = {
        shopPrices: {
            coins500: parseInt(document.getElementById('shopCoins500').value),
            coins1000: parseInt(document.getElementById('shopCoins1000').value),
            gems100: parseInt(document.getElementById('shopGems100').value)
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Shop prices berhasil disimpan!', 'success');
}

async function saveTopupPrices() {
    const settings = {
        topupPrices: {
            coins1000: parseInt(document.getElementById('topupCoins1000').value),
            coins5000: parseInt(document.getElementById('topupCoins5000').value),
            gems100: parseInt(document.getElementById('topupGems100').value),
            gems500: parseInt(document.getElementById('topupGems500').value),
            sultan: parseInt(document.getElementById('topupSultan').value)
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Top up prices berhasil disimpan!', 'success');
}

async function saveRewardSettings() {
    const settings = {
        starterPack: {
            coins: parseInt(document.getElementById('starterCoins').value),
            gems: parseInt(document.getElementById('starterGems').value)
        },
        battleRewards: {
            winCoins: parseInt(document.getElementById('battleWinCoins').value),
            winExp: parseInt(document.getElementById('battleWinExp').value),
            loseCoins: parseInt(document.getElementById('battleLoseCoins').value)
        }
    };
    await SupaDB.updateGameSettings(settings);
    showNotificationToast('Reward settings berhasil disimpan!', 'success');
}

// ========================================
// BACKUP & RESET
// ========================================

async function backupData() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
    const topups = await SupaDB.getAllTopups();
    const resets = await SupaDB.getAllPasswordResets();
    const logs = await SupaDB.getAdminLogs(1000);
    const settings = await SupaDB.getGameSettings();
    const payment = await SupaDB.getPaymentSettings();
    
    const data = {
        users,
        topups,
        passwordResets: resets,
        adminLogs: logs,
        gameSettings: settings,
        paymentSettings: payment,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamegacha-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotificationToast('Backup berhasil di-download!', 'success');
}

function resetAllData() {
    alert('Fitur reset data dinonaktifkan untuk keamanan. Hubungi developer.');
}

function clearAllUsers() {
    alert('Fitur hapus semua user dinonaktifkan untuk keamanan. Hubungi developer.');
}

// ========================================
// CSS ANIMATIONS
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
