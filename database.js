/**
 * DATABASE API - Emoji Battle Gacha
 * Using JSONBin.io as centralized database
 * FREE PLAN: Up to 10,000 requests/month
 */

// ========================================
// JSONBin.io Configuration
// ========================================

// Master Key untuk akses penuh (ganti dengan key Anda setelah setup)
const MASTER_KEY = '$2a$10$YourMasterKeyHere';

// Bin IDs untuk berbagai koleksi data
const BINS = {
    USERS: 'users_data',
    CHAT: 'global_chat',
    TOPUP: 'topup_requests',
    SETTINGS: 'game_settings',
    PASSWORD_RESETS: 'password_resets',
    ADMIN_LOGS: 'admin_logs'
};

// Base URL untuk JSONBin API v3
const API_BASE = 'https://api.jsonbin.io/v3/b';

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    return new Date(date).toLocaleString('id-ID');
}

// ========================================
// LOCAL STORAGE FALLBACK
// ========================================

// Karena JSONBin butuh setup, kita gunakan localStorage sebagai fallback
// tapi dengan struktur yang bisa di-sync ke JSONBin nanti

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

// ========================================
// DATABASE OPERATIONS (LocalStorage Mode)
// ========================================
// Mode ini menggunakan localStorage tapi dengan struktur database
// yang bisa di-export/import ke JSONBin

const DB = {
    // Initialize database
    init() {
        if (!getFromStorage('db_users')) saveToStorage('db_users', {});
        if (!getFromStorage('db_chat')) saveToStorage('db_chat', []);
        if (!getFromStorage('db_topup')) saveToStorage('db_topup', []);
        if (!getFromStorage('db_settings')) {
            saveToStorage('db_settings', {
                gachaRates: {
                    normal: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
                    premium: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
                    legendary: { common: 5, uncommon: 15, rare: 35, epic: 30, legendary: 15 }
                },
                startingResources: { coins: 1000, gems: 100 },
                battleRewards: { winCoins: 50, winExp: 20, loseCoins: 10 },
                shopPrices: { coins500: 25, coins1000: 45, gems100: 500 },
                topupPrices: { coins1000: 10000, coins5000: 45000, gems100: 50000, gems500: 225000, sultan: 500000 },
                starterPack: { coins: 500, gems: 50 }
            });
        }
        if (!getFromStorage('db_passwordResets')) saveToStorage('db_passwordResets', []);
        if (!getFromStorage('db_adminLogs')) saveToStorage('db_adminLogs', []);
    },

    // USER OPERATIONS
    users: {
        getAll() {
            return getFromStorage('db_users', {});
        },
        
        get(username) {
            const users = getFromStorage('db_users', {});
            return users[username] || null;
        },
        
        create(username, userData) {
            const users = getFromStorage('db_users', {});
            if (users[username]) return false; // User already exists
            
            users[username] = {
                username,
                email: userData.email,
                password: userData.password,
                coins: userData.coins || 1000,
                gems: userData.gems || 100,
                cards: [],
                wins: 0,
                losses: 0,
                winStreak: 0,
                pvpWins: 0,
                pvpPoints: 0,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                starterPackClaimed: false,
                activities: [],
                notifications: [],
                status: 'active',
                statusReason: '',
                vipLevel: 0,
                passType: 'none',
                warnings: []
            };
            
            saveToStorage('db_users', users);
            DB.logs.add('user_created', username, 'User registered');
            return true;
        },
        
        update(username, updates) {
            const users = getFromStorage('db_users', {});
            if (!users[username]) return false;
            
            users[username] = { ...users[username], ...updates };
            saveToStorage('db_users', users);
            
            // Broadcast update untuk sync antar tab
            DB.broadcast('user_updated', { username });
            return true;
        },
        
        delete(username) {
            const users = getFromStorage('db_users', {});
            delete users[username];
            saveToStorage('db_users', users);
            DB.logs.add('user_deleted', username, 'User deleted');
            return true;
        },
        
        changeUsername(oldUsername, newUsername) {
            const users = getFromStorage('db_users', {});
            if (!users[oldUsername] || users[newUsername]) return false;
            
            users[newUsername] = { ...users[oldUsername], username: newUsername };
            delete users[oldUsername];
            saveToStorage('db_users', users);
            
            // Update related data
            DB.updateRelatedDataUsername(oldUsername, newUsername);
            
            DB.logs.add('username_changed', `${oldUsername} -> ${newUsername}`, 'Username changed');
            return true;
        },
        
        authenticate(username, password) {
            const user = this.get(username);
            if (!user) return null;
            if (user.password !== password) return null;
            
            // Update last login
            this.update(username, { lastLogin: new Date().toISOString() });
            return user;
        }
    },
    
    // CHAT OPERATIONS
    chat: {
        getAll() {
            return getFromStorage('db_chat', []);
        },
        
        add(message, username) {
            const chat = getFromStorage('db_chat', []);
            const newMessage = {
                id: generateId(),
                username,
                message,
                time: new Date().toISOString()
            };
            chat.push(newMessage);
            
            // Keep only last 100 messages
            if (chat.length > 100) chat.shift();
            
            saveToStorage('db_chat', chat);
            DB.broadcast('chat_updated', { message: newMessage });
            return newMessage;
        },
        
        delete(messageId) {
            let chat = getFromStorage('db_chat', []);
            chat = chat.filter(m => m.id !== messageId);
            saveToStorage('db_chat', chat);
            return true;
        },
        
        clear() {
            saveToStorage('db_chat', []);
            DB.logs.add('chat_cleared', 'admin', 'All chat messages cleared');
            return true;
        }
    },
    
    // TOPUP OPERATIONS
    topup: {
        getAll() {
            return getFromStorage('db_topup', []);
        },
        
        create(username, type, amount, price) {
            const topups = getFromStorage('db_topup', []);
            const newTopup = {
                id: generateId(),
                username,
                type,
                amount,
                price,
                status: 'pending',
                time: new Date().toISOString(),
                processedAt: null,
                reason: null
            };
            topups.push(newTopup);
            saveToStorage('db_topup', topups);
            
            // Add notification to user
            DB.notifications.add(username, 'topup_request', `Permintaan top up ${amount} ${type} sedang diproses`);
            
            DB.logs.add('topup_requested', username, `${amount} ${type}`);
            DB.broadcast('topup_requested', { username, topup: newTopup });
            return newTopup;
        },
        
        approve(topupId) {
            const topups = getFromStorage('db_topup', []);
            const topup = topups.find(t => t.id === topupId);
            if (!topup || topup.status !== 'pending') return false;
            
            topup.status = 'approved';
            topup.processedAt = new Date().toISOString();
            
            // Add resources to user
            const user = DB.users.get(topup.username);
            if (user) {
                if (topup.type === 'coins') {
                    user.coins += topup.amount;
                } else if (topup.type === 'gems') {
                    user.gems += topup.amount;
                } else if (topup.type === 'package' && topup.amount === 'sultan') {
                    user.coins += 5000;
                    user.gems += 1000;
                }
                DB.users.update(topup.username, { coins: user.coins, gems: user.gems });
                DB.notifications.add(topup.username, 'topup_approved', `Top up ${topup.amount} ${topup.type} telah disetujui!`);
            }
            
            saveToStorage('db_topup', topups);
            DB.logs.add('topup_approved', topup.username, `${topup.amount} ${topup.type}`);
            DB.broadcast('topup_approved', { username: topup.username, topup });
            return true;
        },
        
        reject(topupId, reason) {
            const topups = getFromStorage('db_topup', []);
            const topup = topups.find(t => t.id === topupId);
            if (!topup || topup.status !== 'pending') return false;
            
            topup.status = 'rejected';
            topup.reason = reason;
            topup.processedAt = new Date().toISOString();
            
            DB.notifications.add(topup.username, 'topup_rejected', `Top up ditolak. Alasan: ${reason}`);
            
            saveToStorage('db_topup', topups);
            DB.logs.add('topup_rejected', topup.username, `Reason: ${reason}`);
            return true;
        },
        
        getByUser(username) {
            return this.getAll().filter(t => t.username === username);
        }
    },
    
    // NOTIFICATIONS OPERATIONS
    notifications: {
        add(username, type, message) {
            const user = DB.users.get(username);
            if (!user) return false;
            
            if (!user.notifications) user.notifications = [];
            user.notifications.push({
                id: generateId(),
                type,
                message,
                time: new Date().toISOString(),
                read: false
            });
            
            // Keep only last 50 notifications
            if (user.notifications.length > 50) {
                user.notifications = user.notifications.slice(-50);
            }
            
            DB.users.update(username, { notifications: user.notifications });
            return true;
        },
        
        markAsRead(username, notifId) {
            const user = DB.users.get(username);
            if (!user || !user.notifications) return false;
            
            const notif = user.notifications.find(n => n.id === notifId);
            if (notif) {
                notif.read = true;
                DB.users.update(username, { notifications: user.notifications });
            }
            return true;
        },
        
        markAllAsRead(username) {
            const user = DB.users.get(username);
            if (!user || !user.notifications) return false;
            
            user.notifications.forEach(n => n.read = true);
            DB.users.update(username, { notifications: user.notifications });
            return true;
        }
    },
    
    // PASSWORD RESET OPERATIONS
    passwordReset: {
        getAll() {
            return getFromStorage('db_passwordResets', []);
        },
        
        create(username, email) {
            const resets = getFromStorage('db_passwordResets', []);
            
            // Check if already has pending request
            const existing = resets.find(r => r.username === username && r.status === 'pending');
            if (existing) return null;
            
            const newReset = {
                id: generateId(),
                username,
                email,
                status: 'pending',
                time: new Date().toISOString(),
                processedAt: null,
                newPassword: null
            };
            resets.push(newReset);
            saveToStorage('db_passwordResets', resets);
            
            DB.logs.add('password_reset_requested', username, 'Password reset requested');
            DB.broadcast('password_reset_requested', { username, email });
            return newReset;
        },
        
        process(resetId, newPassword) {
            const resets = getFromStorage('db_passwordResets', []);
            const reset = resets.find(r => r.id === resetId);
            if (!reset || reset.status !== 'pending') return false;
            
            reset.status = 'processed';
            reset.newPassword = newPassword;
            reset.processedAt = new Date().toISOString();
            
            // Update user password
            DB.users.update(reset.username, { password: newPassword });
            DB.notifications.add(reset.username, 'password_reset', 'Password kamu telah direset oleh admin.');
            
            saveToStorage('db_passwordResets', resets);
            DB.logs.add('password_reset_processed', reset.username, 'Password reset processed');
            return true;
        }
    },
    
    // ADMIN LOGS
    logs: {
        getAll() {
            return getFromStorage('db_adminLogs', []);
        },
        
        add(action, target, details) {
            const logs = getFromStorage('db_adminLogs', []);
            logs.push({
                id: generateId(),
                action,
                target,
                details,
                time: new Date().toISOString(),
                admin: 'admin'
            });
            
            // Keep only last 100 logs
            if (logs.length > 100) logs.shift();
            
            saveToStorage('db_adminLogs', logs);
        }
    },
    
    // SETTINGS OPERATIONS
    settings: {
        get() {
            return getFromStorage('db_settings', {});
        },
        
        update(newSettings) {
            const settings = getFromStorage('db_settings', {});
            saveToStorage('db_settings', { ...settings, ...newSettings });
            DB.broadcast('settings_updated', { settings: newSettings });
            return true;
        }
    },
    
    // BROADCAST untuk sync antar tab
    broadcast(type, data) {
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'db_broadcast',
            newValue: JSON.stringify({ type, data, timestamp: Date.now() })
        }));
    },
    
    // Listen untuk broadcast
    listen(callback) {
        window.addEventListener('storage', (e) => {
            if (e.key === 'db_broadcast') {
                try {
                    const event = JSON.parse(e.newValue);
                    callback(event.type, event.data);
                } catch (err) {
                    console.error('Error parsing broadcast:', err);
                }
            }
        });
    },
    
    // Update related data when username changes
    updateRelatedDataUsername(oldUsername, newUsername) {
        // Update topups
        const topups = getFromStorage('db_topup', []);
        topups.forEach(t => {
            if (t.username === oldUsername) t.username = newUsername;
        });
        saveToStorage('db_topup', topups);
        
        // Update chat
        const chat = getFromStorage('db_chat', []);
        chat.forEach(c => {
            if (c.username === oldUsername) c.username = newUsername;
        });
        saveToStorage('db_chat', chat);
        
        // Update password resets
        const resets = getFromStorage('db_passwordResets', []);
        resets.forEach(r => {
            if (r.username === oldUsername) r.username = newUsername;
        });
        saveToStorage('db_passwordResets', resets);
    },
    
    // EXPORT / IMPORT untuk backup
    export() {
        return {
            users: getFromStorage('db_users', {}),
            chat: getFromStorage('db_chat', []),
            topup: getFromStorage('db_topup', []),
            settings: getFromStorage('db_settings', {}),
            passwordResets: getFromStorage('db_passwordResets', []),
            adminLogs: getFromStorage('db_adminLogs', [])
        };
    },
    
    import(data) {
        if (data.users) saveToStorage('db_users', data.users);
        if (data.chat) saveToStorage('db_chat', data.chat);
        if (data.topup) saveToStorage('db_topup', data.topup);
        if (data.settings) saveToStorage('db_settings', data.settings);
        if (data.passwordResets) saveToStorage('db_passwordResets', data.passwordResets);
        if (data.adminLogs) saveToStorage('db_adminLogs', data.adminLogs);
    },
    
    // RESET ALL DATA
    reset() {
        localStorage.removeItem('db_users');
        localStorage.removeItem('db_chat');
        localStorage.removeItem('db_topup');
        localStorage.removeItem('db_settings');
        localStorage.removeItem('db_passwordResets');
        localStorage.removeItem('db_adminLogs');
        this.init();
    }
};

// Initialize on load
DB.init();

// Export for global access
window.DB = DB;
