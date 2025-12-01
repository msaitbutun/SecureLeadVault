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
const MONGO_URI = 'mongodb://mongo:27017/secureleads';

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

app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor`));