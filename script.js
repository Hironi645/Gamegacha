/**
 * EMOJI BATTLE GACHA - Game Logic (SUPABASE VERSION)
 * Professional Gacha Game with Real-time Online Database
 * Version 5.0 - Supabase Real-time Sync
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
let gameSettings = null;
let paymentSettings = null;
let chatSubscription = null;
let userSubscription = null;

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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

window.addEventListener('load', async function() {
    // Load settings
    await loadSettings();
    
    // Check for saved session
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser && SupaDB.isConnected()) {
        const user = await SupaDB.getUser(savedUser);
        if (user) {
            currentUser = user;
            if (checkUserStatus()) {
                showGameInterface();
                startChatSubscription();
                startUserSubscription();
            }
        }
    }
});

async function loadSettings() {
    if (!SupaDB.isConnected()) return;
    gameSettings = await SupaDB.getGameSettings();
    paymentSettings = await SupaDB.getPaymentSettings();
}

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
// REAL-TIME SUBSCRIPTIONS
// ========================================

function startChatSubscription() {
    if (!SupaDB.isConnected()) return;
    
    chatSubscription = SupaDB.subscribeToChat((payload) => {
        renderChatMessages();
    });
}

function startUserSubscription() {
    if (!SupaDB.isConnected() || !currentUser) return;
    
    userSubscription = SupaDB.subscribeToUsers((payload) => {
        // Refresh user data if it's the current user
        if (payload.new && payload.new.username === currentUser.username) {
            refreshUserData();
        }
    });
}

async function refreshUserData() {
    if (!currentUser) return;
    
    const freshUser = await SupaDB.getUser(currentUser.username);
    if (freshUser) {
        const oldCoins = currentUser.coins;
        const oldGems = currentUser.gems;
        const oldNotifs = (currentUser.notifications || []).filter(n => !n.read).length;
        
        currentUser = freshUser;
        
        if (oldCoins !== freshUser.coins || oldGems !== freshUser.gems) {
            updateUserUI();
            updateProfileUI();
        }
        
        const newNotifs = (freshUser.notifications || []).filter(n => !n.read).length;
        if (newNotifs !== oldNotifs) {
            updateNotificationBadge();
        }
    }
}

// ========================================
// USER AUTHENTICATION
// ========================================

async function register() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('regError');
    const successEl = document.getElementById('regSuccess');
    
    errorEl.textContent = '';
    successEl.textContent = '';
    
    // Validation
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
    
    // Check if Supabase is connected
    if (!SupaDB.isConnected()) {
        errorEl.textContent = 'Database tidak terhubung. Coba lagi nanti.';
        return;
    }
    
    // Check if username exists
    const existingUser = await SupaDB.getUser(username);
    if (existingUser) {
        errorEl.textContent = 'Username sudah terdaftar!';
        return;
    }
    
    // Create user
    const success = await SupaDB.createUser(username, email, password);
    
    if (success) {
        successEl.textContent = 'Registrasi berhasil! Silakan login.';
        document.getElementById('regUsername').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        setTimeout(() => switchTab('login'), 1500);
    } else {
        errorEl.textContent = 'Gagal membuat akun. Coba lagi.';
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    errorEl.textContent = '';
    
    if (!username || !password) {
        errorEl.textContent = 'Username dan password harus diisi!';
        return;
    }
    
    if (!SupaDB.isConnected()) {
        errorEl.textContent = 'Database tidak terhubung. Coba lagi nanti.';
        return;
    }
    
    const user = await SupaDB.authenticateUser(username, password);
    
    if (!user) {
        errorEl.textContent = 'Username atau password salah!';
        return;
    }
    
    currentUser = user;
    sessionStorage.setItem('currentUser', username);
    
    if (checkUserStatus()) {
        showGameInterface();
        startChatSubscription();
        startUserSubscription();
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    
    if (chatSubscription) {
        SupaDB.unsubscribe(chatSubscription);
        chatSubscription = null;
    }
    if (userSubscription) {
        SupaDB.unsubscribe(userSubscription);
        userSubscription = null;
    }
    
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
// FORGOT PASSWORD
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

async function submitForgotPassword() {
    const username = document.getElementById('forgotUsername').value.trim();
    const email = document.getElementById('forgotEmail').value.trim();
    const infoEl = document.getElementById('forgotPasswordInfo');
    
    if (!username || !email) {
        infoEl.textContent = 'Username dan email harus diisi!';
        infoEl.style.color = '#ef4444';
        return;
    }
    
    const user = await SupaDB.getUser(username);
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
    
    const reset = await SupaDB.createPasswordReset(username, email);
    if (reset) {
        infoEl.textContent = 'Permintaan reset password berhasil dikirim! Admin akan memproses.';
        infoEl.style.color = '#22c55e';
    } else {
        infoEl.textContent = 'Kamu sudah memiliki permintaan reset password yang pending.';
        infoEl.style.color = '#f59e0b';
    }
}

// ========================================
// UI UPDATES
// ========================================

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
    renderChatMessages();
}

function updateUserUI() {
    if (!currentUser) return;
    document.getElementById('welcomeUser').textContent = currentUser.username;
    document.getElementById('heroUsername').textContent = currentUser.username;
    document.getElementById('userCoins').textContent = currentUser.coins.toLocaleString();
    document.getElementById('userGems').textContent = currentUser.gems.toLocaleString();
    document.getElementById('dropdownUsername').textContent = currentUser.username;
    document.getElementById('dropdownEmail').textContent = currentUser.email;
}

function updateDashboard() {
    if (!currentUser) return;
    document.getElementById('totalCards').textContent = currentUser.cards.length;
    document.getElementById('totalWins').textContent = currentUser.wins;
    document.getElementById('winStreak').textContent = currentUser.winStreak;
    
    // Update profile card
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileCoins').textContent = currentUser.coins.toLocaleString();
    document.getElementById('profileGems').textContent = currentUser.gems.toLocaleString();
    document.getElementById('profileCards').textContent = currentUser.cards.length;
    
    // Update avatar
    const avatarEl = document.getElementById('profileAvatar');
    if (avatarEl) {
        avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    
    renderActivities();
}

function updateProfileUI() {
    if (!currentUser) return;
    document.getElementById('profileUsernameLarge').textContent = currentUser.username;
    document.getElementById('profileEmailLarge').textContent = currentUser.email;
    document.getElementById('profileCoinsLarge').textContent = currentUser.coins.toLocaleString();
    document.getElementById('profileGemsLarge').textContent = currentUser.gems.toLocaleString();
    document.getElementById('profileCardsLarge').textContent = currentUser.cards.length;
    document.getElementById('profileWinsLarge').textContent = currentUser.wins;
    document.getElementById('profileStreakLarge').textContent = currentUser.winStreak;
    document.getElementById('profilePvpWinsLarge').textContent = currentUser.pvpWins || 0;
    
    const avatarEl = document.getElementById('profileAvatarLarge');
    if (avatarEl) {
        avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
    }
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

async function addActivity(message, icon = 'fa-info-circle') {
    if (!currentUser) return;
    
    const activities = currentUser.activities || [];
    activities.push({ message, icon, time: new Date().toISOString() });
    if (activities.length > 20) activities.shift();
    
    await SupaDB.updateUser(currentUser.username, { activities });
    currentUser.activities = activities;
}

function formatDate(date) {
    return new Date(date).toLocaleString('id-ID');
}

// ========================================
// NAVIGATION
// ========================================

function showSection(sectionId) {
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    
    // Update nav button
    const navBtn = document.querySelector(`.nav-btn[onclick="showSection('${sectionId}')"]`);
    if (navBtn) navBtn.classList.add('active');
    
    // Refresh section-specific content
    if (sectionId === 'collection') renderCollection();
    if (sectionId === 'battle') renderBattleCards();
    if (sectionId === 'pvp') renderOnlinePlayers();
    if (sectionId === 'chat') renderChatMessages();
    if (sectionId === 'topup') renderTopupHistory();
}

function toggleUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('userMenuBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// ========================================
// GACHA SYSTEM
// ========================================

async function doGacha(type) {
    if (!currentUser) return;
    
    const costs = { 
        normal: { coins: 100 }, 
        premium: { gems: 50 }, 
        legendary: { gems: 150 } 
    };
    const cost = costs[type];
    
    if (cost.coins && currentUser.coins < cost.coins) { 
        alert('Koin tidak cukup!'); 
        return; 
    }
    if (cost.gems && currentUser.gems < cost.gems) { 
        alert('Gem tidak cukup!'); 
        return; 
    }
    
    if (cost.coins) currentUser.coins -= cost.coins;
    if (cost.gems) currentUser.gems -= cost.gems;
    
    const rates = gameSettings?.gachaRates?.[type] || {
        normal: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
        premium: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
        legendary: { common: 5, uncommon: 15, rare: 35, epic: 30, legendary: 15 }
    }[type];
    
    const roll = Math.random() * 100;
    let cumulative = 0, selectedRarity = 'common';
    
    for (const [rarity, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (roll <= cumulative) { selectedRarity = rarity; break; }
    }
    
    const cardsOfRarity = EMOJI_CARDS.filter(c => c.rarity === selectedRarity);
    const selectedCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    
    const cardInstance = { 
        ...selectedCard, 
        instanceId: generateId(), 
        acquiredAt: new Date().toISOString(), 
        level: 1, 
        exp: 0 
    };
    
    currentUser.cards.push(cardInstance);
    
    // Save to database
    await SupaDB.updateUser(currentUser.username, {
        coins: currentUser.coins,
        gems: currentUser.gems,
        cards: currentUser.cards
    });
    
    await addActivity(`Mendapatkan ${selectedCard.name} (${selectedRarity}) dari gacha!`, 'fa-dice');
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
        if (battleState.specialCooldown > 0) { 
            specialBtn.disabled = true; 
            specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial (${battleState.specialCooldown})`; 
        }
        else { 
            specialBtn.disabled = false; 
            specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial`; 
        }
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

async function endBattle(playerWon) {
    const resultSection = document.getElementById('battleResult');
    document.getElementById('battleArena').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    const rewards = gameSettings?.battleRewards || { winCoins: 50, winExp: 20, loseCoins: 10 };
    
    if (playerWon) {
        document.getElementById('resultEmoji').textContent = '🏆';
        document.getElementById('resultTitle').textContent = 'Kemenangan!';
        document.getElementById('resultTitle').style.color = '#10b981';
        document.getElementById('resultMessage').textContent = `${battleState.player.name} mengalahkan ${battleState.enemy.name}!`;
        const coins = rewards.winCoins + Math.floor(Math.random() * 30);
        const exp = rewards.winExp + Math.floor(Math.random() * 15);
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
        const coins = rewards.loseCoins;
        document.getElementById('rewardCoins').textContent = coins;
        document.getElementById('rewardExp').textContent = '5';
        
        currentUser.coins += coins;
        currentUser.losses = (currentUser.losses || 0) + 1;
        currentUser.winStreak = 0;
        
        addActivity(`Kalah melawan ${battleState.enemy.name}...`, 'fa-skull');
    }
    
    // Save to database
    await SupaDB.updateUser(currentUser.username, {
        coins: currentUser.coins,
        wins: currentUser.wins,
        losses: currentUser.losses,
        winStreak: currentUser.winStreak,
        cards: currentUser.cards
    });
    
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
// PvP SYSTEM (ONLINE)
// ========================================

async function renderOnlinePlayers() {
    if (!SupaDB.isConnected()) return;
    
    const users = await SupaDB.getAllUsers();
    const onlineList = document.getElementById('onlinePlayersList');
    const otherUsers = Object.values(users).filter(u => 
        u.username !== currentUser?.username && 
        (u.status === 'active' || !u.status)
    );
    
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
    
    const allUsers = Object.values(users).filter(u => u.status === 'active' || !u.status)
        .sort((a, b) => (b.pvpPoints || 0) - (a.pvpPoints || 0));
    const rank = allUsers.findIndex(u => u.username === currentUser?.username) + 1;
    document.getElementById('pvpRank').textContent = rank > 0 ? '#' + rank : '-';
}

async function challengePlayer(username) {
    if (!currentUser || currentUser.cards.length === 0) {
        alert('Kamu harus memiliki minimal 1 kartu untuk bertarung!');
        return;
    }
    
    const opponent = await SupaDB.getUser(username);
    if (!opponent) return;
    
    const opponentCard = opponent.cards[Math.floor(Math.random() * opponent.cards.length)];
    if (!opponentCard) {
        alert('Lawan tidak memiliki kartu!');
        return;
    }
    
    const myCard = currentUser.cards[0];
    startPvPBattle(myCard, opponentCard, username);
}

async function findMatch() {
    if (!currentUser || currentUser.cards.length === 0) {
        alert('Kamu harus memiliki minimal 1 kartu untuk bertarung!');
        return;
    }
    
    const users = await SupaDB.getAllUsers();
    const opponents = Object.values(users).filter(u => 
        u.username !== currentUser.username && 
        u.cards.length > 0 && 
        (u.status === 'active' || !u.status)
    );
    
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
        if (pvpState.specialCooldown > 0) { 
            specialBtn.disabled = true; 
            specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial (${pvpState.specialCooldown})`; 
        }
        else { 
            specialBtn.disabled = false; 
            specialBtn.innerHTML = `<i class="fas fa-star"></i> Spesial`; 
        }
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
            addPvPLog(`${player.name} bertahan!`, 'heal');
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
        const enemyAction = getEnemyAction();
        switch (enemyAction) {
            case 'attack':
                enemyDamage = Math.max(1, enemy.attack - (pvpState.playerDefending ? player.defense * 2 : player.defense));
                player.currentHp -= enemyDamage;
                addPvPLog(`${enemy.name} menyerang sebesar ${enemyDamage} damage!`, 'damage');
                break;
            case 'defend':
                pvpState.enemyDefending = true;
                addPvPLog(`${enemy.name} bertahan!`, 'heal');
                break;
            case 'special':
                enemyDamage = Math.floor(enemy.attack * 1.3);
                player.currentHp -= enemyDamage;
                addPvPLog(`${enemy.name} menggunakan serangan spesial! ${enemyDamage} damage!`, 'special');
                break;
        }
        if (player.currentHp <= 0) { endPvP(false); return; }
        pvpState.playerDefending = false;
        pvpState.enemyDefending = false;
        if (pvpState.specialCooldown > 0) pvpState.specialCooldown--;
        pvpState.turn++;
        updatePvPUI();
    }, 1000);
    updatePvPUI();
}

async function endPvP(playerWon) {
    const resultSection = document.getElementById('pvpResult');
    document.getElementById('pvpBattle').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    if (playerWon) {
        document.getElementById('pvpResultEmoji').textContent = '🏆';
        document.getElementById('pvpResultTitle').textContent = 'Kemenangan!';
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
        document.getElementById('pvpResultTitle').textContent = 'Kekalahan...';
        document.getElementById('pvpResultTitle').style.color = '#ef4444';
        document.getElementById('pvpResultMessage').textContent = `Kamu dikalahkan oleh ${pvpState.enemy.owner}...`;
        document.getElementById('pvpRewardCoins').textContent = '20';
        document.getElementById('pvpRewardPoints').textContent = '2';
        
        currentUser.coins += 20;
        currentUser.pvpPoints = (currentUser.pvpPoints || 0) + 2;
        
        addActivity(`Kalah PvP melawan ${pvpState.enemy.owner}...`, 'fa-skull');
    }
    
    // Save to database
    await SupaDB.updateUser(currentUser.username, {
        coins: currentUser.coins,
        pvpWins: currentUser.pvpWins,
        pvpPoints: currentUser.pvpPoints
    });
    
    updateDashboard();
}

function resetPvP() {
    document.getElementById('pvpResult').classList.add('hidden');
    document.getElementById('pvpLobby').classList.remove('hidden');
    document.getElementById('pvpBattleLog').innerHTML = '<p class="log-entry">Pertarungan PvP dimulai!</p>';
    pvpState = null;
    renderOnlinePlayers();
}

// ========================================
// CHAT SYSTEM (REAL-TIME)
// ========================================

async function renderChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const messages = await SupaDB.getChatMessages(50);
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <i class="fas fa-comments"></i>
                <p>Selamat datang di chat global!</p>
                <p class="chat-rules">Jaga sopan santun dan jangan spam ya! 🎮</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = messages.map(msg => `
        <div class="chat-message ${msg.username === currentUser?.username ? 'own' : ''}">
            <span class="chat-username">${msg.username}</span>
            <span class="chat-text">${escapeHtml(msg.message)}</span>
            <span class="chat-time">${formatTime(msg.time)}</span>
        </div>
    `).join('');
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentUser) return;
    
    await SupaDB.sendChatMessage(currentUser.username, message);
    input.value = '';
    renderChatMessages();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ========================================
// NOTIFICATIONS
// ========================================

function updateNotificationBadge() {
    if (!currentUser) return;
    const unreadCount = (currentUser.notifications || []).filter(n => !n.read).length;
    const badge = document.getElementById('userNotifBadge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

async function showUserNotifications() {
    const modal = document.getElementById('userNotificationsModal');
    const list = document.getElementById('userNotificationsList');
    
    const notifications = currentUser?.notifications || [];
    
    if (notifications.length === 0) {
        list.innerHTML = '<p class="no-notif">Tidak ada notifikasi</p>';
    } else {
        list.innerHTML = notifications.slice().reverse().map(n => `
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
    await SupaDB.markNotificationsAsRead(currentUser.username);
    currentUser.notifications = (currentUser.notifications || []).map(n => ({ ...n, read: true }));
    updateNotificationBadge();
    
    modal.classList.remove('hidden');
}

function closeUserNotifications() {
    document.getElementById('userNotificationsModal').classList.add('hidden');
}

function getNotifIcon(type) {
    const icons = {
        'topup_approved': 'fa-check-circle',
        'topup_rejected': 'fa-times-circle',
        'topup_request': 'fa-credit-card',
        'password_reset': 'fa-key',
        'username_changed': 'fa-user-edit',
        'email_changed': 'fa-envelope',
        'currency_changed': 'fa-coins',
        'status_changed': 'fa-ban',
        'warning': 'fa-exclamation-triangle',
        'banned': 'fa-ban',
        'default': 'fa-bell'
    };
    return icons[type] || icons['default'];
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
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
// TOP UP SYSTEM (DYNAMIC FROM DATABASE)
// ========================================

async function renderTopupPackages() {
    const container = document.querySelector('.topup-packages');
    if (!container || !paymentSettings) return;
    
    const packages = paymentSettings.topupPackages || [];
    
    container.innerHTML = packages.map(pkg => `
        <div class="topup-package ${pkg.popular ? 'popular' : ''} ${pkg.legendary ? 'legendary' : ''}">
            ${pkg.popular ? '<div class="popular-badge">POPULER</div>' : ''}
            <div class="package-icon">${pkg.icon}</div>
            <h3>${pkg.name}</h3>
            <p class="package-price">Rp ${pkg.price.toLocaleString()}</p>
            <ul class="package-benefits">
                ${pkg.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
            <button class="btn-topup ${pkg.legendary ? 'legendary-btn' : ''}" onclick="requestTopup('${pkg.type}', ${typeof pkg.amount === 'number' ? pkg.amount : `'${pkg.amount}'`}, ${pkg.price})">
                <i class="fas fa-shopping-cart"></i> Beli
            </button>
        </div>
    `).join('');
}

function requestTopup(type, amount, price) {
    pendingTopup = { type, amount, price };
    
    // Show payment info from database
    const paymentMethod = paymentSettings?.paymentMethods?.[0];
    
    document.getElementById('confirmTopupType').textContent = type === 'coins' ? 'Koin' : type === 'gems' ? 'Gem' : 'Paket';
    document.getElementById('confirmTopupAmount').textContent = typeof amount === 'number' ? amount.toLocaleString() : amount;
    document.getElementById('confirmTopupPrice').textContent = 'Rp ' + price.toLocaleString();
    
    // Update payment info
    const bankInfo = document.querySelector('.bank-info');
    if (bankInfo && paymentMethod) {
        bankInfo.innerHTML = `
            <p><i class="fas fa-university"></i> ${paymentMethod.name}</p>
            <p class="account-number">${paymentMethod.number}</p>
            <p a/n="${paymentMethod.holder}"></p>
        `;
    }
    
    document.getElementById('topupConfirmModal').classList.remove('hidden');
}

function closeTopupConfirm() {
    document.getElementById('topupConfirmModal').classList.add('hidden');
    pendingTopup = null;
}

async function confirmTopupRequest() {
    if (!pendingTopup || !currentUser) return;
    
    await SupaDB.createTopup(
        currentUser.username,
        pendingTopup.type,
        pendingTopup.amount,
        pendingTopup.price
    );
    
    showNotificationToast('Permintaan top up berhasil dikirim!', 'success');
    closeTopupConfirm();
    renderTopupHistory();
}

async function renderTopupHistory() {
    const list = document.getElementById('topupHistoryList');
    if (!currentUser) return;
    
    const topups = await SupaDB.getUserTopups(currentUser.username);
    
    if (topups.length === 0) {
        list.innerHTML = '<p class="no-history">Belum ada riwayat top up</p>';
        return;
    }
    
    list.innerHTML = topups.map(t => `
        <div class="topup-history-item">
            <div class="topup-info">
                <span class="topup-type">${t.type === 'coins' ? '🪙' : t.type === 'gems' ? '💎' : '👑'} ${t.amount.toLocaleString()} ${t.type}</span>
                <span class="topup-price">Rp ${t.price?.toLocaleString() || '-'}</span>
            </div>
            <span class="topup-status ${t.status}">${t.status}</span>
        </div>
    `).join('');
}

// ========================================
// SHOP SYSTEM
// ========================================

async function buyItem(type, amount, price) {
    if (!currentUser) return;
    
    if (type === 'coins') {
        if (currentUser.gems < price) {
            alert('Gem tidak cukup!');
            return;
        }
        currentUser.gems -= price;
        currentUser.coins += amount;
        await SupaDB.updateUser(currentUser.username, { coins: currentUser.coins, gems: currentUser.gems });
        addActivity(`Membeli ${amount} koin dengan ${price} gem!`, 'fa-shopping-cart');
    } else if (type === 'gems') {
        if (currentUser.coins < price) {
            alert('Koin tidak cukup!');
            return;
        }
        currentUser.coins -= price;
        currentUser.gems += amount;
        await SupaDB.updateUser(currentUser.username, { coins: currentUser.coins, gems: currentUser.gems });
        addActivity(`Membeli ${amount} gem dengan ${price} koin!`, 'fa-shopping-cart');
    }
    
    updateUserUI();
    updateDashboard();
    showNotificationToast('Pembelian berhasil!', 'success');
}

async function claimStarterPack() {
    if (!currentUser) return;
    
    if (currentUser.starterPackClaimed) {
        alert('Kamu sudah mengklaim paket pemula!');
        return;
    }
    
    const pack = gameSettings?.starterPack || { coins: 500, gems: 50 };
    
    currentUser.coins += pack.coins;
    currentUser.gems += pack.gems;
    currentUser.starterPackClaimed = true;
    
    await SupaDB.updateUser(currentUser.username, {
        coins: currentUser.coins,
        gems: currentUser.gems,
        starterPackClaimed: true
    });
    
    addActivity('Mengklaim paket pemula!', 'fa-gift');
    updateUserUI();
    updateDashboard();
    showNotificationToast('Paket pemula berhasil diklaim!', 'success');
}

function showVipShop() {
    alert('Fitur VIP akan segera hadir!');
}

function showPassShop() {
    alert('Fitur Pass akan segera hadir!');
}

// ========================================
// EDIT PROFILE
// ========================================

function showEditProfileModal() {
    alert('Fitur edit profil akan segera hadir!');
}

async function refreshGame() {
    if (currentUser) {
        await refreshUserData();
        await loadSettings();
        renderTopupPackages();
        showNotificationToast('Data berhasil di-refresh!', 'success');
    }
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

// Load topup packages on page load
window.addEventListener('load', async () => {
    await renderTopupPackages();
});
