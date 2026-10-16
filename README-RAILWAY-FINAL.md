# Grand Citeras Bot - Final 17 Okt 2026 - SIAP RAILWAY

## Isi Zip:
- index.js = Bot final persona Maria (panggilan kak, kata ganti Maria, sopan solutif)
- product-knowledge.json = 100% lengkap:
  - Harga 166jt masih sama Okt 2026
  - Booking Fee 250rb Non Refund untuk Kintamani & Kelimutu 27/60, DP 0
  - USP: Nempel Citra Maja Raya + Dekat 2 Stasiun Citeras 5 menit & Maja 7 menit + Satu-satunya ada Rukan Bhabinkamtibmas + Lokasi tertinggi anti banjir Peil 503/1417
  - Akses Tol 17km ke Rangkas Bitung, Jalan Raya Maja sudah COR
  - Listrik 1300w, Air PDAM+artesis lulus lab oke, kusen -> ajak survey
  - Boleh kanopi? Boleh asal tidak lewat GSB
  - Banjir? Aman, lokasi tertinggi diantara perumahan lain sekitar
  - Foto/video progress IG @rumahsubsidi.citeras.maja
  - Renovasi <5 tahun: cat, keramik, plafon, dapur belakang, pagar & kanopi tidak lewat GSB, sekat & kitchen set
- package.json = dependencies express, axios, node-cron

## Deploy ke Railway.app:
1. Upload semua file dari zip ini ke Railway (New Project > Deploy from GitHub atau Upload)
2. Di Railway > Variables, isi:
   PHONE_ID=1329849730219068
   TOKEN=token permanen Meta
   VERIFY_TOKEN=grandciteras123
   OPENAI_KEY=sk-...
3. Deploy, copy URL Railway: https://xxx.up.railway.app
4. Buka https://developers.facebook.com > App 1652840179523124 > WhatsApp > Configuration
   - Callback URL: https://xxx.up.railway.app/webhook
   - Verify Token: grandciteras123
   - Klik Verify and Save
   - Di Webhook Fields, ON kan: messages, message_echoes (smb_message_echoes untuk coexistence)
5. Test chat ke +62 851-1138-8933 dari HP lain

## Handover 9 Ketentuan:
1. Dokumen pengganti/kurang, 2. Panduan dokumen detail, 3. SLIK OJK, 4. Stok & pilih unit + kuota FLPP + akad, 5. Survey/jadwal, 6. Minta telpon, 7. Diluar knowledge, 8. Rincian biaya detail, 9. Kusen aluminium detail

## Drip 3-3-2:
Day 0 -> Day 3 -> Day 6 -> Day 8 stop, semua pakai persona Maria + kak + empati

## Template WA yang harus dibuat di WhatsApp Manager:
grandciteras_followup_1, grandciteras_followup_2, grandciteras_followup_3 (karena lewat 24 jam harus pakai template)
