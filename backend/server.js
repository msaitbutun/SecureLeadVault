const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 5000;

// --- GÜVENLİK KATMANI (DevSecOps) ---
app.use(helmet()); // Güvenlik başlıkları
app.use(cors());   // Frontend ile konuşma izni
app.use(express.json());

// --- MONGODB BAĞLANTISI ---
// Docker içindeki 'mongo' servisine bağlanır
// Öncelik Environment Variable'da, yoksa Docker adresi (Fallback)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/secureleads';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Bağlantısı Başarılı'))
  .catch(err => console.error('❌ MongoDB Hatası:', err));

// --- BASİT VERİ MODELİ ---
const LeadSchema = new mongoose.Schema({
  name: String,
  company: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', LeadSchema);

// --- API ROTALARI ---
app.get('/api/leads', async (req, res) => {
  const leads = await Lead.find().sort({ date: -1 });
  res.json(leads);
});

app.post('/api/leads', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Kaydedilemedi' });
  }
});
// --- YENİ EKLENECEK SİLME ROTALARI ---

// 1. Seçili Olanları Sil (Batch Delete)
app.post('/api/leads/delete-batch', async (req, res) => {
  try {
    const { ids } = req.body; // Frontend'den ID listesi gelecek
    // MongoDB'nin $in operatörü ile "ID'si bu listenin içinde olanları sil" diyoruz
    await Lead.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Seçilenler silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Silme işlemi başarısız' });
  }
});

// 2. Hepsini Sil (Delete All)
app.delete('/api/leads', async (req, res) => {
  try {
    await Lead.deleteMany({}); // Filtre yok, alayını siler
    res.json({ message: 'Tüm kayıtlar temizlendi' });
  } catch (error) {
    res.status(500).json({ error: 'Temizleme başarısız' });
  }
});

// ... app.listen kodu burada kalacak ...

if (require.main === module) {
    app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor`));
}


// Ama test için import ediliyorsa, sadece app'i dışarı ver (Listen etme)
module.exports = app;
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Bağlantısı Başarılı');

    // --- MOCK DATA (SEED) ---
    const count = await Lead.countDocuments();
    if (count === 0) {
      await Lead.insertMany([
        { name: "Seçil Aydemir", company: "TechNova", amount: 12000 },
        { name: "John Carter", company: "CloudWorks", amount: 18000 },
        { name: "Sait Bütün", company: "SaitCloud", amount: 25000 }, 
        { name: "Emily Stone", company: "DataRise", amount: 9000 }
      ]);
      console.log("🌱 Mock veriler eklendi (Seed atıldı)");
    }
  })
  .catch(err => console.error('❌ MongoDB Hatası:', err));