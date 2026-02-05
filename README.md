# 🎮 Emoji Battle Gacha - Game Kartu Emoji Profesional

Game gacha kartu emoji dengan database online menggunakan Supabase. Fitur lengkap dengan PvP, chat real-time, top up, dan admin panel.

## ✨ Fitur Utama

### 🎮 Game Features
- **Gacha System** - 3 tipe gacha (Normal, Premium, Legendary)
- **Koleksi Kartu** - 55+ kartu emoji dengan rarity (Common, Uncommon, Rare, Epic, Legendary)
- **Battle System** - Bertarung melawan bot dengan sistem turn-based
- **PvP Online** - Tantang pemain lain secara real-time
- **Chat Global** - Chat dengan pemain lain secara real-time
- **Top Up** - Sistem top up koin dan gems
- **Starter Pack** - Paket pemula gratis untuk player baru

### 👨‍💼 Admin Features
- **Dashboard** - Statistik real-time game
- **User Management** - Edit, ban, suspend, warning user
- **Top Up Management** - Approve/reject permintaan top up
- **Password Reset** - Reset password user yang lupa
- **Chat Moderation** - Monitor dan hapus pesan chat
- **VIP Management** - Kelola level VIP dan pass
- **Settings** - Konfigurasi gacha rates, harga, rewards

## 🚀 Setup Supabase

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Buat akun dan project baru
3. Copy **Project URL** dan **Anon Key**

### 2. Jalankan SQL Schema
1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `supabase-schema.sql`
3. Paste dan jalankan (Run)

### 3. Konfigurasi Client
Edit file `supabase-client.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

Ganti dengan URL dan key dari project Supabase kamu.

### 4. Enable Realtime
1. Buka Supabase Dashboard → Database → Replication
2. Pastikan semua tabel sudah di-add ke publication `supabase_realtime`

## 📁 Struktur File

```
app/
├── index.html          # Halaman utama game
├── admin.html          # Admin panel
├── style.css           # Styling
├── script.js           # Game logic
├── admin-script.js     # Admin logic
├── supabase-client.js  # Database client
└── supabase-schema.sql # Database schema
```

## 🗄️ Database Tables

| Table | Deskripsi |
|-------|-----------|
| `users` | Data user (username, email, password, coins, gems, cards) |
| `chat_messages` | Pesan chat global |
| `topup_requests` | Permintaan top up |
| `password_resets` | Permintaan reset password |
| `admin_logs` | Log aktivitas admin |
| `pvp_battles` | Data pertarungan PvP |
| `game_settings` | Konfigurasi game |
| `payment_settings` | Konfigurasi pembayaran |
| `vip_config` | Konfigurasi VIP |

## 🔑 Admin Login

- **Username:** `admin`
- **Password:** `admin123`

## 🎮 Cara Bermain

1. Register akun baru
2. Claim starter pack gratis
3. Gacha kartu dengan koin/gems
4. Bertarung melawan bot atau pemain lain
5. Top up untuk mendapatkan lebih banyak resources

## 🛠️ Teknologi

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime
- **Icons:** Font Awesome
- **Fonts:** Google Fonts (Poppins)

## 📱 Responsive

Game ini responsive dan bisa dimainkan di:
- Desktop
- Tablet
- Mobile

## 📝 Catatan Penting

1. **Security:** Ganti password admin segera setelah deploy
2. **Backup:** Backup database secara berkala
3. **Rate Limiting:** Pertimbangkan untuk menambahkan rate limiting
4. **Validation:** Tambahkan validasi input di production

## 🐛 Troubleshooting

### Database tidak terhubung
- Cek URL dan Anon Key di `supabase-client.js`
- Pastikan project Supabase aktif
- Cek CORS settings di Supabase

### Realtime tidak berfungsi
- Pastikan tabel sudah di-add ke `supabase_realtime` publication
- Cek browser console untuk error

### Data tidak tersimpan
- Pastikan RLS (Row Level Security) sudah di-disable atau policy sudah di-set
- Cek Supabase logs untuk error detail

## 📄 Lisensi

MIT License - Feel free to use and modify!

---

Dibuat dengan ❤️ untuk komunitas game Indonesia
