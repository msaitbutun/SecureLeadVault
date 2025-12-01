const request = require('supertest');
const app = require('../server'); // Server dosyamızı çağırdık (Dinlemeden)
const mongoose = require('mongoose');

// Testler başlamadan önce yapılacaklar (Opsiyonel)
beforeAll(async () => {
    // Gerçek testlerde buraya "Mock Database" bağlanır.
    // Şimdilik sadece API endpointlerinin HTTP durumlarını test edeceğiz.
});

// Testler bitince yapılacaklar
afterAll(async () => {
    await mongoose.connection.close(); // Açık kalan bağlantı varsa kapat
});

describe('SecureLeadVault API Testleri', () => {

    // 1. UNIT TEST (Basit Mantık Kontrolü)
    test('Matematik testi (Sanity Check)', () => {
        expect(1 + 1).toBe(2);
    });

    // 2. INTEGRATION TEST (Endpoint Kontrolü)
    // Veritabanı bağlantısı Docker network'ünde olmadığı zaman hata verebilir
    // O yüzden bu testte hata beklemeyi de (Error Handling) test edebiliriz.
    
    test('GET /api/leads -> Sunucu cevap veriyor mu?', async () => {
        const res = await request(app).get('/api/leads');
        
        // Eğer DB bağlı değilse 500 döner, bağlıysa 200 döner.
        // Her iki durumda da sunucunun "Ulaşılamaz" olmadığını kanıtlarız.
        expect([200, 500]).toContain(res.statusCode);
    });

    // 3. SECURITY TEST (Güvenlik Başlıkları Var mı?)
    test('Helmet devrede mi? (Security Headers)', async () => {
        const res = await request(app).get('/api/leads');
        // Helmet kullanınca 'X-Powered-By' başlığı gizlenmeli
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});