/**
 * JSONBIN.IO CLIENT - Emoji Battle Gacha
 * Database Client using JSONBin.io
 * Version 1.0 - JSONBin.io Integration
 */

// ========================================
// JSONBIN.IO CONFIGURATION
// ========================================

// Anda perlu mendapatkan API Key dari https://jsonbin.io/
// Daftar gratis dan dapatkan API Key Anda
const JSONBIN_CONFIG = {
    apiKey: '$2a$10$YourJsonBinApiKeyHere', // Ganti dengan API Key Anda
    baseUrl: 'https://api.jsonbin.io/v3/b',
    // Bin IDs untuk menyimpan data berbeda
    bins: {
        users: null,      // Akan dibuat otomatis
        chat: null,       // Akan dibuat otomatis
        topups: null,     // Akan dibuat otomatis
        passwordResets: null, // Akan dibuat otomatis
        settings: null,   // Akan dibuat otomatis
        adminLogs: null,  // Akan dibuat otomatis
        vipConfig: null   // Akan dibuat otomatis
    }
};

// ========================================
// LOCAL STORAGE FALLBACK
// ========================================

// Karena jsonbin.io memerlukan API key, kita akan menggunakan localStorage
// sebagai fallback dan sinkronisasi ke jsonbin.io jika tersedia
const LOCAL_STORAGE_KEY = 'emoji_battle_gacha_data';

function getLocalData() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {
        users: {},
        chat: [],
        topups: {},
        passwordResets: {},
        settings: {
            game: null,
            payment: null,
            vip: null
        },
        adminLogs: [],
        lastSync: null
    };
}

function saveLocalData(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// ========================================
// JSONBIN.IO API FUNCTIONS
// ========================================

let isConnected = false;
let binIds = {};

// Inisialisasi bin IDs dari localStorage
function initBinIds() {
    const saved = localStorage.getItem('jsonbin_bin_ids');
    if (saved) {
        binIds = JSON.parse(saved);
    }
}

function saveBinIds() {
    localStorage.setItem('jsonbin_bin_ids', JSON.stringify(binIds));
}

// Cek apakah API key valid
async function checkConnection() {
    if (!JSONBIN_CONFIG.apiKey || JSONBIN_CONFIG.apiKey.includes('YourJsonBinApiKey')) {
        console.log('JSONBin API Key tidak dikonfigurasi, menggunakan localStorage');
        isConnected = false;
        return false;
    }
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });
        isConnected = response.ok;
        return isConnected;
    } catch (error) {
        console.log('JSONBin tidak terhubung, menggunakan localStorage:', error);
        isConnected = false;
        return false;
    }
}

// Buat bin baru
async function createBin(name, data) {
    if (!isConnected) return null;
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.apiKey,
                'X-Bin-Name': name
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.metadata.id;
        }
        return null;
    } catch (error) {
        console.error('Error creating bin:', error);
        return null;
    }
}

// Get bin data
async function getBin(binId) {
    if (!isConnected || !binId) return null;
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${binId}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.record;
        }
        return null;
    } catch (error) {
        console.error('Error getting bin:', error);
        return null;
    }
}

// Update bin data
async function updateBin(binId, data) {
    if (!isConnected || !binId) return false;
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            },
            body: JSON.stringify(data)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error updating bin:', error);
        return false;
    }
}

// ========================================
// INITIALIZATION
// ========================================

async function initJsonBin() {
    initBinIds();
    await checkConnection();
    
    if (isConnected) {
        // Buat bins jika belum ada
        const localData = getLocalData();
        
        if (!binIds.users) {
            binIds.users = await createBin('users', localData.users);
        }
        if (!binIds.chat) {
            binIds.chat = await createBin('chat', localData.chat);
        }
        if (!binIds.topups) {
            binIds.topups = await createBin('topups', localData.topups);
        }
        if (!binIds.passwordResets) {
            binIds.passwordResets = await createBin('passwordResets', localData.passwordResets);
        }
        if (!binIds.settings) {
            binIds.settings = await createBin('settings', localData.settings);
        }
        if (!binIds.adminLogs) {
            binIds.adminLogs = await createBin('adminLogs', localData.adminLogs);
        }
        if (!binIds.vipConfig) {
            binIds.vipConfig = await createBin('vipConfig', localData.settings.vip);
        }
        
        saveBinIds();
        
        // Sync dari cloud
        await syncFromCloud();
    }
    
    return true;
}

// Sync dari cloud ke local
async function syncFromCloud() {
    if (!isConnected) return;
    
    const users = await getBin(binIds.users);
    const chat = await getBin(binIds.chat);
    const topups = await getBin(binIds.topups);
    const passwordResets = await getBin(binIds.passwordResets);
    const settings = await getBin(binIds.settings);
    const adminLogs = await getBin(binIds.adminLogs);
    
    const localData = getLocalData();
    
    if (users) localData.users = users;
    if (chat) localData.chat = chat;
    if (topups) localData.topups = topups;
    if (passwordResets) localData.passwordResets = passwordResets;
    if (settings) localData.settings = settings;
    if (adminLogs) localData.adminLogs = adminLogs;
    
    localData.lastSync = new Date().toISOString();
    saveLocalData(localData);
}

// Sync ke cloud dari local
async function syncToCloud() {
    if (!isConnected) return;
    
    const localData = getLocalData();
    
    await updateBin(binIds.users, localData.users);
    await updateBin(binIds.chat, localData.chat);
    await updateBin(binIds.topups, localData.topups);
    await updateBin(binIds.passwordResets, localData.passwordResets);
    await updateBin(binIds.settings, localData.settings);
    await updateBin(binIds.adminLogs, localData.adminLogs);
}

// ========================================
// JSONBIN DB CLASS (Compatible with SupaDB API)
// ========================================

const JsonBinDB = {
    // Check connection status
    isConnected: function() {
        return true; // Selalu return true karena kita pakai localStorage sebagai fallback
    },

    // Initialize
    init: async function() {
        return await initJsonBin();
    },

    // ========================================
    // USER OPERATIONS
    // ========================================

    // Get user by username
    getUser: async function(username) {
        const data = getLocalData();
        return data.users[username] || null;
    },

    // Get user by email
    getUserByEmail: async function(email) {
        const data = getLocalData();
        const users = Object.values(data.users);
        return users.find(u => u.email === email) || null;
    },

    // Get all users
    getAllUsers: async function() {
        const data = getLocalData();
        return Object.values(data.users);
    },

    // Create new user
    createUser: async function(username, email, password) {
        const data = getLocalData();
        
        if (data.users[username]) return false;
        
        data.users[username] = {
            username: username,
            email: email,
            password: password,
            coins: 1000,
            gems: 100,
            cards: [],
            wins: 0,
            losses: 0,
            win_streak: 0,
            pvp_wins: 0,
            pvp_points: 0,
            vip_level: 0,
            pass_type: 'none',
            status: 'active',
            status_reason: '',
            activities: [],
            notifications: [],
            warnings: [],
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
        };
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Authenticate user
    authenticateUser: async function(username, password) {
        const user = await this.getUser(username);
        if (user && user.password === password) {
            user.last_login = new Date().toISOString();
            const data = getLocalData();
            data.users[username] = user;
            saveLocalData(data);
            if (isConnected) await syncToCloud();
            return user;
        }
        return null;
    },

    // Update user
    updateUser: async function(username, updates) {
        const data = getLocalData();
        if (!data.users[username]) return false;
        
        data.users[username] = { ...data.users[username], ...updates };
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Delete user
    deleteUser: async function(username) {
        const data = getLocalData();
        delete data.users[username];
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Change username
    changeUsername: async function(oldUsername, newUsername) {
        const data = getLocalData();
        if (data.users[newUsername]) return false;
        if (!data.users[oldUsername]) return false;
        
        data.users[newUsername] = { ...data.users[oldUsername], username: newUsername };
        delete data.users[oldUsername];
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // ========================================
    // CHAT OPERATIONS
    // ========================================

    // Send chat message
    sendChat: async function(username, message) {
        const data = getLocalData();
        const chatMessage = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            username: username,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        data.chat.push(chatMessage);
        if (data.chat.length > 100) data.chat.shift(); // Keep last 100 messages
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Get chat messages
    getChatMessages: async function(limit = 50) {
        const data = getLocalData();
        return data.chat.slice(-limit);
    },

    // Clear all chat
    clearAllChat: async function() {
        const data = getLocalData();
        data.chat = [];
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Subscribe to chat (simulated with polling)
    subscribeToChat: function(callback) {
        const interval = setInterval(async () => {
            const messages = await this.getChatMessages();
            callback(messages);
        }, 3000);
        
        return { type: 'chat', interval };
    },

    // Subscribe to users (simulated with polling)
    subscribeToUsers: function(callback) {
        const interval = setInterval(async () => {
            const data = getLocalData();
            callback(data.users);
        }, 5000);
        
        return { type: 'users', interval };
    },

    // Unsubscribe
    unsubscribe: function(subscription) {
        if (subscription && subscription.interval) {
            clearInterval(subscription.interval);
        }
    },

    // ========================================
    // TOP UP OPERATIONS
    // ========================================

    // Create top up request
    createTopup: async function(username, type, amount, price) {
        const data = getLocalData();
        const topupId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        
        data.topups[topupId] = {
            id: topupId,
            username: username,
            type: type,
            amount: amount,
            price: price,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return topupId;
    },

    // Get all topups
    getAllTopups: async function() {
        const data = getLocalData();
        return Object.values(data.topups);
    },

    // Get user topups
    getUserTopups: async function(username) {
        const data = getLocalData();
        return Object.values(data.topups).filter(t => t.username === username);
    },

    // Approve topup
    approveTopup: async function(topupId) {
        const data = getLocalData();
        const topup = data.topups[topupId];
        if (!topup) return false;
        
        topup.status = 'approved';
        topup.processed_at = new Date().toISOString();
        
        const user = data.users[topup.username];
        if (user) {
            if (topup.type === 'coins') {
                user.coins = (user.coins || 0) + topup.amount;
            } else if (topup.type === 'gems') {
                user.gems = (user.gems || 0) + topup.amount;
            } else if (topup.type === 'package') {
                user.coins = (user.coins || 0) + 5000;
                user.gems = (user.gems || 0) + 1000;
            }
            
            // Add notification
            user.notifications = user.notifications || [];
            user.notifications.push({
                id: Date.now().toString(36),
                type: 'topup_approved',
                message: `Top up ${topup.amount} ${topup.type} telah disetujui!`,
                read: false,
                created_at: new Date().toISOString()
            });
        }
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Reject topup
    rejectTopup: async function(topupId, reason) {
        const data = getLocalData();
        const topup = data.topups[topupId];
        if (!topup) return false;
        
        topup.status = 'rejected';
        topup.reason = reason;
        topup.processed_at = new Date().toISOString();
        
        const user = data.users[topup.username];
        if (user) {
            user.notifications = user.notifications || [];
            user.notifications.push({
                id: Date.now().toString(36),
                type: 'topup_rejected',
                message: `Top up ditolak. Alasan: ${reason}`,
                read: false,
                created_at: new Date().toISOString()
            });
        }
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Subscribe to topups (simulated)
    subscribeToTopups: function(callback) {
        const interval = setInterval(async () => {
            const topups = await this.getAllTopups();
            const topupsObj = {};
            topups.forEach(t => topupsObj[t.id] = t);
            callback(topupsObj);
        }, 5000);
        
        return { type: 'topups', interval };
    },

    // ========================================
    // PASSWORD RESET OPERATIONS
    // ========================================

    // Create password reset request
    createPasswordReset: async function(username, email) {
        const data = getLocalData();
        
        // Check if already exists
        const existing = Object.values(data.passwordResets).find(
            r => r.username === username && r.status === 'pending'
        );
        if (existing) return false;
        
        const resetId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        data.passwordResets[resetId] = {
            id: resetId,
            username: username,
            email: email,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Get all password resets
    getAllPasswordResets: async function() {
        const data = getLocalData();
        return Object.values(data.passwordResets);
    },

    // Process password reset
    processPasswordReset: async function(resetId, newPassword) {
        const data = getLocalData();
        const reset = data.passwordResets[resetId];
        if (!reset) return false;
        
        const user = data.users[reset.username];
        if (user) {
            user.password = newPassword;
            user.notifications = user.notifications || [];
            user.notifications.push({
                id: Date.now().toString(36),
                type: 'password_reset',
                message: 'Password kamu telah direset oleh admin.',
                read: false,
                created_at: new Date().toISOString()
            });
        }
        
        reset.status = 'processed';
        reset.new_password = newPassword;
        reset.processed_at = new Date().toISOString();
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Subscribe to password resets (simulated)
    subscribeToPasswordResets: function(callback) {
        const interval = setInterval(async () => {
            const resets = await this.getAllPasswordResets();
            const resetsObj = {};
            resets.forEach(r => resetsObj[r.id] = r);
            callback(resetsObj);
        }, 5000);
        
        return { type: 'passwordResets', interval };
    },

    // ========================================
    // NOTIFICATION OPERATIONS
    // ========================================

    // Add notification to user
    addNotification: async function(username, type, message) {
        const data = getLocalData();
        const user = data.users[username];
        if (!user) return false;
        
        user.notifications = user.notifications || [];
        user.notifications.push({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            type: type,
            message: message,
            read: false,
            created_at: new Date().toISOString()
        });
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Mark notification as read
    markNotificationRead: async function(username, notificationId) {
        const data = getLocalData();
        const user = data.users[username];
        if (!user || !user.notifications) return false;
        
        const notif = user.notifications.find(n => n.id === notificationId);
        if (notif) {
            notif.read = true;
            saveLocalData(data);
            if (isConnected) await syncToCloud();
        }
        return true;
    },

    // ========================================
    // GAME SETTINGS OPERATIONS
    // ========================================

    // Get game settings
    getGameSettings: async function() {
        const data = getLocalData();
        return data.settings.game || this.getDefaultGameSettings();
    },

    // Update game settings
    updateGameSettings: async function(settings) {
        const data = getLocalData();
        data.settings.game = { ...data.settings.game, ...settings };
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Default game settings
    getDefaultGameSettings: function() {
        return {
            gacha_rates: {
                normal: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
                premium: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
                legendary: { common: 5, uncommon: 15, rare: 35, epic: 30, legendary: 15 }
            },
            battle_rewards: {
                winCoins: 50,
                winExp: 20,
                loseCoins: 10
            },
            starting_resources: {
                coins: 1000,
                gems: 100
            },
            shop_prices: {
                coins500: 25,
                coins1000: 45,
                gems100: 500
            },
            topup_prices: {
                coins1000: 10000,
                coins5000: 45000,
                gems100: 50000,
                gems500: 225000,
                sultan: 500000
            },
            starter_pack: {
                coins: 500,
                gems: 50
            }
        };
    },

    // ========================================
    // PAYMENT SETTINGS OPERATIONS
    // ========================================

    // Get payment settings
    getPaymentSettings: async function() {
        const data = getLocalData();
        return data.settings.payment || this.getDefaultPaymentSettings();
    },

    // Update payment settings
    updatePaymentSettings: async function(settings) {
        const data = getLocalData();
        data.settings.payment = { ...data.settings.payment, ...settings };
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Default payment settings
    getDefaultPaymentSettings: function() {
        return {
            payment_methods: [
                { name: 'Bank BCA', number: '123-456-7890', holder: 'Emoji Battle Gacha' },
                { name: 'Bank BNI', number: '098-765-4321', holder: 'Emoji Battle Gacha' },
                { name: 'DANA', number: '0812-3456-7890', holder: 'Emoji Battle Gacha' }
            ],
            topup_packages: [
                {
                    id: 'pkg_1',
                    name: '1.000 Koin',
                    type: 'coins',
                    amount: 1000,
                    price: 10000,
                    icon: '🪙',
                    benefits: ['10x Gacha Normal', 'Bonus 100 Koin'],
                    popular: false,
                    legendary: false
                },
                {
                    id: 'pkg_2',
                    name: '5.000 Koin',
                    type: 'coins',
                    amount: 5000,
                    price: 45000,
                    icon: '🪙',
                    benefits: ['50x Gacha Normal', 'Bonus 1.000 Koin', 'Hemat Rp 5.000'],
                    popular: false,
                    legendary: false
                },
                {
                    id: 'pkg_3',
                    name: '100 Gem',
                    type: 'gems',
                    amount: 100,
                    price: 50000,
                    icon: '💎',
                    benefits: ['2x Gacha Premium', 'Bonus 10 Gem'],
                    popular: true,
                    legendary: false
                },
                {
                    id: 'pkg_4',
                    name: '500 Gem',
                    type: 'gems',
                    amount: 500,
                    price: 225000,
                    icon: '💎',
                    benefits: ['10x Gacha Premium', 'Bonus 100 Gem', 'Hemat Rp 25.000'],
                    popular: false,
                    legendary: false
                },
                {
                    id: 'pkg_5',
                    name: 'Paket Sultan',
                    type: 'package',
                    amount: 'sultan',
                    price: 500000,
                    icon: '👑',
                    benefits: ['5.000 Koin', '1.000 Gem', '1x Legendary Gacha'],
                    popular: false,
                    legendary: true
                }
            ]
        };
    },

    // ========================================
    // ADMIN LOG OPERATIONS
    // ========================================

    // Add admin log
    addAdminLog: async function(action, target, details) {
        const data = getLocalData();
        data.adminLogs.push({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            action: action,
            target: target,
            details: details,
            timestamp: new Date().toISOString()
        });
        
        if (data.adminLogs.length > 100) data.adminLogs.shift();
        
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Get admin logs
    getAdminLogs: async function(limit = 100) {
        const data = getLocalData();
        return data.adminLogs.slice(-limit).reverse();
    },

    // ========================================
    // VIP CONFIG OPERATIONS
    // ========================================

    // Get VIP config
    getVipConfig: async function() {
        const data = getLocalData();
        return data.settings.vip || this.getDefaultVipConfig();
    },

    // Update VIP config
    updateVipConfig: async function(config) {
        const data = getLocalData();
        data.settings.vip = config;
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Default VIP config
    getDefaultVipConfig: function() {
        return {
            levels: [
                { level: 0, name: 'Non-VIP', price: 0, color: '#9ca3af', benefits: [] },
                { level: 1, name: 'VIP Bronze', price: 100, color: '#22c55e', benefits: ['+10% Bonus Koin', 'Badge Eksklusif'] },
                { level: 2, name: 'VIP Silver', price: 250, color: '#3b82f6', benefits: ['+20% Bonus Koin', 'Badge Eksklusif', 'Daily Reward'] },
                { level: 3, name: 'VIP Gold', price: 500, color: '#a855f7', benefits: ['+30% Bonus Koin', 'Badge Eksklusif', 'Daily Reward+', 'Priority Support'] },
                { level: 4, name: 'VIP Platinum', price: 1000, color: '#f59e0b', benefits: ['+40% Bonus Koin', 'Badge Eksklusif', 'Daily Reward++', 'Priority Support', 'Exclusive Items'] },
                { level: 5, name: 'VIP Diamond', price: 2500, color: '#ef4444', benefits: ['+50% Bonus Koin', 'Badge Eksklusif', 'Daily Reward+++', 'Priority Support', 'Exclusive Items', 'Custom Badge'] }
            ]
        };
    },

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    // Export all data
    exportData: function() {
        return getLocalData();
    },

    // Import data
    importData: async function(data) {
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Reset all data
    resetAllData: async function() {
        const emptyData = {
            users: {},
            chat: [],
            topups: {},
            passwordResets: {},
            settings: {
                game: null,
                payment: null,
                vip: null
            },
            adminLogs: [],
            lastSync: null
        };
        saveLocalData(emptyData);
        if (isConnected) await syncToCloud();
        return true;
    },

    // Clear all users
    clearAllUsers: async function() {
        const data = getLocalData();
        data.users = {};
        saveLocalData(data);
        if (isConnected) await syncToCloud();
        return true;
    }
};

// Compatibility alias untuk SupaDB
const SupaDB = JsonBinDB;

// Auto-initialize when script loads
initJsonBin();

console.log('JsonBinDB initialized successfully!');
