# 🎲 Emoji Battle Gacha

Game gacha kartu emoji profesional dengan sistem pertarungan yang seru!

## 📁 Struktur File

```
gacha-emoji-game/
├── index.html          # Halaman utama game
├── admin.html          # Panel admin
├── style.css           # Styling profesional
├── script.js           # Logika game lengkap
├── README.md           # Dokumentasi ini
└── data/
    ├── users.json      # Data pengguna (struktur)
    └── emojis.json     # Database kartu emoji
```

## 🎮 Fitur Game

### 1. Sistem Autentikasi
- **Registrasi**: Buat akun baru dengan username, email, dan password
- **Login**: Masuk dengan username dan password
- **Logout**: Keluar dari akun

### 2. Gacha System
Tiga jenis gacha dengan rate berbeda:

| Tipe | Harga | Common | Uncommon | Rare | Epic | Legendary |
|------|-------|--------|----------|------|------|-----------|
| Normal | 100 🪙 | 50% | 30% | 15% | 4% | 1% |
| Premium | 50 💎 | 20% | 35% | 30% | 12% | 3% |
| Legendary | 150 💎 | 5% | 15% | 35% | 30% | 15% |

### 3. Koleksi Kartu
- 55 kartu emoji unik dengan rarity berbeda
- Filter berdasarkan rarity
- Detail kartu dengan statistik lengkap
- Level up kartu melalui pertarungan

### 4. Sistem Pertarungan
- Pilih kartu dari koleksi
- Lawan musik AI yang acak
- Tiga aksi: Serang, Bertahan, Spesial
- Dapatkan koin dan EXP dari kemenangan

### 5. Toko
- Beli koin dengan gem
- Beli gem dengan koin
- Paket Pemula gratis (500 🪙 + 50 💎)

### 6. Panel Admin
- Login: `admin` / `admin123`
- Overview statistik game
- Manajemen pengguna
- Manajemen kartu
- Riwayat pertarungan
- Pengaturan game
- Backup data

## 🎯 Cara Bermain

1. **Buka `index.html`** di browser
2. **Daftar akun baru** atau login
3. **Klaim Paket Pemula** di Toko
4. **Gacha kartu** di menu Gacha
5. **Bertarung** di Arena dengan kartu yang didapat
6. **Kumpulkan** kartu langka dan jadilah juara!

## 🃏 Kartu Emoji

### Rarity & Stats

| Rarity | Bintang | Jumlah | Warna |
|--------|---------|--------|-------|
| Common | ⭐ | 10 | Abu-abu |
| Uncommon | ⭐⭐ | 10 | Hijau |
| Rare | ⭐⭐⭐ | 10 | Biru |
| Epic | ⭐⭐⭐⭐ | 10 | Ungu |
| Legendary | ⭐⭐⭐⭐⭐ | 15 | Emas |

### Statistik Kartu
- **HP**: Health Points (darah)
- **Attack**: Kekuatan serangan
- **Defense**: Pertahanan dari serangan
- **Speed**: Kecepatan (untuk fitur future)

## 💾 Penyimpanan Data

Game menggunakan **LocalStorage** untuk menyimpan:
- Data pengguna (username, email, password)
- Koleksi kartu
- Koin dan gem
- Statistik pertarungan
- Riwayat aktivitas

> ⚠️ **Catatan**: Data tersimpan di browser lokal. Jika browser di-clear, data akan hilang.

## 🔧 Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling modern dengan variabel CSS
- **JavaScript (Vanilla)** - Logika game tanpa framework
- **Font Awesome** - Ikon
- **Google Fonts (Poppins)** - Font

## 🎨 Desain

- Tema gelap profesional
- Gradient warna yang menarik
- Animasi smooth
- Responsive design (mobile-friendly)
- Efek glow untuk kartu legendary

## 🚀 Future Updates

- [ ] Multiplayer battle
- [ ] Trading kartu antar pemain
- [ ] Event mingguan
- [ ] Achievement system
- [ ] Leaderboard global

---

**Dibuat dengan ❤️ untuk para penggemar gacha game!**
