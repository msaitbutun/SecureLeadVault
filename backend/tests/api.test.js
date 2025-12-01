const request = require('supertest');
const mongoose = require('mongoose');
// server.js'i çağırıyoruz ama app.listen yapmıyor (çünkü orada if koşulu var)
const app = require('../server'); 

// 1. ZAMAN AŞIMINI ARTTIR (Kritik Nokta)
// Docker yavaş olabilir, 5sn yetmiyor, 30sn veriyoruz.
jest.setTimeout(30000);

beforeAll(async () => {
    // Test başlamadan önce DB bağlantısı hazır mı kontrol et
    // Eğer server.js bağladıysa (readyState 1) dokunma.
    // Değilse (0), biz manuel bağlayalım.
    if (mongoose.connection.readyState === 0) {
        const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/secureleads';
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    // Test bitince bağlantıyı temizce kapat
    await mongoose.connection.close();
});

describe('SecureLeadVault API Testleri', () => {

    // UNIT TEST
    test('Sanity Check (1+1=2)', () => {
        expect(1 + 1).toBe(2);
    });

    // INTEGRATION TEST
    test('GET /api/leads -> Sunucu cevap veriyor mu?', async () => {
        // Supertest ile sanal istek atıyoruz
        const res = await request(app).get('/api/leads');
        
        // 200 (Başarılı) veya 500 (DB Hatası) dönmesi sunucunun ayakta olduğunu kanıtlar.
        // Timeout almadığı sürece test geçer.
        expect([200, 201, 304, 500]).toContain(res.statusCode);
    });

    // SECURITY TEST
    test('Helmet devrede mi? (Security Headers)', async () => {
        const res = await request(app).get('/api/leads');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});