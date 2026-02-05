-- ========================================
-- EMOJI BATTLE GACHA - SUPABASE SCHEMA
-- Database Schema untuk Game Gacha Kartu Emoji
-- Version 2.0 - Clean & Optimized
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLES
-- ========================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    coins INTEGER DEFAULT 1000,
    gems INTEGER DEFAULT 100,
    cards JSONB DEFAULT '[]'::jsonb,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_streak INTEGER DEFAULT 0,
    pvp_wins INTEGER DEFAULT 0,
    pvp_points INTEGER DEFAULT 0,
    starter_pack_claimed BOOLEAN DEFAULT FALSE,
    activities JSONB DEFAULT '[]'::jsonb,
    notifications JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    status_reason TEXT DEFAULT '',
    vip_level INTEGER DEFAULT 0,
    pass_type TEXT DEFAULT 'none',
    warnings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_online BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Topup requests table
CREATE TABLE IF NOT EXISTS public.topup_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    price INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    reason TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Password resets table
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    new_password TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    details TEXT DEFAULT '',
    admin TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PvP Battles table
CREATE TABLE IF NOT EXISTS public.pvp_battles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player1 TEXT NOT NULL,
    player2 TEXT REFERENCES public.users(username),
    status TEXT DEFAULT 'waiting',
    winner TEXT DEFAULT '',
    player1_card JSONB DEFAULT '{}'::jsonb,
    player2_card JSONB DEFAULT '{}'::jsonb,
    player1_hp INTEGER DEFAULT 0,
    player2_hp INTEGER DEFAULT 0,
    current_turn TEXT DEFAULT '',
    battle_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Game settings table
CREATE TABLE IF NOT EXISTS public.game_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    gacha_rates JSONB DEFAULT '{
        "normal": {"common": 50, "uncommon": 30, "rare": 15, "epic": 4, "legendary": 1},
        "premium": {"common": 20, "uncommon": 35, "rare": 30, "epic": 12, "legendary": 3},
        "legendary": {"common": 5, "uncommon": 15, "rare": 35, "epic": 30, "legendary": 15}
    }'::jsonb,
    starting_resources JSONB DEFAULT '{"coins": 1000, "gems": 100}'::jsonb,
    battle_rewards JSONB DEFAULT '{"winCoins": 50, "winExp": 20, "loseCoins": 10}'::jsonb,
    shop_prices JSONB DEFAULT '{
        "coins500": 25,
        "coins1000": 45,
        "gems100": 500
    }'::jsonb,
    topup_prices JSONB DEFAULT '{
        "coins1000": 10000,
        "coins5000": 45000,
        "gems100": 50000,
        "gems500": 225000,
        "sultan": 500000
    }'::jsonb,
    starter_pack JSONB DEFAULT '{"coins": 500, "gems": 50}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Payment settings table
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    bank_name TEXT DEFAULT 'BCA',
    account_number TEXT DEFAULT '123-456-7890',
    account_name TEXT DEFAULT 'Emoji Battle Gacha',
    payment_methods JSONB DEFAULT '[
        {"name": "Bank BCA", "number": "123-456-7890", "holder": "Emoji Battle Gacha"}
    ]'::jsonb,
    topup_packages JSONB DEFAULT '[
        {"name": "1.000 Koin", "type": "coins", "amount": 1000, "price": 10000, "icon": "🪙", "benefits": ["10x Gacha Normal", "Bonus 100 Koin"]},
        {"name": "5.000 Koin", "type": "coins", "amount": 5000, "price": 45000, "icon": "🪙", "benefits": ["50x Gacha Normal", "Bonus 1.000 Koin", "Hemat Rp 5.000"]},
        {"name": "100 Gem", "type": "gems", "amount": 100, "price": 50000, "icon": "💎", "benefits": ["2x Gacha Premium", "Bonus 10 Gem"], "popular": true},
        {"name": "500 Gem", "type": "gems", "amount": 500, "price": 225000, "icon": "💎", "benefits": ["10x Gacha Premium", "Bonus 100 Gem", "Hemat Rp 25.000"]},
        {"name": "Paket Sultan", "type": "package", "amount": "sultan", "price": 500000, "icon": "👑", "benefits": ["5.000 Koin", "1.000 Gem", "1x Legendary Gacha"], "legendary": true}
    ]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- VIP Config table
CREATE TABLE IF NOT EXISTS public.vip_config (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    benefits JSONB DEFAULT '[]'::jsonb,
    color TEXT DEFAULT '#22c55e',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================
-- INSERT DEFAULT DATA
-- ========================================

-- Insert default game settings
INSERT INTO public.game_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Insert default payment settings
INSERT INTO public.payment_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Insert VIP configurations
INSERT INTO public.vip_config (id, name, price, benefits, color) VALUES
(1, 'VIP Bronze', 100, '["+10% Bonus Koin", "Badge Eksklusif"]', '#22c55e'),
(2, 'VIP Silver', 250, '["+20% Bonus Koin", "Badge Eksklusif", "Daily Reward"]', '#3b82f6'),
(3, 'VIP Gold', 500, '["+30% Bonus Koin", "Badge Eksklusif", "Daily Reward+", "Priority Support"]', '#a855f7'),
(4, 'VIP Platinum', 1000, '["+40% Bonus Koin", "Badge Eksklusif", "Daily Reward++", "Priority Support", "Exclusive Items"]', '#f59e0b'),
(5, 'VIP Diamond', 2500, '["+50% Bonus Koin", "Badge Eksklusif", "Daily Reward+++", "Priority Support", "Exclusive Items", "Custom Badge"]', '#ef4444')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pvp_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_config ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE POLICIES (Allow all for development)
-- ========================================

-- Users policies
CREATE POLICY "Allow all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Chat messages policies
CREATE POLICY "Allow all chat" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Topup requests policies
CREATE POLICY "Allow all topup" ON public.topup_requests FOR ALL USING (true) WITH CHECK (true);

-- Password resets policies
CREATE POLICY "Allow all password resets" ON public.password_resets FOR ALL USING (true) WITH CHECK (true);

-- Admin logs policies
CREATE POLICY "Allow all admin logs" ON public.admin_logs FOR ALL USING (true) WITH CHECK (true);

-- PvP battles policies
CREATE POLICY "Allow all pvp battles" ON public.pvp_battles FOR ALL USING (true) WITH CHECK (true);

-- Game settings policies
CREATE POLICY "Allow all game settings" ON public.game_settings FOR ALL USING (true) WITH CHECK (true);

-- Payment settings policies
CREATE POLICY "Allow all payment settings" ON public.payment_settings FOR ALL USING (true) WITH CHECK (true);

-- VIP config policies
CREATE POLICY "Allow all vip config" ON public.vip_config FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- ENABLE REALTIME
-- ========================================

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.topup_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.password_resets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pvp_battles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vip_config;

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for game_settings
DROP TRIGGER IF EXISTS update_game_settings_updated_at ON public.game_settings;
CREATE TRIGGER update_game_settings_updated_at
    BEFORE UPDATE ON public.game_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for payment_settings
DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON public.payment_settings;
CREATE TRIGGER update_payment_settings_updated_at
    BEFORE UPDATE ON public.payment_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pvp_battles
DROP TRIGGER IF EXISTS update_pvp_battles_updated_at ON public.pvp_battles;
CREATE TRIGGER update_pvp_battles_updated_at
    BEFORE UPDATE ON public.pvp_battles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INDEXES (for better performance)
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_topup_requests_status ON public.topup_requests(status);
CREATE INDEX IF NOT EXISTS idx_topup_requests_username ON public.topup_requests(username);
CREATE INDEX IF NOT EXISTS idx_password_resets_status ON public.password_resets(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_pvp_battles_status ON public.pvp_battles(status);
