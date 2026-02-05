/**
 * SUPABASE CLIENT - Emoji Battle Gacha
 * Database configuration and API functions
 * Version 2.0 - Clean & Optimized
 */

// ========================================
// CONFIGURATION
// ========================================

const SUPABASE_URL = 'https://aadhzahxymstejehgzjp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZGh6YWh4eW1zdGVqZWhnempwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTYwODUsImV4cCI6MjA4NTgzMjA4NX0.fqgNc13UjPYprjSJMk2h0O6pN1Dum9yUjhiDdUqh9OY';

// ========================================
// INITIALIZE SUPABASE
// ========================================

let supabase = null;

function initSupabase() {
    if (typeof supabaseJs === 'undefined') {
        console.error('Supabase library not loaded');
        return false;
    }
    
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZGh6YWh4eW1zdGVqZWhnempwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTYwODUsImV4cCI6MjA4NTgzMjA4NX0.fqgNc13UjPYprjSJMk2h0O6pN1Dum9yUjhiDdUqh9OY') {
        console.warn('Supabase anon key not configured');
        return false;
    }
    
    try {
        supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return false;
    }
}

// ========================================
// DATABASE API
// ========================================

const SupaDB = {
    isConnected() {
        return supabase !== null;
    },

    // ========== USERS ==========
    
    async getUser(username) {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        return error ? null : data;
    },

    async getUserByEmail(email) {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        return error ? null : data;
    },

    async getAllUsers() {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('users')
            .select('*');
        return error ? [] : data;
    },

    async createUser(username, email, password) {
        if (!this.isConnected()) return false;
        
        const { error } = await supabase.from('users').insert({
            username,
            email,
            password,
            coins: 1000,
            gems: 100,
            cards: [],
            wins: 0,
            losses: 0,
            win_streak: 0,
            pvp_wins: 0,
            pvp_points: 0,
            starter_pack_claimed: false,
            activities: [],
            notifications: [],
            status: 'active',
            status_reason: '',
            vip_level: 0,
            pass_type: 'none',
            warnings: [],
            is_online: true,
            last_active: new Date().toISOString()
        });
        
        return !error;
    },

    async updateUser(username, updates) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('username', username);
        return !error;
    },

    async deleteUser(username) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('username', username);
        return !error;
    },

    async authenticateUser(username, password) {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (data) {
            await this.updateUser(username, { 
                last_login: new Date().toISOString(),
                is_online: true 
            });
        }
        
        return error ? null : data;
    },

    async changeUsername(oldUsername, newUsername) {
        if (!this.isConnected()) return false;
        
        const existing = await this.getUser(newUsername);
        if (existing) return false;
        
        const { error } = await supabase
            .from('users')
            .update({ username: newUsername })
            .eq('username', oldUsername);
        
        return !error;
    },

    // ========== CHAT ==========
    
    async getChatMessages(limit = 100) {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        return error ? [] : data.reverse();
    },

    async sendChatMessage(username, message) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('chat_messages')
            .insert({ username, message });
        return !error;
    },

    async clearAllChat() {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        return !error;
    },

    // ========== TOPUP ==========
    
    async createTopupRequest(username, type, amount, price) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('topup_requests')
            .insert({ username, type, amount, price, status: 'pending' });
        return !error;
    },

    async getAllTopups() {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('topup_requests')
            .select('*')
            .order('created_at', { ascending: false });
        return error ? [] : data;
    },

    async getUserTopups(username) {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('username', username)
            .order('created_at', { ascending: false });
        return error ? [] : data;
    },

    async approveTopup(id) {
        if (!this.isConnected()) return false;
        
        const { data: topup } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('id', id)
            .single();
        
        if (!topup) return false;
        
        const user = await this.getUser(topup.username);
        if (!user) return false;
        
        let updates = {};
        if (topup.type === 'coins') {
            updates.coins = (user.coins || 0) + topup.amount;
        } else if (topup.type === 'gems') {
            updates.gems = (user.gems || 0) + topup.amount;
        } else if (topup.type === 'package') {
            updates.coins = (user.coins || 0) + 5000;
            updates.gems = (user.gems || 0) + 1000;
        }
        
        await this.updateUser(topup.username, updates);
        await this.addNotification(topup.username, 'topup_approved', `Top up ${topup.amount} ${topup.type} telah disetujui!`);
        
        const { error } = await supabase
            .from('topup_requests')
            .update({ 
                status: 'approved', 
                processed_at: new Date().toISOString() 
            })
            .eq('id', id);
        
        return !error;
    },

    async rejectTopup(id, reason) {
        if (!this.isConnected()) return false;
        
        const { data: topup } = await supabase
            .from('topup_requests')
            .select('*')
            .eq('id', id)
            .single();
        
        if (topup) {
            await this.addNotification(topup.username, 'topup_rejected', `Top up ditolak. Alasan: ${reason}`);
        }
        
        const { error } = await supabase
            .from('topup_requests')
            .update({ 
                status: 'rejected', 
                reason,
                processed_at: new Date().toISOString() 
            })
            .eq('id', id);
        
        return !error;
    },

    // ========== PASSWORD RESET ==========
    
    async createPasswordReset(username, email) {
        if (!this.isConnected()) return false;
        
        const { data: existing } = await supabase
            .from('password_resets')
            .select('*')
            .eq('username', username)
            .eq('status', 'pending')
            .single();
        
        if (existing) return false;
        
        const { error } = await supabase
            .from('password_resets')
            .insert({ username, email, status: 'pending' });
        
        return !error;
    },

    async getAllPasswordResets() {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('password_resets')
            .select('*')
            .order('created_at', { ascending: false });
        return error ? [] : data;
    },

    async processPasswordReset(id, newPassword) {
        if (!this.isConnected()) return false;
        
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('id', id)
            .single();
        
        if (!reset) return false;
        
        await this.updateUser(reset.username, { password: newPassword });
        await this.addNotification(reset.username, 'password_reset', 'Password kamu telah direset oleh admin.');
        
        const { error } = await supabase
            .from('password_resets')
            .update({ 
                status: 'processed', 
                new_password: newPassword,
                processed_at: new Date().toISOString() 
            })
            .eq('id', id);
        
        return !error;
    },

    // ========== NOTIFICATIONS ==========
    
    async addNotification(username, type, message) {
        if (!this.isConnected()) return false;
        
        const user = await this.getUser(username);
        if (!user) return false;
        
        const notifications = user.notifications || [];
        notifications.push({
            id: Date.now().toString(),
            type,
            message,
            read: false,
            time: new Date().toISOString()
        });
        
        if (notifications.length > 50) notifications.shift();
        
        return await this.updateUser(username, { notifications });
    },

    async markNotificationRead(username, notifId) {
        if (!this.isConnected()) return false;
        
        const user = await this.getUser(username);
        if (!user) return false;
        
        const notifications = user.notifications || [];
        const notif = notifications.find(n => n.id === notifId);
        if (notif) notif.read = true;
        
        return await this.updateUser(username, { notifications });
    },

    async clearNotifications(username) {
        if (!this.isConnected()) return false;
        return await this.updateUser(username, { notifications: [] });
    },

    // ========== ADMIN LOGS ==========
    
    async addAdminLog(action, target, details = '') {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('admin_logs')
            .insert({ action, target, details });
        return !error;
    },

    async getAdminLogs(limit = 100) {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        return error ? [] : data;
    },

    // ========== GAME SETTINGS ==========
    
    async getGameSettings() {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('game_settings')
            .select('*')
            .eq('id', 1)
            .single();
        return error ? null : data;
    },

    async updateGameSettings(updates) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('game_settings')
            .update(updates)
            .eq('id', 1);
        return !error;
    },

    // ========== PAYMENT SETTINGS ==========
    
    async getPaymentSettings() {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('payment_settings')
            .select('*')
            .eq('id', 1)
            .single();
        return error ? null : data;
    },

    async updatePaymentSettings(updates) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('payment_settings')
            .update(updates)
            .eq('id', 1);
        return !error;
    },

    // ========== PVP BATTLES ==========
    
    async createPvPBattle(player1, player1Card) {
        if (!this.isConnected()) return null;
        const { data, error } = await supabase
            .from('pvp_battles')
            .insert({
                player1,
                player1_card: player1Card,
                status: 'waiting',
                player1_hp: player1Card.hp,
                battle_log: []
            })
            .select()
            .single();
        return error ? null : data;
    },

    async joinPvPBattle(battleId, player2, player2Card) {
        if (!this.isConnected()) return false;
        const { error } = await supabase
            .from('pvp_battles')
            .update({
                player2,
                player2_card: player2Card,
                status: 'active',
                player2_hp: player2Card.hp,
                current_turn: player2
            })
            .eq('id', battleId);
        return !error;
    },

    async getActivePvPBattles() {
        if (!this.isConnected()) return [];
        const { data, error } = await supabase
            .from('pvp_battles')
            .select('*')
            .in('status', ['waiting', 'active']);
        return error ? [] : data;
    },

    // ========== REALTIME SUBSCRIPTIONS ==========
    
    subscribeToChat(callback) {
        if (!this.isConnected()) return null;
        return supabase
            .channel('chat_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'chat_messages' }, 
                callback
            )
            .subscribe();
    },

    subscribeToUsers(callback) {
        if (!this.isConnected()) return null;
        return supabase
            .channel('users_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'users' }, 
                callback
            )
            .subscribe();
    },

    subscribeToTopups(callback) {
        if (!this.isConnected()) return null;
        return supabase
            .channel('topup_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'topup_requests' }, 
                callback
            )
            .subscribe();
    },

    subscribeToPasswordResets(callback) {
        if (!this.isConnected()) return null;
        return supabase
            .channel('password_reset_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'password_resets' }, 
                callback
            )
            .subscribe();
    },

    unsubscribe(channel) {
        if (channel) {
            supabase.removeChannel(channel);
        }
    }
};

// ========================================
// INITIALIZE ON LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initSupabase();
});
