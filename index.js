// Grand Citeras - Chatbot WA Coexistence FINAL 17 Okt 2026 - Update Kanopi Banjir Tertinggi IG
// Phone ID: 1329849730219068 | WABA: 2023087911717269 | Maria +62 851-1138-8933
// Persona: Maria, panggilan kak, sopan ramah solutif

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
app.use(express.json());

const PHONE_ID = process.env.PHONE_ID || "1329849730219068";
const TOKEN = process.env.TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "grandciteras123";
const OPENAI_KEY = process.env.OPENAI_KEY;

let productKnowledge = {};
try {
  productKnowledge = JSON.parse(fs.readFileSync('./product-knowledge.json', 'utf-8'));
} catch(e) {
  console.log("product-knowledge.json belum ada");
}

let leads = {};

app.get('/webhook', (req,res) => {
  if(req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', async (req,res) => {
  const value = req.body.entry?.[0]?.changes?.[0]?.value;
  if(!value) return res.sendStatus(200);

  if(value.messages && value.messages[0]?.from_me) {
    const wa_id = value.messages[0].to;
    if(wa_id && leads[wa_id]) {
      leads[wa_id].handover = true;
      leads[wa_id].nextFollowUp = null;
    }
    return res.sendStatus(200);
  }

  const msg = value.messages?.[0];
  if(!msg || msg.type !== 'text') return res.sendStatus(200);

  const from = msg.from;
  const text = msg.text.body;
  const textLower = text.toLowerCase();

  console.log(`Dari ${from}: ${text}`);

  const handoverKeywords = [
    "ktp hilang", "kk beda", "slip gaji tidak ada", "npwp belum", "buku nikah belum", "spt tidak ada", "dokumen hilang", "dokumen kurang", "dokumen pengganti", "sim bisa",
    "step dokumen", "cara urus dokumen", "urutan dokumen", "contoh surat", "format surat", "panduan dokumen",
    "slik", "ojk", "bi checking", "kolektibilitas", "skor kredit", "riwayat angsuran", "pernah telat", "pinjol", "kartu kredit",
    "pilih blok", "pilih unit", "nomor rumah", "blok mana", "hook", "tusuk sate", "hadap matahari", "stok unit", "sisa unit", "kuota flpp", "jadwal akad", "akad massal",
    "survey", "survei", "jadwal survey", "shareloc", "jemput", "kapan bisa lihat", "sabtu", "minggu",
    "minta telpon", "ditelepon", "vc", "video call", "telpon sekarang", "hubungi", "nomor admin",
    "promo tambahan", "diskon khusus", "kebijakan bank",
    "rincian biaya", "biaya apa lagi", "biaya tambahan", "all in rinciannya", "total bayar berapa",
    "kusen aluminium", "kusen jendela", "kusen pintu"
  ];

  if(handoverKeywords.some(k => textLower.includes(k))) {
    await handleHandover(from, `Keyword: ${text}`, text);
    return res.sendStatus(200);
  }

  const knowledgeKeywords = ["harga", "cicilan", "166", "kintamani", "kelimutu", "tipe", "luas", "lokasi", "maja", "citeras", "stasiun", "fasilitas", "dp", "booking", "250", "free", "bphtb", "subsidi", "syarat", "kpr", "dokumen", "renov", "kanopi", "banjir", "tol", "jalan cor", "listrik", "air", "grand citeras", "rumah subsidi", "halo", "info", "brosur", "bhabinkamtibmas", "citra maja", "gerbang", "rumah contoh", "drone", "foto", "video", "ig", "instagram"];
  if(!knowledgeKeywords.some(k => textLower.includes(k))) {
    await handleHandover(from, "Diluar product knowledge", text);
    return res.sendStatus(200);
  }

  let jawaban = await getAIAnswer(text, productKnowledge);
  jawaban = `Halo kak, terima kasih sudah menghubungi Grand Citeras 🙏\n\n${jawaban}\n\nAda yang masih belum jelas kak? Atau Maria bantu jadwalkan survei lihat rumah contoh Kintamani & Kelimutu? 🙏`;

  await sendWA(from, jawaban);

  if(!leads[from]) leads[from] = { followUpCount: 0, handover: false };
  leads[from].lastMessage = new Date();
  leads[from].nextFollowUp = new Date(Date.now() + 3*24*60*60*1000);
  leads[from].followUpCount = 1;

  res.sendStatus(200);
});

async function getAIAnswer(userText, knowledge) {
  try {
    const prompt = `
KAMU ADALAH MARIA - Marketing Grand Citeras ramah, sopan, solutif, panggilan kak.

PERSONA WAJIB:
- Nama: Maria (pakai 'Maria', jangan 'saya'/'aku')
- Panggil customer: 'kak' selalu
- Gaya: Sopan santai, empati, solusi, tidak memaksa, emoji 🙏 secukupnya
- Contoh: "Halo kak, terima kasih sudah menghubungi Grand Citeras 🙏 Maria bantu jelasin ya kak"

PRODUCT KNOWLEDGE FINAL 17 OKT 2026:
- Harga: Kintamani 27/60 & Kelimutu 27/60 Rp 166.000.000 masih sama Okt 2026
- Booking Fee: Rp 250.000 Non Refund untuk Kintamani & Kelimutu Subsidi, diluar harga jual, DP bisa 0 rupiah. All-in 2jt DIHAPUS. Jika tanya rincian biaya lagi -> HANDOVER
- USP: Bersebelahan Citra Maja Raya, Dekat 2 Stasiun Citeras 5 menit & Maja 7 menit Double Track, Satu-satunya di Maja ada RUKAN BHABINKAMTIBMAS
- Akses: 17 km ke pintu tol Rangkas Bitung, Jalan Raya Maja sudah COR beton
- Spesifikasi: Listrik 1300 watt, Air PDAM + artesis lulus lab oke, Kelimutu Batako ceiling 2.8m, Kintamani Double dinding Hebel ceiling 3.8m. Kusen aluminium -> ajakan survey
- Boleh kanopi? Boleh kak, boleh pasang kanopi asal tidak melewati batas GSB, termasuk renovasi ringan yang diizinkan <5 tahun
- Boleh renov? Boleh dengan ketentuan KPR Subsidi <5 tahun: renov ringan cat/keramik/plafon, belakang/samping bangun dapur di sisa tanah, eksterior non-permanen pagar & kanopi tidak lewat GSB, interior sekat & kitchen set
- Banjir gak? Aman kak, lokasi tertinggi diantara perumahan lain sekitar, sudah ada Peil Banjir No. 503/1417/SDA/DPUPR/2017, dataran tinggi aman dari banjir
- Foto/Video progress: Gerbang utama sudah jadi One Gate, rumah contoh Kintamani & Kelimutu, drone view nempel Citra Maja, Rukan Bhabinkamtibmas. Dokumentasi ada di IG https://www.instagram.com/rumahsubsidi.citeras.maja/ - jika minta foto, arahkan ke IG atau ajak survey
- Promo: Subsidi 4jt, Free BPHTB, Bunga 5% Flat, Cicilan 1jt-an
- Ready stock Kintamani & Kelimutu, pilih unit -> HANDOVER

ATURAN ANTI NGARANG: Jangan buat harga/angsuran/promo baru. Jika masuk handover atau tidak ada di knowledge -> jawab handover empatik.

User tanya: ${userText}
Knowledge: ${JSON.stringify(knowledge).substring(0, 9000)}
`;

    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [{role: "user", content: prompt}],
      temperature: 0.3
    }, { headers: { Authorization: `Bearer ${OPENAI_KEY}` } });

    return res.data.choices[0].message.content;
  } catch(e) {
    console.error(e.message);
    return "Mohon maaf kak, koneksi lagi gangguan, tim Grand Citeras akan lanjut manual dalam 5 menit ya kak 🙏";
  }
}

async function handleHandover(wa_id, reason, lastMessage) {
  console.log(`HANDOVER ${wa_id}: ${reason}`);
  if(leads[wa_id]) {
    leads[wa_id].handover = true;
    leads[wa_id].nextFollowUp = null;
  }
  const handoverMsg = "Mohon maaf kak, untuk detail ini biar Maria cek dulu ya biar akurat dan tidak salah info 🙏 Tim Grand Citeras akan lanjut manual dari nomor ini dalam 5 menit ya kak, terima kasih banyak sudah menunggu";
  await sendWA(wa_id, `Halo kak, terima kasih sudah menghubungi Grand Citeras 🙏\n\n${handoverMsg}`);
  console.log(`🔔 HANDOVER - WA: ${wa_id} - ${reason}`);
}

async function sendWA(to, text) {
  try {
    await axios.post(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
      messaging_product: "whatsapp", to, text: { body: text }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}

cron.schedule('0 * * * *', async () => {
  const now = new Date();
  for(const wa_id in leads) {
    const lead = leads[wa_id];
    if(lead.handover || !lead.nextFollowUp || now < lead.nextFollowUp) continue;
    let txt = "";
    if(lead.followUpCount === 1) {
      txt = "Halo kak, terima kasih sudah hubungi Grand Citeras kemarin 🙏 Gimana kak, ada info yang masih belum jelas tentang Kintamani/Kelimutu harga 166jt booking fee 250rb non refund? Atau ada dokumen yang bingung? Maria bantu jelasin lagi ya 🙏";
      lead.nextFollowUp = new Date(Date.now() + 3*24*60*60*1000);
      lead.followUpCount = 2;
    } else if(lead.followUpCount === 2) {
      txt = "Siang kak, semoga sehat selalu 🙏 Maria cek lagi, untuk rumah subsidi 166jt cicilan 1jt-an masih ready stock Kintamani & Kelimutu, lokasi tertinggi diantara perumahan lain jadi aman banjir Peil 503/1417, boleh kanopi, dekat 2 stasiun Citeras 5 menit & Maja 7 menit, bersebelahan Citra Maja Raya, keamanan ada Bhabinkamtibmas. Foto progress bisa cek IG @rumahsubsidi.citeras.maja ya kak. Ada yang mau ditanyakan atau Maria bantu jadwalkan survei? 🙏";
      lead.nextFollowUp = new Date(Date.now() + 2*24*60*60*1000);
      lead.followUpCount = 3;
    } else if(lead.followUpCount === 3) {
      txt = "Halo kak, mohon maaf mengganggu waktunya 🙏 Ini follow-up terakhir dari Maria ya kak, slot survei Grand Citeras minggu ini tinggal 2 slot lagi. Kalau masih tertarik, ketik SURVEI ya kak, nanti tim lanjut manual. Terima kasih banyak kak 🙏";
      lead.nextFollowUp = null;
      lead.followUpCount = 4;
    } else continue;
    await sendWA(wa_id, txt);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Grand Citeras Bot Final - Kanopi Banjir Tertinggi IG - jalan"));
