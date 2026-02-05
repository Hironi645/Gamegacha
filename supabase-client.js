/**
 * SUPABASE CLIENT - Emoji Battle Gacha
 * Real-time Database Configuration
 */

// ========================================
// SUPABASE CONFIGURATION
// ========================================

// GANTI DENGAN ANON KEY ANDA!
const SUPABASE_URL = 'https://aadhzahxymstejehgzjp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZGh6YWh4eW1zdGVqZWhnempwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTYwODUsImV4cCI6MjA4NTgzMjA4NX0.fqgNc13UjPYprjSJMk2h0O6pN1Dum9yUjhiDdUqh9OY'; // <-- GANTI INI!

// Initialize Supabase client
let supabase = null;

try {
    if (typeof supabaseJs !== 'undefined') {
        supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.error('Supabase initialization failed:', e);
}

// ========================================
// DATABASE SETUP
// ========================================
// NOTE: Run the SQL in database-schema.sql file in Supabase SQL Editor

// ========================================
// SUPABASE DATABASE OPERATIONS
// ========================================

const SupaDB = {
    // Check if Supabase is connected
    isConnected() {
        return supabase !== null;
    },

    // ========================================
    // USER OPERATIONS
    // ========================================
    
    async getAllUsers() {
        if (!this.isConnected()) return {};
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error getting users:', error);
            return {};
        }
        
        const users = {};
        data.forEach(user => {
            users[user.username] = this.formatUser(user);
        });
        return users;
    },
    
    async getUser(username) {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        
        if (error || !data) return null;
        return this.formatUser(data);
    },
    
    async createUser(username, email, password) {
        if (!this.isConnected()) return false;
        
        // Get settings for starting resources
        const settings = await this.getGameSettings();
        const startingResources = settings?.starting_resources || { coins: 1000, gems: 100 };
        
        const { data, error } = await supabase
            .from('users')
            .insert([{
                username,
                email,
                password,
                coins: startingResources.coins,
                gems: startingResources.gems,
                cards: [],
                activities: [],
                notifications: [],
                warnings: []
            }]);
        
        if (error) {
            console.error('Error creating user:', error);
            return false;
        }
        
        await this.addAdminLog('user_created', username, 'User registered');
        return true;
    },
    
    async updateUser(username, updates) {
        if (!this.isConnected()) return false;
        
        // Format updates for Supabase
        const formattedUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            formattedUpdates[snakeKey] = value;
        }
        formattedUpdates.last_active = new Date().toISOString();
        
        const { error } = await supabase
            .from('users')
            .update(formattedUpdates)
            .eq('username', username);
        
        if (error) {
            console.error('Error updating user:', error);
            return false;
        }
        
        return true;
    },
    
    async deleteUser(username) {
        if (!this.isConnected()) return false;
        
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('username', username);
        
        if (error) {
            console.error('Error deleting user:', error);
            return false;
        }
        
        await this.addAdminLog('user_deleted', username, 'User deleted');
        return true;
    },
    
    async changeUsername(oldUsername, newUsername) {
        if (!this.isConnected()) return false;
        
        // Check if new username exists
        const existing = await this.getUser(newUsername);
        if (existing) return false;
        
        const { error } = await supabase
            .from('users')
            .update({ username: newUsername })
            .eq('username', oldUsername);
        
        if (error) {
            console.error('Error changing username:', error);
            return false;
        }
        
        // Update related records
        await supabase.from('chat_messages').update({ username: newUsername }).eq('username', oldUsername);
        await supabase.from('topup_requests').update({ username: newUsername }).eq('username', oldUsername);
        await supabase.from('password_resets').update({ username: newUsername }).eq('username', oldUsername);
        
        await this.addAdminLog('username_changed', `${oldUsername} -> ${newUsername}`, 'Username changed');
        return true;
    },
    
    async authenticateUser(username, password) {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error || !data) return null;
        
        // Update last login
        await this.updateUser(username, { lastLogin: new Date().toISOString(), isOnline: true });
        
        return this.formatUser(data);
    },
    
    formatUser(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            coins: user.coins,
            gems: user.gems,
            cards: user.cards || [],
            wins: user.wins,
            losses: user.losses,
            winStreak: user.win_streak,
            pvpWins: user.pvp_wins,
            pvpPoints: user.pvp_points,
            starterPackClaimed: user.starter_pack_claimed,
            activities: user.activities || [],
            notifications: user.notifications || [],
            status: user.status,
            statusReason: user.status_reason,
            vipLevel: user.vip_level,
            passType: user.pass_type,
            warnings: user.warnings || [],
            createdAt: user.created_at,
            lastLogin: user.last_login,
            isOnline: user.is_online,
            lastActive: user.last_active
        };
    },

    // ========================================
    // CHAT OPERATIONS
    // ========================================
    
    async getChatMessages(limit = 50) {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(limit);
        
        if (error) {
            console.error('Error getting chat:', error);
            return [];
        }
        
        return data.map(msg => ({
            id: msg.id,
            username: msg.username,
            message: msg.message,
            time: msg.created_at
        }));
    },
    
    async sendChatMessage(username, message) {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('chat_messages')
            .insert([{ username, message }]);
        
        if (error) {
            console.error('Error sending chat:', error);
            return null;
        }
        
        return data;
    },
    
    async deleteChatMessage(messageId) {
        if (!this.isConnected()) return false;
        
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', messageId);
        
        return !error;
    },
    
    async clearAllChat() {
        if (!this.isConnected()) return false;
        
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (!error) {
            await this.addAdminLog('chat_cleared', 'admin', 'All chat messages cleared');
        }
        
        return !error;
    },

    // ========================================
    // TOPUP OPERATIONS
    // ========================================
    
    async getAllTopups() {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('topup_requests')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error getting topups:', error);
            return [];
        }
        
        return data.map(t => ({
            id: t.id,
            username: t.username,
            type: t.type,
            amount: t.amount,
            price: t.price,
            status: t.status,
            reason: t.reason,
            time: t.created_at,
            processedAt: t.processed_at
        }));
    },
    
    async getUserTopups(username) {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('username', username)
            .order('created_at', { ascending: false });
        
        if (error) return [];
        
        return data.map(t => ({
            id: t.id,
            username: t.username,
            type: t.type,
            amount: t.amount,
            price: t.price,
            status: t.status,
            reason: t.reason,
            time: t.created_at,
            processedAt: t.processed_at
        }));
    },
    
    async createTopup(username, type, amount, price) {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('topup_requests')
            .insert([{ username, type, amount, price }]);
        
        if (error) {
            console.error('Error creating topup:', error);
            return null;
        }
        
        await this.addNotification(username, 'topup_request', `Permintaan top up ${amount} ${type} sedang diproses`);
        await this.addAdminLog('topup_requested', username, `${amount} ${type}`);
        
        return data;
    },
    
    async approveTopup(topupId) {
        if (!this.isConnected()) return false;
        
        // Get topup details
        const { data: topup } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('id', topupId)
            .single();
        
        if (!topup) return false;
        
        // Get user
        const user = await this.getUser(topup.username);
        if (!user) return false;
        
        // Update user resources
        let updates = {};
        if (topup.type === 'coins') {
            updates.coins = user.coins + topup.amount;
        } else if (topup.type === 'gems') {
            updates.gems = user.gems + topup.amount;
        } else if (topup.type === 'package' && topup.amount === 'sultan') {
            updates.coins = user.coins + 5000;
            updates.gems = user.gems + 1000;
        }
        
        await this.updateUser(topup.username, updates);
        
        // Update topup status
        const { error } = await supabase
            .from('topup_requests')
            .update({ status: 'approved', processed_at: new Date().toISOString() })
            .eq('id', topupId);
        
        if (error) return false;
        
        await this.addNotification(topup.username, 'topup_approved', `Top up ${topup.amount} ${topup.type} telah disetujui!`);
        await this.addAdminLog('topup_approved', topup.username, `${topup.amount} ${topup.type}`);
        
        return true;
    },
    
    async rejectTopup(topupId, reason) {
        if (!this.isConnected()) return false;
        
        const { data: topup } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('id', topupId)
            .single();
        
        if (!topup) return false;
        
        const { error } = await supabase
            .from('topup_requests')
            .update({ status: 'rejected', reason, processed_at: new Date().toISOString() })
            .eq('id', topupId);
        
        if (error) return false;
        
        await this.addNotification(topup.username, 'topup_rejected', `Top up ditolak. Alasan: ${reason}`);
        await this.addAdminLog('topup_rejected', topup.username, `Reason: ${reason}`);
        
        return true;
    },

    // ========================================
    // PASSWORD RESET OPERATIONS
    // ========================================
    
    async getAllPasswordResets() {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('password_resets')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error getting password resets:', error);
            return [];
        }
        
        return data.map(r => ({
            id: r.id,
            username: r.username,
            email: r.email,
            status: r.status,
            newPassword: r.new_password,
            time: r.created_at,
            processedAt: r.processed_at
        }));
    },
    
    async createPasswordReset(username, email) {
        if (!this.isConnected()) return null;
        
        // Check if pending request exists
        const { data: existing } = await supabase
            .from('password_resets')
            .select('*')
            .eq('username', username)
            .eq('status', 'pending')
            .single();
        
        if (existing) return null;
        
        const { data, error } = await supabase
            .from('password_resets')
            .insert([{ username, email }]);
        
        if (error) {
            console.error('Error creating password reset:', error);
            return null;
        }
        
        await this.addAdminLog('password_reset_requested', username, 'Password reset requested');
        
        return data;
    },
    
    async processPasswordReset(resetId, newPassword) {
        if (!this.isConnected()) return false;
        
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('id', resetId)
            .single();
        
        if (!reset) return false;
        
        // Update user password
        await this.updateUser(reset.username, { password: newPassword });
        
        // Update reset status
        const { error } = await supabase
            .from('password_resets')
            .update({ 
                status: 'processed', 
                new_password: newPassword,
                processed_at: new Date().toISOString() 
            })
            .eq('id', resetId);
        
        if (error) return false;
        
        await this.addNotification(reset.username, 'password_reset', 'Password kamu telah direset oleh admin.');
        await this.addAdminLog('password_reset_processed', reset.username, 'Password reset processed');
        
        return true;
    },

    // ========================================
    // NOTIFICATIONS
    // ========================================
    
    async addNotification(username, type, message) {
        if (!this.isConnected()) return false;
        
        const user = await this.getUser(username);
        if (!user) return false;
        
        const notifications = user.notifications || [];
        notifications.push({
            id: generateId(),
            type,
            message,
            time: new Date().toISOString(),
            read: false
        });
        
        // Keep only last 50
        if (notifications.length > 50) {
            notifications.shift();
        }
        
        return await this.updateUser(username, { notifications });
    },
    
    async markNotificationsAsRead(username) {
        if (!this.isConnected()) return false;
        
        const user = await this.getUser(username);
        if (!user || !user.notifications) return false;
        
        const notifications = user.notifications.map(n => ({ ...n, read: true }));
        return await this.updateUser(username, { notifications });
    },

    // ========================================
    // ADMIN LOGS
    // ========================================
    
    async addAdminLog(action, target, details) {
        if (!this.isConnected()) return;
        
        await supabase
            .from('admin_logs')
            .insert([{ action, target, details }]);
    },
    
    async getAdminLogs(limit = 100) {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) return [];
        
        return data.map(log => ({
            id: log.id,
            action: log.action,
            target: log.target,
            details: log.details,
            admin: log.admin,
            time: log.created_at
        }));
    },

    // ========================================
    // GAME SETTINGS
    // ========================================
    
    async getGameSettings() {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('game_settings')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error || !data) return null;
        
        return {
            gachaRates: data.gacha_rates,
            startingResources: data.starting_resources,
            battleRewards: data.battle_rewards,
            shopPrices: data.shop_prices,
            topupPrices: data.topup_prices,
            starterPack: data.starter_pack
        };
    },
    
    async updateGameSettings(settings) {
        if (!this.isConnected()) return false;
        
        const formattedSettings = {};
        for (const [key, value] of Object.entries(settings)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            formattedSettings[snakeKey] = value;
        }
        formattedSettings.updated_at = new Date().toISOString();
        
        const { error } = await supabase
            .from('game_settings')
            .update(formattedSettings)
            .eq('id', 1);
        
        return !error;
    },

    // ========================================
    // PAYMENT SETTINGS
    // ========================================
    
    async getPaymentSettings() {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('payment_settings')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error || !data) return null;
        
        return {
            bankName: data.bank_name,
            accountNumber: data.account_number,
            accountName: data.account_name,
            paymentMethods: data.payment_methods,
            topupPackages: data.topup_packages
        };
    },
    
    async updatePaymentSettings(settings) {
        if (!this.isConnected()) return false;
        
        const formattedSettings = {};
        for (const [key, value] of Object.entries(settings)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            formattedSettings[snakeKey] = value;
        }
        formattedSettings.updated_at = new Date().toISOString();
        
        const { error } = await supabase
            .from('payment_settings')
            .update(formattedSettings)
            .eq('id', 1);
        
        return !error;
    },

    // ========================================
    // PvP BATTLES (REAL-TIME)
    // ========================================
    
    async createPvPBattle(username, card) {
        if (!this.isConnected()) return null;
        
        const { data, error } = await supabase
            .from('pvp_battles')
            .insert([{
                player1: username,
                player1_card: card,
                player1_hp: card.hp,
                status: 'waiting'
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Error creating PvP battle:', error);
            return null;
        }
        
        return data;
    },
    
    async joinPvPBattle(battleId, username, card) {
        if (!this.isConnected()) return false;
        
        const { error } = await supabase
            .from('pvp_battles')
            .update({
                player2: username,
                player2_card: card,
                player2_hp: card.hp,
                status: 'active',
                current_turn: username,
                updated_at: new Date().toISOString()
            })
            .eq('id', battleId)
            .eq('status', 'waiting');
        
        return !error;
    },
    
    async getActivePvPBattles() {
        if (!this.isConnected()) return [];
        
        const { data, error } = await supabase
            .from('pvp_battles')
            .select('*')
            .in('status', ['waiting', 'active'])
            .order('created_at', { ascending: false });
        
        if (error) return [];
        return data;
    },
    
    async updatePvPBattle(battleId, updates) {
        if (!this.isConnected()) return false;
        
        const formattedUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            formattedUpdates[snakeKey] = value;
        }
        formattedUpdates.updated_at = new Date().toISOString();
        
        const { error } = await supabase
            .from('pvp_battles')
            .update(formattedUpdates)
            .eq('id', battleId);
        
        return !error;
    },
    
    // Subscribe to PvP battle updates
    subscribeToPvPBattle(battleId, callback) {
        if (!this.isConnected()) return null;
        
        return supabase
            .channel(`pvp_battle_${battleId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'pvp_battles',
                filter: `id=eq.${battleId}`
            }, callback)
            .subscribe();
    },

    // ========================================
    // REAL-TIME SUBSCRIPTIONS
    // ========================================
    
    subscribeToUsers(callback) {
        if (!this.isConnected()) return null;
        
        return supabase
            .channel('users_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'users'
            }, callback)
            .subscribe();
    },
    
    subscribeToChat(callback) {
        if (!this.isConnected()) return null;
        
        return supabase
            .channel('chat_changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages'
            }, callback)
            .subscribe();
    },
    
    subscribeToTopups(callback) {
        if (!this.isConnected()) return null;
        
        return supabase
            .channel('topup_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'topup_requests'
            }, callback)
            .subscribe();
    },
    
    subscribeToPasswordResets(callback) {
        if (!this.isConnected()) return null;
        
        return supabase
            .channel('password_reset_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'password_resets'
            }, callback)
            .subscribe();
    },
    
    unsubscribe(channel) {
        if (channel && supabase) {
            supabase.removeChannel(channel);
        }
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Export for global access
window.SupaDB = SupaDB;
window.supabase = supabase;
