# 🚀 Panduan Setup Emoji Battle Gacha

## Langkah 1: Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik "Start your project" atau login jika sudah punya akun
3. Klik "New Project"
4. Isi:
   - **Organization:** Pilih atau buat baru
   - **Project Name:** `emoji-battle-gacha`
   - **Database Password:** Buat password yang kuat
   - **Region:** Pilih region terdekat (Southeast Asia untuk Indonesia)
5. Klik "Create new project"
6. Tunggu project selesai dibuat (1-2 menit)

## Langkah 2: Dapatkan Credentials

1. Di dashboard project, klik ikon **Settings** (gear icon)
2. Pilih tab **API**
3. Copy nilai berikut:
   - **Project URL** (contoh: `https://abcdefgh12345678.supabase.co`)
   - **anon public** key (contoh: `eyJhbGciOiJIUzI1NiIs...`)

## Langkah 3: Setup Database

1. Di sidebar, klik **SQL Editor**
2. Klik **New query**
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl+Enter`
6. Pastikan tidak ada error

## Langkah 4: Konfigurasi Client

1. Buka file `supabase-client.js`
2. Ganti baris berikut:

```javascript
// SEBELUM
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// SESUDAH (contoh)
const SUPABASE_URL = 'https://abcdefgh12345678.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

3. Save file

## Langkah 5: Enable Realtime (Opsional tapi Direkomendasikan)

1. Di sidebar, klik **Database**
2. Klik **Replication**
3. Di bagian **Source**, pastikan tabel berikut sudah ada:
   - `users`
   - `chat_messages`
   - `topup_requests`
   - `password_resets`
   - `pvp_battles`

Jika belum ada, tambahkan manual:
1. Klik **Add table**
2. Pilih tabel yang ingin di-enable
3. Klik **Confirm**

## Langkah 6: Test Koneksi

1. Buka `index.html` di browser
2. Buka Developer Tools (F12)
3. Cek Console
4. Jika ada pesan "Supabase library not loaded" atau "Supabase anon key not configured", cek kembali konfigurasi
5. Jika tidak ada error, koneksi berhasil!

## Langkah 7: Deploy (Opsional)

### Deploy ke Netlify
1. Buka [netlify.com](https://netlify.com)
2. Login dan klik "Add new site"
3. Pilih "Deploy manually"
4. Drag & drop folder project
5. Tunggu deploy selesai

### Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Login dan klik "Add New Project"
3. Import dari GitHub atau upload folder
4. Deploy!

### Deploy ke Hosting Lain
1. Upload semua file ke server/hosting
2. Pastikan file `index.html` ada di root
3. Akses melalui domain/hosting

## Troubleshooting

### Error: "Supabase library not loaded"
- Pastikan CDN link benar
- Cek koneksi internet
- Refresh halaman

### Error: "Failed to initialize Supabase"
- Cek URL dan Anon Key
- Pastikan tidak ada typo
- Cek project Supabase masih aktif

### Error: "relation does not exist"
- SQL schema belum dijalankan
- Jalankan ulang SQL schema
- Cek nama tabel di Supabase

### Realtime tidak berfungsi
- Pastikan tabel sudah di-add ke publication
- Cek browser console untuk error
- Refresh halaman setelah enable realtime

## Tips Keamanan

1. **Ganti Admin Password**
   - Buka `admin-script.js`
   - Cari fungsi `adminLogin()`
   - Ganti password default

2. **Enable RLS (Row Level Security)**
   - Di Supabase, buka Table Editor
   - Klik tabel `users`
   - Klik **RLS**
   - Enable RLS dan buat policy sesuai kebutuhan

3. **Gunakan Environment Variables**
   - Untuk production, gunakan `.env` file
   - Jangan commit credentials ke git

4. **Backup Database**
   - Backup secara berkala
   - Gunakan fitur backup Supabase

## Support

Jika ada masalah, cek:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- Browser console untuk error detail

Selamat bermain! 🎮
