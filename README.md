# 🎮 Emoji Battle Gacha - Supabase Version

Website game gacha kartu emoji dengan database online menggunakan Supabase.

---

## 📋 Fitur Baru

### ✅ Database Online (Supabase)
- Semua data user tersimpan di cloud
- Real-time sync antar user
- Data tidak hilang saat ganti browser/device

### ✅ PvP Arena Online
- Bertarung dengan pemain lain secara real-time
- Matchmaking otomatis
- Leaderboard PvP

### ✅ Admin Panel Lengkap
- Edit metode pembayaran (BCA, DANA, OVO, dll)
- Edit paket top up (harga, benefits, icon)
- Notifikasi real-time untuk top up & password reset
- Manajemen user (ban, suspend, warning, VIP)

### ✅ Password Reset (Fixed)
- User request reset password
- Admin menerima notifikasi real-time
- Admin generate password baru
- Password tersimpan di database

---

## 🚀 Setup Supabase

### 1. Dapatkan Anon Key
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda: `Game`
3. Klik menu **Project Settings** → **API**
4. Copy **anon public** key

### 2. Update Anon Key
Buka file `supabase-client.js` dan ganti:
```javascript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```
Menjadi:
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...'; // Anon key Anda
```

### 3. Buat Tabel Database
1. Buka Supabase Dashboard
2. Klik **SQL Editor**
3. Copy dan paste schema SQL dari file `supabase-client.js` (cari `SQL_SCHEMA`)
4. Klik **Run**

Atau jalankan SQL ini:

```sql
-- Enable Realtime
begin;
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
    username text not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Topup requests table
  create table public.topup_requests (
    id uuid default gen_random_uuid() primary key,
    username text not null,
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
    username text not null,
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

  -- PvP Battles table
  create table public.pvp_battles (
    id uuid default gen_random_uuid() primary key,
    player1 text not null,
    player2 text references public.users(username),
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
    gacha_rates jsonb default '{}'::jsonb,
    starting_resources jsonb default '{}'::jsonb,
    battle_rewards jsonb default '{}'::jsonb,
    shop_prices jsonb default '{}'::jsonb,
    topup_prices jsonb default '{}'::jsonb,
    starter_pack jsonb default '{}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Payment settings table
  create table public.payment_settings (
    id integer primary key default 1,
    bank_name text default 'BCA',
    account_number text default '123-456-7890',
    account_name text default 'Emoji Battle Gacha',
    payment_methods jsonb default '[]'::jsonb,
    topup_packages jsonb default '[]'::jsonb,
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

  -- Create policies (allow all for development)
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
```

---

## 🔐 Login Admin

- **Username:** `admin`
- **Password:** `admin123`

---

## 📁 Struktur File

```
gamegacha-supabase/
├── index.html          # Halaman utama game
├── admin.html          # Panel admin
├── style.css           # Stylesheet
├── script.js           # Game logic (user)
├── admin-script.js     # Admin logic
├── supabase-client.js  # Supabase configuration
└── README.md           # Dokumentasi ini
```

---

## 🌐 Deploy ke Vercel/Netlify

### Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Buka folder project: `cd gamegacha-supabase`
3. Deploy: `vercel`

### Netlify:
1. Drag & drop folder ke [Netlify Drop](https://app.netlify.com/drop)

---

## ⚠️ Catatan Penting

1. **Jangan upload anon key ke GitHub public!**
2. **Ganti admin password sebelum production!**
3. **Enable RLS policies untuk production!**

---

## 🐛 Troubleshooting

### Database tidak terhubung?
- Cek anon key sudah benar
- Cek tabel sudah dibuat di Supabase
- Cek Row Level Security policies

### Real-time tidak berfungsi?
- Cek Realtime sudah di-enable di Supabase
- Cek browser console untuk error

---

Dibuat dengan ❤️ oleh Emoji Battle Gacha Team
