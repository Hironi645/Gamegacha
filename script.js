/**
 * EMOJI BATTLE GACHA - Game Logic (FIXED VERSION)
 * Professional Gacha Game with Emoji Cards
 * Version 3.0 - Real-time Sync, Bug Fixes
 */

// ========================================
// GAME DATA
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

const GACHA_RATES = {
    normal: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
    premium: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
    legendary: { common: 5, uncommon: 15, rare: 35, epic: 30, legendary: 15 }
};

const ENEMIES = [
    { name: 'Goblin', emoji: '👺', hp: 80, attack: 18, defense: 8 },
    { name: 'Orc', emoji: '👹', hp: 120, attack: 25, defense: 15 },
    { name: 'Troll', emoji: '🧟', hp: 150, attack: 22, defense: 20 },
    { name: 'Dark Knight', emoji: '💀', hp: 130, attack: 30, defense: 18 },
    { name: 'Demon', emoji: '👿', hp: 160, attack: 35, defense: 22 },
    { name: 'Dark Wizard', emoji: '🧙‍♂️', hp: 100, attack: 40, defense: 10 }
];

// ========================================
// STATE MANAGEMENT
// ========================================

let currentUser = null;
let selectedBattleCard = null;
let battleState = null;
let pvpState = null;
let pendingTopup = null;
let chatInterval = null;
let notifInterval = null;
let realtimeSyncInterval = null;

// ========================================
// REAL-TIME SYNC SYSTEM
// ========================================

// BroadcastChannel untuk sinkronisasi real-time antar tab
let syncChannel = null;

try {
    syncChannel = new BroadcastChannel('emoji_battle_gacha_sync');
    syncChannel.onmessage = (event) => {
        const { type, data } = event.data;
        handleSyncMessage(type, data);
    };
} catch (e) {
    console.log('BroadcastChannel not supported, using fallback');
}

function handleSyncMessage(type, data) {
    switch (type) {
        case 'user_updated':
            if (currentUser && data.username === currentUser.username) {
                // Update current user data from storage
                const users = getFromStorage('users', {});
                if (users[currentUser.username]) {
                    currentUser = users[currentUser.username];
                    updateUserUI();
                    updateDashboard();
                    updateProfileUI();
                }
            }
            break;
        case 'chat_updated':
            renderChatMessages();
            break;
        case 'notification':
            if (currentUser && data.target === currentUser.username) {
                showNotificationToast(data.message, data.notifType);
                updateNotificationBadge();
            }
            break;
        case 'force_refresh':
            if (currentUser) {
                refreshGame();
            }
            break;
        case 'settings_updated':
            // Refresh shop/topup prices when admin updates settings
            if (data.type === 'shopPrices') {
                renderShop();
                showNotificationToast('Harga toko telah diperbarui!', 'info');
            } else if (data.type === 'topupPrices') {
                renderTopupPackages();
                showNotificationToast('Harga top up telah diperbarui!', 'info');
            } else if (data.type === 'rewardSettings') {
                showNotificationToast('Hadiah telah diperbarui!', 'info');
            }
            break;
        case 'password_reset_requested':
            // Show notification to admin (if on admin page)
            if (window.location.pathname.includes('admin')) {
                showNotificationToast(`Permintaan reset password baru dari ${data.username}`, 'warning');
            }
            break;
    }
}

function broadcastSync(type, data = {}) {
    if (syncChannel) {
        syncChannel.postMessage({ type, data, timestamp: Date.now() });
    }
    // Also dispatch storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'sync_event',
        newValue: JSON.stringify({ type, data })
    }));
}

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
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error reading from storage:', e);
        return defaultValue;
    }
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

// ========================================
// INITIALIZATION
// ========================================

function initStorage() {
    if (!getFromStorage('users')) saveToStorage('users', {});
    if (!getFromStorage('topupRequests')) saveToStorage('topupRequests', []);
    if (!getFromStorage('globalChat')) saveToStorage('globalChat', []);
    if (!getFromStorage('pvpQueue')) saveToStorage('pvpQueue', null);
}

window.addEventListener('load', function() {
    initStorage();
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        const users = getFromStorage('users', {});
        if (users[savedUser]) {
            currentUser = users[savedUser];
            if (checkUserStatus()) {
                showGameInterface();
                startChatRefresh();
                startNotificationCheck();
                startRealtimeSync();
            }
        }
    }
});

function checkUserStatus() {
    const status = currentUser.status || 'active';
    if (status !== 'active') {
        document.getElementById('gameInterface').classList.add('hidden');
        document.getElementById('suspendedModal').classList.remove('hidden');
        document.getElementById('suspendedReason').textContent = 
            status === 'banned' 
                ? `Akun kamu telah dibanned. Alasan: ${currentUser.statusReason || 'Melanggar aturan'}`
                : `Akun kamu telah disuspend. Alasan: ${currentUser.statusReason || 'Pelanggaran ringan'}`;
        return false;
    }
    return true;
}

// ========================================
// REAL-TIME SYNC
// ========================================

function startRealtimeSync() {
    // Sync setiap 2 detik untuk memastikan data terbaru
    realtimeSyncInterval = setInterval(() => {
        if (currentUser) {
            syncUserData();
        }
    }, 2000);
}

function stopRealtimeSync() {
    if (realtimeSyncInterval) {
        clearInterval(realtimeSyncInterval);
    }
}

function syncUserData() {
    if (!currentUser) return;
    
    const users = getFromStorage('users', {});
    const updatedUser = users[currentUser.username];
    
    if (updatedUser) {
        // Check for changes
        const oldCoins = currentUser.coins;
        const oldGems = currentUser.gems;
        const oldNotifs = (currentUser.notifications || []).length;
        
        currentUser = updatedUser;
        
        // Update UI if data changed
        if (oldCoins !== updatedUser.coins || oldGems !== updatedUser.gems) {
            updateUserUI();
            updateProfileUI();
        }
        
        // Check for new notifications
        const newNotifs = (updatedUser.notifications || []).length;
        if (newNotifs > oldNotifs) {
            updateNotificationBadge();
        }
    }
}

// ========================================
// USER MANAGEMENT
// ========================================

function register() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('regError');
    const successEl = document.getElementById('regSuccess');
    
    errorEl.textContent = '';
    successEl.textContent = '';
    
    if (!username || !email || !password) {
        errorEl.textContent = 'Semua field harus diisi!';
        return;
    }
    if (username.length < 3) {
        errorEl.textContent = 'Username minimal 3 karakter!';
        return;
    }
    if (password.length < 6) {
        errorEl.textContent = 'Password minimal 6 karakter!';
        return;
    }
    
    const users = getFromStorage('users', {});
    if (users[username]) {
        errorEl.textContent = 'Username sudah terdaftar!';
        return;
    }
    for (const user of Object.values(users)) {
        if (user.email === email) {
            errorEl.textContent = 'Email sudah terdaftar!';
            return;
        }
    }
    
    users[username] = {
        username, email, password,
        coins: 1000, gems: 100, cards: [],
        wins: 0, losses: 0, winStreak: 0,
        pvpWins: 0, pvpPoints: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        starterPackClaimed: false,
        activities: [], notifications: [],
        status: 'active', statusReason: '',
        vipLevel: 0, passType: 'none'
    };
    
    saveToStorage('users', users);
    broadcastSync('user_updated', { username });
    successEl.textContent = 'Registrasi berhasil! Silakan login.';
    document.getElementById('regUsername').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    setTimeout(() => switchTab('login'), 1500);
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    errorEl.textContent = '';
    
    if (!username || !password) {
        errorEl.textContent = 'Username dan password harus diisi!';
        return;
    }
    
    const users = getFromStorage('users', {});
    const user = users[username];
    
    if (!user || user.password !== password) {
        errorEl.textContent = 'Username atau password salah!';
        return;
    }
    
    user.lastLogin = new Date().toISOString();
    users[username] = user;
    saveToStorage('users', users);
    
    currentUser = user;
    sessionStorage.setItem('currentUser', username);
    
    if (checkUserStatus()) {
        showGameInterface();
        startChatRefresh();
        startNotificationCheck();
        startRealtimeSync();
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    stopChatRefresh();
    stopNotificationCheck();
    stopRealtimeSync();
    document.getElementById('gameInterface').classList.add('hidden');
    document.getElementById('suspendedModal').classList.add('hidden');
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
}

// ========================================
// FORGOT PASSWORD SYSTEM
// ========================================

function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
    document.getElementById('forgotUsername').value = '';
    document.getElementById('forgotEmail').value = '';
    document.getElementById('forgotPasswordInfo').textContent = '';
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
}

function submitForgotPassword() {
    const username = document.getElementById('forgotUsername').value.trim();
    const email = document.getElementById('forgotEmail').value.trim();
    const infoEl = document.getElementById('forgotPasswordInfo');
    
    if (!username || !email) {
        infoEl.textContent = 'Username dan email harus diisi!';
        infoEl.style.color = '#ef4444';
        return;
    }
    
    const users = getFromStorage('users', {});
    const user = users[username];
    
    if (!user) {
        infoEl.textContent = 'Username tidak ditemukan!';
        infoEl.style.color = '#ef4444';
        return;
    }
    
    if (user.email !== email) {
        infoEl.textContent = 'Email tidak cocok dengan username!';
        infoEl.style.color = '#ef4444';
        return;
    }
    
    // Create password reset request
    const resetRequests = getFromStorage('passwordResetRequests', []);
    
    // Check if already has pending request
    const existingRequest = resetRequests.find(r => r.username === username && r.status === 'pending');
    if (existingRequest) {
        infoEl.textContent = 'Kamu sudah memiliki permintaan reset password yang pending. Tunggu admin memproses.';
        infoEl.style.color = '#f59e0b';
        return;
    }
    
    const request = {
        id: generateId(),
        username: username,
        email: email,
        status: 'pending',
        time: new Date().toISOString(),
        processedAt: null,
        newPassword: null
    };
    
    resetRequests.push(request);
    saveToStorage('passwordResetRequests', resetRequests);
    
    // Broadcast to admin
    broadcastSync('password_reset_requested', { username, email });
    
    infoEl.textContent = 'Permintaan reset password berhasil dikirim! Admin akan memproses dan mengirim password baru ke email kamu.';
    infoEl.style.color = '#22c55e';
    
    // Clear inputs after 3 seconds
    setTimeout(() => {
        document.getElementById('forgotUsername').value = '';
        document.getElementById('forgotEmail').value = '';
    }, 3000);
}

function showGameInterface() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('gameInterface').classList.remove('hidden');
    updateUserUI();
    updateDashboard();
    updateProfileUI();
    renderCollection();
    renderBattleCards();
    renderOnlinePlayers();
    renderTopupHistory();
}

function updateUserUI() {
    if (!currentUser) return;
    document.getElementById('welcomeUser').textContent = currentUser.username;
    document.getElementById('heroUsername').textContent = currentUser.username;
    document.getElementById('userCoins').textContent = currentUser.coins.toLocaleString();
    document.getElementById('userGems').textContent = currentUser.gems.toLocaleString();
}

function updateDashboard() {
    if (!currentUser) return;
    document.getElementById('totalCards').textContent = currentUser.cards.length;
    document.getElementById('totalWins').textContent = currentUser.wins;
    document.getElementById('winStreak').textContent = currentUser.winStreak;
    renderActivities();
}

function renderActivities() {
    const activityList = document.getElementById('activityList');
    if (!currentUser.activities || currentUser.activities.length === 0) {
        activityList.innerHTML = '<p class="no-activity">Belum ada aktivitas</p>';
        return;
    }
    const recentActivities = currentUser.activities.slice(-5).reverse();
    activityList.innerHTML = recentActivities.map(act => `
        <div class="activity-item">
            <i class="fas ${act.icon}"></i>
            <div class="activity-info">
                <span class="activity-user">${act.message}</span>
                <span class="activity-time">${formatDate(act.time)}</span>
            </div>
        </div>
    `).join('');
}

function addActivity(message, icon = 'fa-info-circle') {
    if (!currentUser) return;
    if (!currentUser.activities) currentUser.activities = [];
    currentUser.activities.push({ message, icon, time: new Date().toISOString() });
    if (currentUser.activities.length > 20) currentUser.activities = currentUser.activities.slice(-20);
    saveCurrentUser();
}

function saveCurrentUser() {
    if (!currentUser) return;
    const users = getFromStorage('users', {});
    users[currentUser.username] = currentUser;
    saveToStorage('users', users);
    broadcastSync('user_updated', { username: currentUser.username });
    updateUserUI();
}

// ========================================
// GACHA SYSTEM
// ========================================

function doGacha(type) {
    if (!currentUser) return;
    const costs = { normal: { coins: 100 }, premium: { gems: 50 }, legendary: { gems: 150 } };
    const cost = costs[type];
    
    if (cost.coins && currentUser.coins < cost.coins) { alert('Koin tidak cukup!'); return; }
    if (cost.gems && currentUser.gems < cost.gems) { alert('Gem tidak cukup!'); return; }
    
    if (cost.coins) currentUser.coins -= cost.coins;
    if (cost.gems) currentUser.gems -= cost.gems;
    
    const rates = GACHA_RATES[type];
    const roll = Math.random() * 100;
    let cumulative = 0, selectedRarity = 'common';
    
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (roll <= cumulative) { selectedRarity = rarity; break; }
    }
    
    const cardsOfRarity = EMOJI_CARDS.filter(c => c.rarity === selectedRarity);
    const selectedCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    
    const cardInstance = { ...selectedCard, instanceId: generateId(), acquiredAt: new Date().toISOString(), level: 1, exp: 0 };
    currentUser.cards.push(cardInstance);
    
    addActivity(`Mendapatkan ${selectedCard.name} (${selectedRarity}) dari gacha!`, 'fa-dice');
    saveCurrentUser();
    updateDashboard();
    showGachaResult(cardInstance);
}

function showGachaResult(card) {
    const modal = document.getElementById('gachaModal');
    const content = document.getElementById('gachaRevealContent');
    content.innerHTML = `
        <div class="gacha-reveal-content">
            <div class="reveal-emoji">${card.emoji}</div>
            <div class="reveal-name">${card.name}</div>
            <div class="reveal-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)} ${card.rarity.toUpperCase()}</div>
            <button class="btn-primary" onclick="closeGachaModal()" style="margin-top: 1.5rem;"><i class="fas fa-check"></i> Keren!</button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeGachaModal() {
    document.getElementById('gachaModal').classList.add('hidden');
}

// ========================================
// COLLECTION SYSTEM
// ========================================

let currentFilter = 'all';

function renderCollection() {
    if (!currentUser) return;
    const grid = document.getElementById('cardCollection');
    const emptyState = document.getElementById('emptyCollection');
    let cards = currentUser.cards;
    if (currentFilter !== 'all') cards = cards.filter(c => c.rarity === currentFilter);
    
    if (cards.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');
    grid.innerHTML = cards.map(card => `
        <div class="emoji-card ${card.rarity}" onclick="showCardDetail('${card.instanceId}')">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)}</div>
            <div class="card-stats-mini">
                <span><i class="fas fa-heart"></i> ${card.hp}</span>
                <span><i class="fas fa-fist-raised"></i> ${card.attack}</span>
            </div>
        </div>
    `).join('');
}

function filterCards(rarity) {
    currentFilter = rarity;
    document.querySelectorAll('.collection-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCollection();
}

function showCardDetail(instanceId) {
    const card = currentUser.cards.find(c => c.instanceId === instanceId);
    if (!card) return;
    const modal = document.getElementById('cardModal');
    const content = document.getElementById('cardDetailContent');
    content.innerHTML = `
        <div class="card-detail-content">
            <div class="card-detail-emoji">${card.emoji}</div>
            <div class="card-detail-name">${card.name}</div>
            <div class="card-detail-rarity" style="background: ${getRarityColor(card.rarity)}20; color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)} ${card.rarity.toUpperCase()}</div>
            <div class="card-detail-stats">
                <div class="detail-stat"><i class="fas fa-heart" style="color: #ef4444;"></i><div class="detail-stat-value">${card.hp}</div></div>
                <div class="detail-stat"><i class="fas fa-fist-raised" style="color: #f59e0b;"></i><div class="detail-stat-value">${card.attack}</div></div>
                <div class="detail-stat"><i class="fas fa-shield-alt" style="color: #3b82f6;"></i><div class="detail-stat-value">${card.defense}</div></div>
                <div class="detail-stat"><i class="fas fa-bolt" style="color: #10b981;"></i><div class="detail-stat-value">${card.speed}</div></div>
            </div>
            <p class="card-detail-desc">${card.desc}</p>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Level: ${card.level} | EXP: ${card.exp}</p>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeCardModal() {
    document.getElementById('cardModal').classList.add('hidden');
}

// ========================================
// BATTLE SYSTEM (vs Bot)
// ========================================

function renderBattleCards() {
    if (!currentUser) return;
    const container = document.getElementById('battleCardSelection');
    if (currentUser.cards.length === 0) {
        container.innerHTML = '<p class="no-cards">Kamu belum memiliki kartu. Gacha dulu!</p>';
        return;
    }
    container.innerHTML = currentUser.cards.map(card => `
        <div class="battle-select-card ${selectedBattleCard?.instanceId === card.instanceId ? 'selected' : ''}" onclick="selectBattleCard('${card.instanceId}')">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${getRarityStars(card.rarity)}</div>
        </div>
    `).join('');
}

function selectBattleCard(instanceId) {
    selectedBattleCard = currentUser.cards.find(c => c.instanceId === instanceId);
    renderBattleCards();
    document.getElementById('startBattleBtn').disabled = false;
}

function startBattle(mode) {
    if (!selectedBattleCard) return;
    document.getElementById('battleSetup').classList.add('hidden');
    document.getElementById('battleArena').classList.remove('hidden');
    
    const enemyTemplate = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    battleState = {
        player: { ...selectedBattleCard, currentHp: selectedBattleCard.hp, maxHp: selectedBattleCard.hp },
        enemy: { ...enemyTemplate, currentHp: enemyTemplate.hp, maxHp: enemyTemplate.hp },
        turn: 1, playerDefending: false, enemyDefending: false, specialCooldown: 0
    };
    updateBattleUI();
    addBattleLog('Pertarungan dimulai!');
}

function updateBattleUI() {
    if (!battleState) return;
    const { player, enemy } = battleState;
    document.getElementById('playerName').textContent = currentUser.username;
    document.getElementById('playerEmoji').textContent = player.emoji;
    document.getElementById('playerHp').textContent = `${Math.max(0, player.currentHp)}/${player.maxHp}`;
    document.getElementById('playerHpBar').style.width = `${(player.currentHp / player.maxHp) * 100}%`;
    document.getElementById('enemyName').textContent = enemy.name;
    document.getElementById('enemyEmoji').textContent = enemy.emoji;
    document.getElementById('enemyHp').textContent = `${Math.max(0, enemy.currentHp)}/${enemy.maxHp}`;
    document.getElementById('enemyHpBar').style.width = `${(enemy.currentHp / enemy.maxHp) * 100}%`;
    
    const specialBtn = document.querySelector('#battleArena .btn-action.special');
    if (specialBtn) {
        if (battleState.specialCooldown > 0) { specialBtn.disabled = true; specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial (${battleState.specialCooldown})`; }
        else { specialBtn.disabled = false; specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial`; }
    }
}

function addBattleLog(message, type = '') {
    const log = document.getElementById('battleLog');
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[Turn ${battleState?.turn || 1}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function battleAction(action) {
    if (!battleState) return;
    const { player, enemy } = battleState;
    let playerDamage = 0, enemyDamage = 0;
    
    switch (action) {
        case 'attack':
            playerDamage = Math.max(1, player.attack - (battleState.enemyDefending ? enemy.defense * 2 : enemy.defense));
            enemy.currentHp -= playerDamage;
            addBattleLog(`${player.name} menyerang ${enemy.name} sebesar ${playerDamage} damage!`, 'damage');
            animateFighter('playerEmoji', 'attacking');
            setTimeout(() => animateFighter('enemyEmoji', 'hit'), 250);
            break;
        case 'defend':
            battleState.playerDefending = true;
            addBattleLog(`${player.name} bertahan! Defense meningkat!`, 'heal');
            animateFighter('playerEmoji', 'defending');
            break;
        case 'special':
            playerDamage = Math.floor(player.attack * 1.5);
            enemy.currentHp -= playerDamage;
            battleState.specialCooldown = 3;
            addBattleLog(`${player.name} menggunakan serangan SPESIAL! ${playerDamage} damage!`, 'special');
            animateFighter('playerEmoji', 'attacking');
            setTimeout(() => animateFighter('enemyEmoji', 'hit'), 250);
            break;
    }
    
    if (enemy.currentHp <= 0) { endBattle(true); return; }
    
    setTimeout(() => {
        const enemyAction = getEnemyAction();
        switch (enemyAction) {
            case 'attack':
                enemyDamage = Math.max(1, enemy.attack - (battleState.playerDefending ? player.defense * 2 : player.defense));
                player.currentHp -= enemyDamage;
                addBattleLog(`${enemy.name} menyerang ${player.name} sebesar ${enemyDamage} damage!`, 'damage');
                animateFighter('enemyEmoji', 'attacking');
                setTimeout(() => animateFighter('playerEmoji', 'hit'), 250);
                break;
            case 'defend':
                battleState.enemyDefending = true;
                addBattleLog(`${enemy.name} bertahan!`, 'heal');
                animateFighter('enemyEmoji', 'defending');
                break;
            case 'special':
                enemyDamage = Math.floor(enemy.attack * 1.3);
                player.currentHp -= enemyDamage;
                addBattleLog(`${enemy.name} menggunakan serangan spesial! ${enemyDamage} damage!`, 'special');
                animateFighter('enemyEmoji', 'attacking');
                setTimeout(() => animateFighter('playerEmoji', 'hit'), 250);
                break;
        }
        if (player.currentHp <= 0) { endBattle(false); return; }
        battleState.playerDefending = false;
        battleState.enemyDefending = false;
        if (battleState.specialCooldown > 0) battleState.specialCooldown--;
        battleState.turn++;
        updateBattleUI();
    }, 1000);
    updateBattleUI();
}

function getEnemyAction() {
    const rand = Math.random();
    if (rand < 0.6) return 'attack';
    if (rand < 0.8) return 'defend';
    return 'special';
}

function animateFighter(elementId, animation) {
    const element = document.getElementById(elementId);
    element.classList.add(animation);
    setTimeout(() => element.classList.remove(animation), 500);
}

function endBattle(playerWon) {
    const resultSection = document.getElementById('battleResult');
    document.getElementById('battleArena').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // Load reward settings from storage
    const rewardSettings = getFromStorage('rewardSettings', { 
        battleWinCoins: 50, battleWinExp: 20, battleLoseCoins: 10 
    });
    
    if (playerWon) {
        document.getElementById('resultEmoji').textContent = '🏆';
        document.getElementById('resultTitle').textContent = 'Kemenangan!';
        document.getElementById('resultTitle').style.color = '#10b981';
        document.getElementById('resultMessage').textContent = `${battleState.player.name} mengalahkan ${battleState.enemy.name}!`;
        const coins = rewardSettings.battleWinCoins + Math.floor(Math.random() * 30);
        const exp = rewardSettings.battleWinExp + Math.floor(Math.random() * 15);
        document.getElementById('rewardCoins').textContent = coins;
        document.getElementById('rewardExp').textContent = exp;
        currentUser.coins += coins;
        currentUser.wins++;
        currentUser.winStreak++;
        const card = currentUser.cards.find(c => c.instanceId === selectedBattleCard.instanceId);
        if (card) {
            card.exp += exp;
            if (card.exp >= card.level * 50) {
                card.level++; card.exp = 0; card.hp += 5; card.attack += 2;
                addActivity(`${card.name} naik ke level ${card.level}!`, 'fa-level-up-alt');
            }
        }
        addActivity(`Menang melawan ${battleState.enemy.name} di arena!`, 'fa-trophy');
    } else {
        document.getElementById('resultEmoji').textContent = '💀';
        document.getElementById('resultTitle').textContent = 'Kekalahan...';
        document.getElementById('resultTitle').style.color = '#ef4444';
        document.getElementById('resultMessage').textContent = `${battleState.player.name} dikalahkan...`;
        const coins = rewardSettings.battleLoseCoins;
        document.getElementById('rewardCoins').textContent = coins;
        document.getElementById('rewardExp').textContent = '5';
        currentUser.coins += coins;
        currentUser.losses++;
        currentUser.winStreak = 0;
        addActivity(`Kalah melawan ${battleState.enemy.name}...`, 'fa-skull');
    }
    saveCurrentUser();
    updateDashboard();
}

function resetBattle() {
    document.getElementById('battleResult').classList.add('hidden');
    document.getElementById('battleSetup').classList.remove('hidden');
    document.getElementById('battleLog').innerHTML = '<p class="log-entry">Pertarungan dimulai!</p>';
    document.getElementById('startBattleBtn').disabled = true;
    selectedBattleCard = null;
    battleState = null;
    renderBattleCards();
}

// ========================================
// PVP SYSTEM
// ========================================

function renderOnlinePlayers() {
    const users = getFromStorage('users', {});
    const onlineList = document.getElementById('onlinePlayersList');
    const otherUsers = Object.values(users).filter(u => u.username !== currentUser?.username && (u.status === 'active' || !u.status));
    
    if (otherUsers.length === 0) {
        onlineList.innerHTML = '<p class="no-players">Tidak ada pemain online</p>';
        return;
    }
    onlineList.innerHTML = otherUsers.map(u => `
        <div class="online-player-item">
            <div class="player-avatar">${u.username.charAt(0).toUpperCase()}</div>
            <div class="player-info">
                <span class="player-name">${u.username}</span>
                <span class="player-stats">${u.pvpWins || 0} menang PvP</span>
            </div>
            <button class="btn-challenge" onclick="challengePlayer('${u.username}')">Tantang</button>
        </div>
    `).join('');
    
    document.getElementById('pvpWins').textContent = currentUser?.pvpWins || 0;
    document.getElementById('pvpPoints').textContent = currentUser?.pvpPoints || 0;
    
    const allUsers = Object.values(users).filter(u => u.status === 'active' || !u.status).sort((a, b) => (b.pvpPoints || 0) - (a.pvpPoints || 0));
    const rank = allUsers.findIndex(u => u.username === currentUser?.username) + 1;
    document.getElementById('pvpRank').textContent = rank > 0 ? '#' + rank : '-';
}

function challengePlayer(username) {
    if (!currentUser || currentUser.cards.length === 0) {
        alert('Kamu harus memiliki minimal 1 kartu untuk bertarung!');
        return;
    }
    const users = getFromStorage('users', {});
    const opponent = users[username];
    if (!opponent) return;
    
    const opponentCard = opponent.cards[Math.floor(Math.random() * opponent.cards.length)];
    if (!opponentCard) {
        alert('Lawan tidak memiliki kartu!');
        return;
    }
    
    const myCard = currentUser.cards[0];
    startPvPBattle(myCard, opponentCard, username);
}

function findMatch() {
    if (!currentUser || currentUser.cards.length === 0) {
        alert('Kamu harus memiliki minimal 1 kartu untuk bertarung!');
        return;
    }
    const users = getFromStorage('users', {});
    const opponents = Object.values(users).filter(u => u.username !== currentUser.username && u.cards.length > 0 && (u.status === 'active' || !u.status));
    if (opponents.length === 0) {
        alert('Tidak ada lawan yang tersedia. Coba lagi nanti!');
        return;
    }
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    const opponentCard = opponent.cards[Math.floor(Math.random() * opponent.cards.length)];
    const myCard = currentUser.cards[Math.floor(Math.random() * currentUser.cards.length)];
    startPvPBattle(myCard, opponentCard, opponent.username);
}

function startPvPBattle(myCard, opponentCard, opponentName) {
    document.getElementById('pvpLobby').classList.add('hidden');
    document.getElementById('pvpBattle').classList.remove('hidden');
    
    pvpState = {
        player: { ...myCard, currentHp: myCard.hp, maxHp: myCard.hp },
        enemy: { ...opponentCard, currentHp: opponentCard.hp, maxHp: opponentCard.hp, owner: opponentName },
        turn: 1, playerDefending: false, enemyDefending: false, specialCooldown: 0
    };
    
    document.getElementById('pvpPlayerName').textContent = currentUser.username;
    document.getElementById('pvpPlayerEmoji').textContent = myCard.emoji;
    document.getElementById('pvpEnemyName').textContent = opponentName;
    document.getElementById('pvpEnemyEmoji').textContent = opponentCard.emoji;
    updatePvPUI();
    addPvPLog('Pertarungan PvP dimulai!');
}

function updatePvPUI() {
    if (!pvpState) return;
    const { player, enemy } = pvpState;
    document.getElementById('pvpPlayerHp').textContent = `${Math.max(0, player.currentHp)}/${player.maxHp}`;
    document.getElementById('pvpPlayerHpBar').style.width = `${(player.currentHp / player.maxHp) * 100}%`;
    document.getElementById('pvpEnemyHp').textContent = `${Math.max(0, enemy.currentHp)}/${enemy.maxHp}`;
    document.getElementById('pvpEnemyHpBar').style.width = `${(enemy.currentHp / enemy.maxHp) * 100}%`;
    
    const specialBtn = document.querySelector('#pvpBattle .btn-action.special');
    if (specialBtn) {
        if (pvpState.specialCooldown > 0) { specialBtn.disabled = true; specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial (${pvpState.specialCooldown})`; }
        else { specialBtn.disabled = false; specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial`; }
    }
}

function addPvPLog(message, type = '') {
    const log = document.getElementById('pvpBattleLog');
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[Turn ${pvpState?.turn || 1}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function pvpAction(action) {
    if (!pvpState) return;
    const { player, enemy } = pvpState;
    let playerDamage = 0, enemyDamage = 0;
    
    switch (action) {
        case 'attack':
            playerDamage = Math.max(1, player.attack - (pvpState.enemyDefending ? enemy.defense * 2 : enemy.defense));
            enemy.currentHp -= playerDamage;
            addPvPLog(`${player.name} menyerang sebesar ${playerDamage} damage!`, 'damage');
            break;
        case 'defend':
            pvpState.playerDefending = true;
            addPvPLog(`${player.name} bertahan! Defense meningkat!`, 'heal');
            break;
        case 'special':
            playerDamage = Math.floor(player.attack * 1.5);
            enemy.currentHp -= playerDamage;
            pvpState.specialCooldown = 3;
            addPvPLog(`${player.name} menggunakan serangan SPESIAL! ${playerDamage} damage!`, 'special');
            break;
    }
    
    if (enemy.currentHp <= 0) { endPvP(true); return; }
    
    setTimeout(() => {
        const enemyActions = ['attack', 'attack', 'attack', 'defend', 'special'];
        const enemyAction = enemyActions[Math.floor(Math.random() * enemyActions.length)];
        
        switch (enemyAction) {
            case 'attack':
                enemyDamage = Math.max(1, enemy.attack - (pvpState.playerDefending ? player.defense * 2 : player.defense));
                player.currentHp -= enemyDamage;
                addPvPLog(`${enemy.owner} menyerang sebesar ${enemyDamage} damage!`, 'damage');
                break;
            case 'defend':
                pvpState.enemyDefending = true;
                addPvPLog(`${enemy.owner} bertahan!`, 'heal');
                break;
            case 'special':
                enemyDamage = Math.floor(enemy.attack * 1.3);
                player.currentHp -= enemyDamage;
                addPvPLog(`${enemy.owner} menggunakan serangan spesial! ${enemyDamage} damage!`, 'special');
                break;
        }
        if (player.currentHp <= 0) { endPvP(false); return; }
        pvpState.playerDefending = false;
        pvpState.enemyDefending = false;
        if (pvpState.specialCooldown > 0) pvpState.specialCooldown--;
        pvpState.turn++;
        updatePvPUI();
    }, 1500);
    updatePvPUI();
}

function endPvP(playerWon) {
    document.getElementById('pvpBattle').classList.add('hidden');
    document.getElementById('pvpResult').classList.remove('hidden');
    
    if (playerWon) {
        document.getElementById('pvpResultEmoji').textContent = '🏆';
        document.getElementById('pvpResultTitle').textContent = 'Kemenangan PvP!';
        document.getElementById('pvpResultTitle').style.color = '#10b981';
        document.getElementById('pvpResultMessage').textContent = `Kamu mengalahkan ${pvpState.enemy.owner}!`;
        document.getElementById('pvpRewardCoins').textContent = '100';
        document.getElementById('pvpRewardPoints').textContent = '10';
        currentUser.coins += 100;
        currentUser.pvpWins = (currentUser.pvpWins || 0) + 1;
        currentUser.pvpPoints = (currentUser.pvpPoints || 0) + 10;
        addActivity(`Menang PvP melawan ${pvpState.enemy.owner}!`, 'fa-trophy');
    } else {
        document.getElementById('pvpResultEmoji').textContent = '💀';
        document.getElementById('pvpResultTitle').textContent = 'Kekalahan PvP...';
        document.getElementById('pvpResultTitle').style.color = '#ef4444';
        document.getElementById('pvpResultMessage').textContent = `Kamu dikalahkan ${pvpState.enemy.owner}...`;
        document.getElementById('pvpRewardCoins').textContent = '20';
        document.getElementById('pvpRewardPoints').textContent = '2';
        currentUser.coins += 20;
        currentUser.pvpPoints = (currentUser.pvpPoints || 0) + 2;
        addActivity(`Kalah PvP melawan ${pvpState.enemy.owner}...`, 'fa-skull');
    }
    saveCurrentUser();
}

function resetPvP() {
    document.getElementById('pvpResult').classList.add('hidden');
    document.getElementById('pvpLobby').classList.remove('hidden');
    document.getElementById('pvpBattleLog').innerHTML = '<p class="log-entry">Pertarungan PvP dimulai!</p>';
    pvpState = null;
    renderOnlinePlayers();
}

// ========================================
// CHAT SYSTEM
// ========================================

function startChatRefresh() {
    renderChatMessages();
    chatInterval = setInterval(renderChatMessages, 3000);
}

function stopChatRefresh() {
    if (chatInterval) clearInterval(chatInterval);
}

function renderChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const chats = getFromStorage('globalChat', []);
    const recentChats = chats.slice(-50);
    
    if (recentChats.length === 0) {
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <i class="fas fa-comments"></i>
                <p>Selamat datang di chat global!</p>
                <p class="chat-rules">Jaga sopan santun dan jangan spam ya! 🎮</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = recentChats.map(c => `
        <div class="chat-message ${c.username === currentUser?.username ? 'own' : ''}">
            <span class="chat-username">${c.username}</span>
            <span class="chat-text">${escapeHtml(c.message)}</span>
            <span class="chat-time">${new Date(c.time).toLocaleTimeString()}</span>
        </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message || !currentUser) return;
    
    const chats = getFromStorage('globalChat', []);
    chats.push({
        id: generateId(),
        username: currentUser.username,
        message: message,
        time: new Date().toISOString()
    });
    if (chats.length > 100) chats.shift();
    saveToStorage('globalChat', chats);
    broadcastSync('chat_updated', {});
    input.value = '';
    renderChatMessages();
}

// ========================================
// TOP UP SYSTEM
// ========================================

function requestTopup(type, amount, price) {
    pendingTopup = { type, amount, price };
    document.getElementById('confirmTopupType').textContent = type === 'coins' ? '🪙 Koin' : type === 'gems' ? '💎 Gem' : '👑 Paket Sultan';
    document.getElementById('confirmTopupAmount').textContent = typeof amount === 'number' ? amount.toLocaleString() : amount;
    document.getElementById('confirmTopupPrice').textContent = 'Rp ' + price.toLocaleString();
    document.getElementById('topupConfirmModal').classList.remove('hidden');
}

function closeTopupConfirm() {
    document.getElementById('topupConfirmModal').classList.add('hidden');
    pendingTopup = null;
}

function confirmTopupRequest() {
    if (!pendingTopup || !currentUser) return;
    
    const topups = getFromStorage('topupRequests', []);
    topups.push({
        id: generateId(),
        username: currentUser.username,
        type: pendingTopup.type,
        amount: pendingTopup.amount,
        price: pendingTopup.price,
        status: 'pending',
        time: new Date().toISOString()
    });
    saveToStorage('topupRequests', topups);
    broadcastSync('topup_requested', { username: currentUser.username });
    
    alert('Permintaan top up telah dikirim! Admin akan memproses dalam waktu 1x24 jam.');
    closeTopupConfirm();
    renderTopupHistory();
}

function renderTopupHistory() {
    if (!currentUser) return;
    const topups = getFromStorage('topupRequests', []);
    const myTopups = topups.filter(t => t.username === currentUser.username).reverse();
    const container = document.getElementById('topupHistoryList');
    
    if (myTopups.length === 0) {
        container.innerHTML = '<p class="no-history">Belum ada riwayat top up</p>';
        return;
    }
    
    container.innerHTML = myTopups.map(t => `
        <div class="topup-history-item">
            <div class="topup-info">
                <span class="topup-type">${t.type === 'coins' ? '🪙' : t.type === 'gems' ? '💎' : '👑'} ${t.amount}</span>
                <span class="topup-price">Rp ${t.price?.toLocaleString()}</span>
            </div>
            <span class="topup-status ${t.status}">${t.status}</span>
        </div>
    `).join('');
}

// ========================================
// NOTIFICATION SYSTEM - REALTIME
// ========================================

let lastNotifCount = 0;

function startNotificationCheck() {
    updateNotificationBadge();
    // Check every 2 seconds for realtime updates
    notifInterval = setInterval(checkNotificationsRealtime, 2000);
}

function stopNotificationCheck() {
    if (notifInterval) clearInterval(notifInterval);
}

function checkNotificationsRealtime() {
    if (!currentUser) return;
    
    // Reload user data from storage to get latest notifications
    const users = getFromStorage('users', {});
    const updatedUser = users[currentUser.username];
    
    if (updatedUser && updatedUser.notifications) {
        const currentNotifs = currentUser.notifications || [];
        const newNotifs = updatedUser.notifications;
        
        // Check if there are new notifications
        if (newNotifs.length > currentNotifs.length) {
            // Update current user notifications
            currentUser.notifications = newNotifs;
            
            // Show toast for new notifications
            const newNotif = newNotifs[newNotifs.length - 1];
            if (!newNotif.read) {
                showNotificationToast(newNotif.message, newNotif.type);
            }
        }
    }
    
    updateNotificationBadge();
}

function updateNotificationBadge() {
    if (!currentUser) return;
    const notifs = currentUser.notifications || [];
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('userNotifBadge');
    if (badge) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'flex' : 'none';
    }
}

function showNotificationToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showUserNotifications() {
    const modal = document.getElementById('userNotificationsModal');
    const list = document.getElementById('userNotificationsList');
    
    if (!currentUser || !modal || !list) return;
    
    // Reload notifications from storage
    const users = getFromStorage('users', {});
    if (users[currentUser.username]) {
        currentUser.notifications = users[currentUser.username].notifications || [];
    }
    
    const notifs = (currentUser.notifications || []).slice().reverse();
    
    if (notifs.length === 0) {
        list.innerHTML = '<p class="no-notif">Tidak ada notifikasi</p>';
    } else {
        list.innerHTML = notifs.map(n => `
            <div class="notification-item ${n.read ? 'read' : ''}">
                <i class="fas ${getNotifIcon(n.type)}"></i>
                <div class="notif-content">
                    <p>${n.message}</p>
                    <span class="notif-time">${formatDate(n.time)}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Mark all as read
    notifs.forEach(n => n.read = true);
    saveCurrentUser();
    updateNotificationBadge();
    modal.classList.remove('hidden');
}

function getNotifIcon(type) {
    const icons = {
        'topup_approved': 'fa-check-circle',
        'topup_rejected': 'fa-times-circle',
        'currency_changed': 'fa-coins',
        'status_changed': 'fa-shield-alt',
        'username_changed': 'fa-user-edit',
        'email_changed': 'fa-envelope',
        'password_reset': 'fa-key',
        'vip_upgraded': 'fa-crown',
        'pass_activated': 'fa-ticket-alt',
        'card_received': 'fa-layer-group',
        'battle_won': 'fa-trophy',
        'battle_lost': 'fa-skull',
        'warning': 'fa-exclamation-triangle',
        'success': 'fa-check-circle',
        'error': 'fa-times-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function closeUserNotifications() {
    document.getElementById('userNotificationsModal').classList.add('hidden');
}

// Add notification to current user
function addNotification(message, type = 'info') {
    if (!currentUser) return;
    
    if (!currentUser.notifications) {
        currentUser.notifications = [];
    }
    
    currentUser.notifications.push({
        type: type,
        message: message,
        time: new Date().toISOString(),
        read: false
    });
    
    // Keep only last 50 notifications
    if (currentUser.notifications.length > 50) {
        currentUser.notifications = currentUser.notifications.slice(-50);
    }
    
    saveCurrentUser();
    updateNotificationBadge();
}

// ========================================
// SHOP SYSTEM - DYNAMIC PRICES
// ========================================

function getShopPrices() {
    return getFromStorage('shopPrices', { coins500: 25, coins1000: 45, gems100: 500 });
}

function getTopupPrices() {
    return getFromStorage('topupPrices', { 
        coins1000: 10000, coins5000: 45000, 
        gems100: 50000, gems500: 225000, sultan: 500000 
    });
}

function renderShop() {
    const prices = getShopPrices();
    const shopGrid = document.querySelector('.shop-grid');
    if (!shopGrid) return;
    
    // Update harga di UI
    const shopItems = shopGrid.querySelectorAll('.shop-item');
    shopItems.forEach(item => {
        const h3 = item.querySelector('h3');
        const priceEl = item.querySelector('.item-price');
        const btn = item.querySelector('.btn-buy');
        
        if (h3 && priceEl && btn) {
            const text = h3.textContent;
            if (text.includes('500 Koin')) {
                priceEl.innerHTML = `<i class="fas fa-gem"></i> ${prices.coins500}`;
                btn.setAttribute('onclick', `buyItem('coins', 500, ${prices.coins500})`);
            } else if (text.includes('1000 Koin')) {
                priceEl.innerHTML = `<i class="fas fa-gem"></i> ${prices.coins1000}`;
                btn.setAttribute('onclick', `buyItem('coins', 1000, ${prices.coins1000})`);
            } else if (text.includes('100 Gem')) {
                priceEl.innerHTML = `<i class="fas fa-coins"></i> ${prices.gems100}`;
                btn.setAttribute('onclick', `buyItem('gems', 100, ${prices.gems100})`);
            }
        }
    });
}

function renderTopupPackages() {
    const prices = getTopupPrices();
    const packages = document.querySelector('.topup-packages');
    if (!packages) return;
    
    const packageItems = packages.querySelectorAll('.topup-package');
    packageItems.forEach(pkg => {
        const h3 = pkg.querySelector('h3');
        const priceEl = pkg.querySelector('.package-price');
        const btn = pkg.querySelector('.btn-topup');
        
        if (h3 && priceEl && btn) {
            const text = h3.textContent;
            if (text.includes('1.000 Koin')) {
                priceEl.textContent = `Rp ${prices.coins1000.toLocaleString()}`;
                btn.setAttribute('onclick', `requestTopup('coins', 1000, ${prices.coins1000})`);
            } else if (text.includes('5.000 Koin')) {
                priceEl.textContent = `Rp ${prices.coins5000.toLocaleString()}`;
                btn.setAttribute('onclick', `requestTopup('coins', 5000, ${prices.coins5000})`);
            } else if (text.includes('100 Gem')) {
                priceEl.textContent = `Rp ${prices.gems100.toLocaleString()}`;
                btn.setAttribute('onclick', `requestTopup('gems', 100, ${prices.gems100})`);
            } else if (text.includes('500 Gem')) {
                priceEl.textContent = `Rp ${prices.gems500.toLocaleString()}`;
                btn.setAttribute('onclick', `requestTopup('gems', 500, ${prices.gems500})`);
            } else if (text.includes('Paket Sultan')) {
                priceEl.textContent = `Rp ${prices.sultan.toLocaleString()}`;
                btn.setAttribute('onclick', `requestTopup('package', 'sultan', ${prices.sultan})`);
            }
        }
    });
}

function buyItem(type, amount, cost) {
    if (!currentUser) return;
    
    // Get current prices from storage
    const prices = getShopPrices();
    let actualCost = cost;
    
    // Update cost based on current settings
    if (type === 'coins' && amount === 500) actualCost = prices.coins500;
    else if (type === 'coins' && amount === 1000) actualCost = prices.coins1000;
    else if (type === 'gems' && amount === 100) actualCost = prices.gems100;
    
    if (type === 'coins') {
        if (currentUser.gems < actualCost) { alert('Gem tidak cukup!'); return; }
        currentUser.gems -= actualCost;
        currentUser.coins += amount;
        addActivity(`Membeli ${amount} koin!`, 'fa-shopping-cart');
    } else if (type === 'gems') {
        if (currentUser.coins < actualCost) { alert('Koin tidak cukup!'); return; }
        currentUser.coins -= actualCost;
        currentUser.gems += amount;
        addActivity(`Membeli ${amount} gem!`, 'fa-shopping-cart');
    }
    saveCurrentUser();
    alert('Pembelian berhasil!');
}

function claimStarterPack() {
    if (!currentUser) return;
    if (currentUser.starterPackClaimed) { alert('Kamu sudah mengklaim paket pemula!'); return; }
    
    // Load reward settings from storage
    const rewardSettings = getFromStorage('rewardSettings', { starterCoins: 500, starterGems: 50 });
    
    currentUser.coins += rewardSettings.starterCoins;
    currentUser.gems += rewardSettings.starterGems;
    currentUser.starterPackClaimed = true;
    addActivity('Mengklaim Paket Pemula!', 'fa-gift');
    saveCurrentUser();
    alert(`Paket Pemula berhasil diklaim! +${rewardSettings.starterCoins} Koin, +${rewardSettings.starterGems} Gem`);
}

// ========================================
// NAVIGATION
// ========================================

function showSection(sectionId) {
    // Hide all sections and remove active class from nav buttons
    document.querySelectorAll('.game-section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Find and activate the corresponding nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + sectionId + "'")) {
            btn.classList.add('active');
        }
    });
    
    // Section-specific rendering
    if (sectionId === 'collection') renderCollection();
    if (sectionId === 'battle') renderBattleCards();
    if (sectionId === 'pvp') renderOnlinePlayers();
    if (sectionId === 'chat') { renderChatMessages(); setTimeout(() => document.getElementById('chatInput').focus(), 100); }
    if (sectionId === 'topup') { renderTopupPackages(); renderTopupHistory(); }
    if (sectionId === 'shop') renderShop();
    if (sectionId === 'profile') renderProfileSection();
    if (sectionId === 'dashboard') updateDashboard();
}

// ========================================
// USER MENU DROPDOWN
// ========================================

function toggleUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('userMenuBtn');
    if (menu && btn) {
        menu.classList.toggle('hidden');
        btn.classList.toggle('active');
        
        // Update dropdown info
        if (currentUser) {
            document.getElementById('dropdownUsername').textContent = currentUser.username;
            document.getElementById('dropdownEmail').textContent = currentUser.email || '-';
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('userMenuBtn');
    if (dropdown && btn && !dropdown.contains(event.target) && !btn.contains(event.target)) {
        dropdown.classList.add('hidden');
        btn.classList.remove('active');
    }
});

// ========================================
// PROFILE SECTION
// ========================================

function renderProfileSection() {
    if (!currentUser) return;
    
    // Update profile info
    document.getElementById('profileUsernameLarge').textContent = currentUser.username;
    document.getElementById('profileEmailLarge').textContent = currentUser.email || '-';
    document.getElementById('profileAvatarLarge').textContent = currentUser.username.charAt(0).toUpperCase();
    
    // Update stats
    document.getElementById('profileCoinsLarge').textContent = (currentUser.coins || 0).toLocaleString();
    document.getElementById('profileGemsLarge').textContent = (currentUser.gems || 0).toLocaleString();
    document.getElementById('profileCardsLarge').textContent = currentUser.cards ? currentUser.cards.length : 0;
    document.getElementById('profileWinsLarge').textContent = currentUser.wins || 0;
    document.getElementById('profileStreakLarge').textContent = currentUser.winStreak || 0;
    document.getElementById('profilePvpWinsLarge').textContent = currentUser.pvpWins || 0;
    
    // Update VIP badge
    const vipBadge = document.getElementById('vipBadgeDisplayLarge');
    if (vipBadge) {
        const vipLevel = currentUser.vipLevel || 0;
        if (vipLevel > 0) {
            vipBadge.textContent = getVipName(vipLevel);
            vipBadge.style.display = 'inline-flex';
            vipBadge.style.background = getVipColor(vipLevel);
        } else {
            vipBadge.style.display = 'none';
        }
    }
    
    // Update Pass badge
    const passBadge = document.getElementById('passBadgeDisplayLarge');
    if (passBadge) {
        const passType = currentUser.passType || 'none';
        if (passType !== 'none') {
            passBadge.textContent = getPassName(passType);
            passBadge.style.display = 'inline-flex';
        } else {
            passBadge.style.display = 'none';
        }
    }
}

function getVipName(level) {
    const names = { 0: 'Non-VIP', 1: 'VIP Bronze', 2: 'VIP Silver', 3: 'VIP Gold', 4: 'VIP Platinum', 5: 'VIP Diamond' };
    return names[level] || 'VIP';
}

function getVipColor(level) {
    const colors = { 0: '#9ca3af', 1: '#22c55e', 2: '#3b82f6', 3: '#a855f7', 4: '#f59e0b', 5: '#ef4444' };
    return colors[level] || '#6366f1';
}

function getPassName(pass) {
    const names = { none: 'Tidak Ada', weekly: 'Weekly Pass', monthly: 'Monthly Pass', seasonal: 'Season Pass' };
    return names[pass] || pass;
}

// ========================================
// EDIT PROFILE MODAL - FIXED (Single Definition)
// ========================================

function showEditProfileModal() {
    if (!currentUser) return;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('editProfileModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'editProfileModal';
    modal.className = 'modal';
    
    const vipLevel = currentUser.vipLevel || 0;
    const passType = currentUser.passType || 'none';
    
    const vipColors = { 0: '#9ca3af', 1: '#22c55e', 2: '#3b82f6', 3: '#a855f7', 4: '#f59e0b', 5: '#ef4444' };
    const vipNames = { 0: 'Non-VIP', 1: 'VIP Bronze', 2: 'VIP Silver', 3: 'VIP Gold', 4: 'VIP Platinum', 5: 'VIP Diamond' };
    const passNames = { 'none': 'Tidak Ada', 'weekly': 'Weekly Pass', 'monthly': 'Monthly Pass', 'seasonal': 'Season Pass' };
    
    modal.innerHTML = `
        <div class="modal-content profile-edit">
            <h3><i class="fas fa-user-edit"></i> Edit Profil</h3>

            <div class="current-badges">
                <div class="current-vip" style="background: ${vipColors[vipLevel]}">
                    <i class="fas fa-crown"></i> ${vipNames[vipLevel]}
                </div>
                <div class="current-pass" style="background: ${passType === 'none' ? '#9ca3af' : passType === 'weekly' ? '#22c55e' : passType === 'monthly' ? '#3b82f6' : '#f59e0b'}">
                    <i class="fas fa-ticket-alt"></i> ${passNames[passType]}
                </div>
            </div>

            <div class="form-group">
                <label>Username Baru</label>
                <input type="text" id="editProfileUsername" value="${currentUser.username}" placeholder="Masukkan username baru...">
                <small class="form-hint">Minimal 3 karakter</small>
            </div>

            <div class="form-group">
                <label>Email Baru</label>
                <input type="email" id="editProfileEmail" value="${currentUser.email}" placeholder="Masukkan email baru...">
            </div>

            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeEditProfileModal()">Batal</button>
                <button class="btn-primary" onclick="saveProfileEdit()">
                    <i class="fas fa-save"></i> Simpan
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.remove();
}

function saveProfileEdit() {
    if (!currentUser) return;
    
    const newUsername = document.getElementById('editProfileUsername').value.trim();
    const newEmail = document.getElementById('editProfileEmail').value.trim();
    
    if (!newUsername || newUsername.length < 3) {
        alert('Username minimal 3 karakter!');
        return;
    }
    
    const users = getFromStorage('users', {});
    
    if (newUsername !== currentUser.username && users[newUsername]) {
        alert('Username sudah digunakan!');
        return;
    }
    
    const oldUsername = currentUser.username;
    currentUser.username = newUsername;
    currentUser.email = newEmail;
    
    if (oldUsername !== newUsername) {
        delete users[oldUsername];
        sessionStorage.setItem('currentUser', newUsername);
    }
    users[newUsername] = currentUser;
    
    saveToStorage('users', users);
    broadcastSync('user_updated', { username: newUsername });
    
    updateUserUI();
    updateProfileUI();
    closeEditProfileModal();
    alert('Profil berhasil diperbarui!');
}

// ========================================
// PROFILE UI UPDATE
// ========================================

function updateProfileUI() {
    if (!currentUser) return;

    const profileAvatar = document.getElementById('profileAvatar');
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileCoins = document.getElementById('profileCoins');
    const profileGems = document.getElementById('profileGems');
    const profileCards = document.getElementById('profileCards');

    if (profileAvatar) profileAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
    if (profileUsername) profileUsername.textContent = currentUser.username;
    if (profileEmail) profileEmail.textContent = currentUser.email || '-';
    if (profileCoins) profileCoins.textContent = (currentUser.coins || 0).toLocaleString();
    if (profileGems) profileGems.textContent = (currentUser.gems || 0).toLocaleString();
    if (profileCards) profileCards.textContent = (currentUser.cards || []).length;

    // Update VIP badge
    const vipLevel = currentUser.vipLevel || 0;
    const vipBadgeDisplay = document.getElementById('vipBadgeDisplay');

    if (vipBadgeDisplay) {
        if (vipLevel > 0) {
            const vipColors = { 1: '#22c55e', 2: '#3b82f6', 3: '#a855f7', 4: '#f59e0b', 5: '#ef4444' };
            vipBadgeDisplay.innerHTML = `<i class="fas fa-crown"></i> VIP${vipLevel}`;
            vipBadgeDisplay.style.background = vipColors[vipLevel];
            vipBadgeDisplay.style.display = 'inline-flex';
        } else {
            vipBadgeDisplay.style.display = 'none';
        }
    }

    // Update Pass badge
    const passType = currentUser.passType || 'none';
    const passBadgeDisplay = document.getElementById('passBadgeDisplay');

    if (passBadgeDisplay) {
        if (passType !== 'none') {
            const passColors = { 'weekly': '#22c55e', 'monthly': '#3b82f6', 'seasonal': '#f59e0b' };
            const passNames = { 'weekly': 'Weekly', 'monthly': 'Monthly', 'seasonal': 'Season' };
            passBadgeDisplay.innerHTML = `<i class="fas fa-ticket-alt"></i> ${passNames[passType]}`;
            passBadgeDisplay.style.background = passColors[passType];
            passBadgeDisplay.style.display = 'inline-flex';
        } else {
            passBadgeDisplay.style.display = 'none';
        }
    }
}

// ========================================
// VIP SHOP FUNCTIONS
// ========================================

const VIP_PRICES = {
    1: { gems: 100, name: 'VIP Bronze', color: '#22c55e' },
    2: { gems: 250, name: 'VIP Silver', color: '#3b82f6' },
    3: { gems: 500, name: 'VIP Gold', color: '#a855f7' },
    4: { gems: 1000, name: 'VIP Platinum', color: '#f59e0b' },
    5: { gems: 2500, name: 'VIP Diamond', color: '#ef4444' }
};

function showVipShop() {
    // Remove existing modal if any
    const existingModal = document.getElementById('vipShopModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'vipShopModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content vip-shop">
            <h3><i class="fas fa-crown"></i> Toko VIP</h3>
            <div class="vip-options">
                ${Object.entries(VIP_PRICES).map(([level, data]) => `
                    <div class="vip-option vip-level-${level}" onclick="buyVip(${level})">
                        <div class="vip-icon"><i class="fas fa-crown"></i></div>
                        <div class="vip-info">
                            <span class="vip-name">${data.name}</span>
                            <span class="vip-price"><i class="fas fa-gem"></i> ${data.gems}</span>
                        </div>
                        <div class="vip-benefits">
                            <span>+${level * 10}% Bonus</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeVipShop()">Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeVipShop() {
    const modal = document.getElementById('vipShopModal');
    if (modal) modal.remove();
}

function buyVip(level) {
    if (!currentUser) return;

    const vipData = VIP_PRICES[level];
    if (!vipData) return;

    if ((currentUser.gems || 0) < vipData.gems) {
        alert('Gem tidak cukup!');
        return;
    }

    if (!confirm(`Beli ${vipData.name} seharga ${vipData.gems} gems?`)) return;

    currentUser.gems -= vipData.gems;
    currentUser.vipLevel = parseInt(level);
    currentUser.vipPurchasedAt = new Date().toISOString();

    addActivity(`Membeli ${vipData.name}!`, 'fa-crown');
    saveCurrentUser();

    updateUserUI();
    updateProfileUI();
    closeVipShop();
    alert(`Selamat! Kamu sekarang menjadi ${vipData.name}!`);
}

// ========================================
// PASS SHOP FUNCTIONS
// ========================================

const PASS_PRICES = {
    'weekly': { gems: 50, name: 'Weekly Pass', color: '#22c55e', days: 7 },
    'monthly': { gems: 150, name: 'Monthly Pass', color: '#3b82f6', days: 30 },
    'seasonal': { gems: 500, name: 'Season Pass', color: '#f59e0b', days: 90 }
};

function showPassShop() {
    // Remove existing modal if any
    const existingModal = document.getElementById('passShopModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'passShopModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content pass-shop">
            <h3><i class="fas fa-ticket-alt"></i> Toko Pass</h3>
            <div class="pass-options">
                ${Object.entries(PASS_PRICES).map(([type, data]) => `
                    <div class="pass-option pass-${type}" onclick="buyPass('${type}')">
                        <div class="pass-icon"><i class="fas fa-ticket-alt"></i></div>
                        <div class="pass-info">
                            <span class="pass-name">${data.name}</span>
                            <span class="pass-duration">${data.days} hari</span>
                            <span class="pass-price"><i class="fas fa-gem"></i> ${data.gems}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closePassShop()">Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closePassShop() {
    const modal = document.getElementById('passShopModal');
    if (modal) modal.remove();
}

function buyPass(type) {
    if (!currentUser) return;

    const passData = PASS_PRICES[type];
    if (!passData) return;

    if ((currentUser.gems || 0) < passData.gems) {
        alert('Gem tidak cukup!');
        return;
    }

    if (!confirm(`Beli ${passData.name} seharga ${passData.gems} gems?`)) return;

    currentUser.gems -= passData.gems;
    currentUser.passType = type;
    currentUser.passPurchasedAt = new Date().toISOString();
    currentUser.passExpiresAt = new Date(Date.now() + passData.days * 24 * 60 * 60 * 1000).toISOString();

    addActivity(`Membeli ${passData.name}!`, 'fa-ticket-alt');
    saveCurrentUser();

    updateUserUI();
    updateProfileUI();
    closePassShop();
    alert(`Selamat! Kamu sekarang memiliki ${passData.name}!`);
}

// ========================================
// REFRESH FUNCTION
// ========================================

function refreshGame() {
    updateUserUI();
    updateDashboard();
    updateProfileUI();
    renderCollection();
    renderOnlinePlayers();
    renderTopupHistory();
    showNotificationToast('Game berhasil di-refresh!', 'success');
}

// ========================================
// ADMIN FUNCTIONS (Placeholder)
// ========================================

function updateAdminStats() {
    // This function is called from admin panel
    const users = getFromStorage('users', {});
    const userList = Object.values(users);
    const topups = getFromStorage('topupRequests', []);
    
    const totalUsersEl = document.getElementById('totalUsers');
    const activeUsersEl = document.getElementById('activeUsers');
    const totalCardsEl = document.getElementById('totalCardsAll');
    const totalBattlesEl = document.getElementById('totalBattles');
    const totalGachaEl = document.getElementById('totalGacha');
    const totalTopupEl = document.getElementById('totalTopup');
    
    if (totalUsersEl) totalUsersEl.textContent = userList.length;
    if (activeUsersEl) activeUsersEl.textContent = userList.filter(u => u.status === 'active' || !u.status).length;
    if (totalCardsEl) totalCardsEl.textContent = userList.reduce((sum, u) => sum + (u.cards?.length || 0), 0);
    if (totalBattlesEl) totalBattlesEl.textContent = userList.reduce((sum, u) => sum + (u.wins || 0) + (u.losses || 0), 0);
    if (totalGachaEl) totalGachaEl.textContent = userList.reduce((sum, u) => sum + (u.activities?.filter(a => a.icon === 'fa-dice').length || 0), 0);
    if (totalTopupEl) totalTopupEl.textContent = topups.filter(t => t.status === 'pending').length;
}

// Close modals on outside click
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (!e.target.id.includes('auth') && !e.target.id.includes('admin') && !e.target.id.includes('suspended')) {
            e.target.classList.add('hidden');
        }
    }
});
