/**
 * SUPABASE CLIENT - Emoji Battle Gacha
 * Real-time Database Configuration
 */

// ========================================
// SUPABASE CONFIGURATION
// ========================================

// GANTI DENGAN ANON KEY ANDA!
const SUPABASE_URL = 'https://aadhzahxymstejehgzjp.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // <-- GANTI INI!

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
// DATABASE SCHEMA (Run this in Supabase SQL Editor)
// ========================================

const SQL_SCHEMA = `
-- Enable Realtime
begin;
  -- Drop existing tables if they exist
  drop table if exists public.admin_logs cascade;
  drop table if exists public.password_resets cascade;
  drop table if exists public.topup_requests cascade;
  drop table if exists public.chat_messages cascade;
  drop table if exists public.pvp_battles cascade;
  drop table if exists public.users cascade;
  drop table if exists public.game_settings cascade;
  drop table if exists public.payment_settings cascade;

  -- Users table
  create table public.users (
    id uuid default gen_random_uuid() primary key,
    username text unique not null,
    email text unique not null,
    password text not null,
    coins integer default 1000,
    gems integer default 100,
    cards jsonb default '[]'::jsonb,
    wins integer default 0,
    losses integer default 0,
    win_streak integer default 0,
    pvp_wins integer default 0,
    pvp_points integer default 0,
    starter_pack_claimed boolean default false,
    activities jsonb default '[]'::jsonb,
    notifications jsonb default '[]'::jsonb,
    status text default 'active',
    status_reason text default '',
    vip_level integer default 0,
    pass_type text default 'none',
    warnings jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    last_login timestamp with time zone default timezone('utc'::text, now()),
    is_online boolean default false,
    last_active timestamp with time zone default timezone('utc'::text, now())
  );

  -- Chat messages table
  create table public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    username text not null references public.users(username) on delete cascade,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Topup requests table
  create table public.topup_requests (
    id uuid default gen_random_uuid() primary key,
    username text not null references public.users(username) on delete cascade,
    type text not null,
    amount integer not null,
    price integer not null,
    status text default 'pending',
    reason text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    processed_at timestamp with time zone
  );

  -- Password resets table
  create table public.password_resets (
    id uuid default gen_random_uuid() primary key,
    username text not null references public.users(username) on delete cascade,
    email text not null,
    status text default 'pending',
    new_password text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    processed_at timestamp with time zone
  );

  -- Admin logs table
  create table public.admin_logs (
    id uuid default gen_random_uuid() primary key,
    action text not null,
    target text not null,
    details text default '',
    admin text default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- PvP Battles table (for real-time PvP)
  create table public.pvp_battles (
    id uuid default gen_random_uuid() primary key,
    player1 text not null references public.users(username) on delete cascade,
    player2 text references public.users(username) on delete cascade,
    status text default 'waiting',
    winner text default '',
    player1_card jsonb default '{}'::jsonb,
    player2_card jsonb default '{}'::jsonb,
    player1_hp integer default 0,
    player2_hp integer default 0,
    current_turn text default '',
    battle_log jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Game settings table
  create table public.game_settings (
    id integer primary key default 1,
    gacha_rates jsonb default '{"normal":{"common":50,"uncommon":30,"rare":15,"epic":4,"legendary":1},"premium":{"common":20,"uncommon":35,"rare":30,"epic":12,"legendary":3},"legendary":{"common":5,"uncommon":15,"rare":35,"epic":30,"legendary":15}}'::jsonb,
    starting_resources jsonb default '{"coins":1000,"gems":100}'::jsonb,
    battle_rewards jsonb default '{"winCoins":50,"winExp":20,"loseCoins":10}'::jsonb,
    shop_prices jsonb default '{"coins500":25,"coins1000":45,"gems100":500}'::jsonb,
    topup_prices jsonb default '{"coins1000":10000,"coins5000":45000,"gems100":50000,"gems500":225000,"sultan":500000}'::jsonb,
    starter_pack jsonb default '{"coins":500,"gems":50}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Payment settings table (for admin to edit)
  create table public.payment_settings (
    id integer primary key default 1,
    bank_name text default 'BCA',
    account_number text default '123-456-7890',
    account_name text default 'Emoji Battle Gacha',
    payment_methods jsonb default '[{"name":"BCA","number":"123-456-7890","holder":"Emoji Battle Gacha"}]'::jsonb,
    topup_packages jsonb default '[{"id":"coins_1000","name":"1.000 Koin","type":"coins","amount":1000,"price":10000,"icon":"🪙","benefits":["10x Gacha Normal","Bonus 100 Koin"]},{"id":"coins_5000","name":"5.000 Koin","type":"coins","amount":5000,"price":45000,"icon":"🪙","benefits":["50x Gacha Normal","Bonus 1.000 Koin","Hemat Rp 5.000"],"popular":false},{"id":"gems_100","name":"100 Gem","type":"gems","amount":100,"price":50000,"icon":"💎","benefits":["2x Gacha Premium","Bonus 10 Gem"],"popular":true},{"id":"gems_500","name":"500 Gem","type":"gems","amount":500,"price":225000,"icon":"💎","benefits":["10x Gacha Premium","Bonus 100 Gem","Hemat Rp 25.000"]},{"id":"sultan","name":"Paket Sultan","type":"package","amount":"sultan","price":500000,"icon":"👑","benefits":["5.000 Koin","1.000 Gem","1x Legendary Gacha"],"legendary":true}]'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Insert default settings
  insert into public.game_settings (id) values (1) on conflict do nothing;
  insert into public.payment_settings (id) values (1) on conflict do nothing;

  -- Enable Row Level Security
  alter table public.users enable row level security;
  alter table public.chat_messages enable row level security;
  alter table public.topup_requests enable row level security;
  alter table public.password_resets enable row level security;
  alter table public.admin_logs enable row level security;
  alter table public.pvp_battles enable row level security;
  alter table public.game_settings enable row level security;
  alter table public.payment_settings enable row level security;

  -- Create policies
  create policy "Allow all" on public.users for all using (true) with check (true);
  create policy "Allow all" on public.chat_messages for all using (true) with check (true);
  create policy "Allow all" on public.topup_requests for all using (true) with check (true);
  create policy "Allow all" on public.password_resets for all using (true) with check (true);
  create policy "Allow all" on public.admin_logs for all using (true) with check (true);
  create policy "Allow all" on public.pvp_battles for all using (true) with check (true);
  create policy "Allow all" on public.game_settings for all using (true) with check (true);
  create policy "Allow all" on public.payment_settings for all using (true) with check (true);

  -- Enable realtime for all tables
  alter publication supabase_realtime add table public.users;
  alter publication supabase_realtime add table public.chat_messages;
  alter publication supabase_realtime add table public.topup_requests;
  alter publication supabase_realtime add table public.password_resets;
  alter publication supabase_realtime add table public.admin_logs;
  alter publication supabase_realtime add table public.pvp_battles;
  alter publication supabase_realtime add table public.game_settings;
  alter publication supabase_realtime add table public.payment_settings;
commit;
`;

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
window.SQL_SCHEMA = SQL_SCHEMA;
