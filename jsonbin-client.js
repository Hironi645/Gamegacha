/**
 * JSONBIN.IO CLIENT - Emoji Battle Gacha
 * Version 2.1 - Fixed Connection Issues
 */

const JSONBIN_CONFIG = {
    apiKey: '$2a$10$YMA/Z8JwPGoowCYYwDqK3ugpbCqXjvcwlmGyXGxr9tW1gsh8aFgjm',
    baseUrl: 'https://api.jsonbin.io/v3',
};

let isConnected = false;
let binIds = {};
let cacheData = null;

// ========================================
// IMPROVED INITIALIZATION
// ========================================

async function checkConnection() {
    try {
        // Gunakan endpoint collections untuk cek koneksi
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/c`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });
        
        if (response.ok) {
            console.log('✅ API Key valid');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ JSONBin Error:', error.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
        return false;
    }
}

function initBinIds() {
    const saved = localStorage.getItem('jsonbin_bin_ids_v2');
    if (saved) {
        try {
            binIds = JSON.parse(saved);
        } catch (e) {
            console.warn('Invalid bin IDs in localStorage');
            binIds = {};
        }
    }
}

function saveBinIds() {
    localStorage.setItem('jsonbin_bin_ids_v2', JSON.stringify(binIds));
}

function getDefaultData() {
    return {
        users: {},
        chat: [],
        topups: {},
        passwordResets: {},
        settings: {
            game: null,
            payment: null,
            vip: null
        },
        adminLogs: []
    };
}

// ========================================
// BIN OPERATIONS
// ========================================

async function createBin(name, data) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b`, {
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
            console.log(`✅ Bin "${name}" created:`, result.metadata.id);
            return result.metadata.id;
        } else {
            const error = await response.text();
            console.error('❌ Failed to create bin:', error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error creating bin:', error);
        return null;
    }
}

async function getBin(binId) {
    if (!binId) return null;
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.record;
        } else {
            console.warn(`⚠️ Failed to get bin ${binId}:`, response.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting bin:', error);
        return null;
    }
}

async function updateBin(binId, data) {
    if (!binId) return false;
    
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            },
            body: JSON.stringify(data)
        });
        
        return response.ok;
    } catch (error) {
        console.error('❌ Error updating bin:', error);
        return false;
    }
}

// ========================================
// INITIALIZATION SEQUENCE
// ========================================

async function initializeBins() {
    const defaultData = getDefaultData();
    let createdAny = false;
    
    // Buat bins jika belum ada
    const binsToCreate = [
        { key: 'users', name: 'users', data: defaultData.users },
        { key: 'chat', name: 'chat', data: defaultData.chat },
        { key: 'topups', name: 'topups', data: defaultData.topups },
        { key: 'passwordResets', name: 'passwordResets', data: defaultData.passwordResets },
        { key: 'settings', name: 'settings', data: defaultData.settings },
        { key: 'adminLogs', name: 'adminLogs', data: defaultData.adminLogs }
    ];
    
    for (const bin of binsToCreate) {
        if (!binIds[bin.key]) {
            const id = await createBin(bin.name, bin.data);
            if (id) {
                binIds[bin.key] = id;
                createdAny = true;
            }
        }
    }
    
    if (createdAny) {
        saveBinIds();
    }
    
    return createdAny;
}

async function syncFromCloud() {
    if (!isConnected) return false;
    
    try {
        const results = await Promise.allSettled([
            getBin(binIds.users),
            getBin(binIds.chat),
            getBin(binIds.topups),
            getBin(binIds.passwordResets),
            getBin(binIds.settings),
            getBin(binIds.adminLogs)
        ]);
        
        const [users, chat, topups, passwordResets, settings, adminLogs] = results;
        
        if (!cacheData) cacheData = getDefaultData();
        
        if (users.status === 'fulfilled' && users.value) cacheData.users = users.value;
        if (chat.status === 'fulfilled' && chat.value) cacheData.chat = chat.value;
        if (topups.status === 'fulfilled' && topups.value) cacheData.topups = topups.value;
        if (passwordResets.status === 'fulfilled' && passwordResets.value) cacheData.passwordResets = passwordResets.value;
        if (settings.status === 'fulfilled' && settings.value) cacheData.settings = settings.value;
        if (adminLogs.status === 'fulfilled' && adminLogs.value) cacheData.adminLogs = adminLogs.value;
        
        console.log('✅ Sync from cloud complete');
        return true;
    } catch (error) {
        console.error('❌ Sync error:', error);
        return false;
    }
}

async function initJsonBin() {
    console.log('🔄 Initializing JSONBin...');
    initBinIds();
    
    // Step 1: Check connection
    isConnected = await checkConnection();
    
    if (!isConnected) {
        console.warn('⚠️ JSONBin.io not connected. Using offline mode.');
        // Initialize cache dengan data default jika belum ada
        if (!cacheData) {
            cacheData = getDefaultData();
        }
        return false;
    }
    
    console.log('✅ Connected to JSONBin.io');
    
    // Step 2: Initialize bins
    await initializeBins();
    
    // Step 3: Sync data
    await syncFromCloud();
    
    // Step 4: Start auto-sync
    startAutoSync();
    
    return true;
}

// ========================================
// AUTO SYNC
// ========================================

let syncInterval = null;

function startAutoSync() {
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(syncFromCloud, 5000);
    console.log('🔄 Auto-sync started (5s interval)');
}

function stopAutoSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}

// ========================================
// DATABASE API
// ========================================

const JsonBinDB = {
    isConnected: () => isConnected,
    
    init: initJsonBin,
    
    // User operations
    getUser: async function(username) {
        await syncFromCloud();
        return cacheData?.users?.[username] || null;
    },
    
    getUserByEmail: async function(email) {
        await syncFromCloud();
        if (!cacheData?.users) return null;
        return Object.values(cacheData.users).find(u => u.email === email) || null;
    },
    
    getAllUsers: async function() {
        await syncFromCloud();
        return cacheData?.users ? Object.values(cacheData.users) : [];
    },
    
    createUser: async function(username, email, password) {
        if (!cacheData) cacheData = getDefaultData();
        if (cacheData.users[username]) return false;
        
        cacheData.users[username] = {
            username, email, password,
            coins: 1000, gems: 100, cards: [],
            wins: 0, losses: 0, win_streak: 0,
            pvp_wins: 0, pvp_points: 0, vip_level: 0,
            pass_type: 'none', status: 'active',
            status_reason: '', activities: [],
            notifications: [], warnings: [],
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
        };
        
        if (isConnected) {
            await updateBin(binIds.users, cacheData.users);
        }
        return true;
    },
    
    // ... tambahkan operasi lainnya sesuai kebutuhan
    
    forceSync: syncFromCloud
};

const SupaDB = JsonBinDB;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JsonBinDB, SupaDB };
}

// Auto-init
initJsonBin();
