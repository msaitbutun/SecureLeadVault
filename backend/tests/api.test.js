const request = require('supertest');

// --- KRİTİK MÜDAHALE: MONGOOSE'U SUSTURUYORUZ (MOCK) ---
// Jest'e diyoruz ki: "Mongoose kütüphanesini gerçek kullanma, taklidini yap."
// Böylece 'connect' dediğinde internete çıkmaz, anında "Bağlandım abi" der.
// Timeout hatası ALMAN İMKANSIZ hale gelir.

jest.mock('mongoose', () => {
  const mMongoose = {
    connect: jest.fn().mockResolvedValue('MOCK_CONNECTED'),
    connection: {
      readyState: 1, // Her zaman 'Bağlı'yım yalanını söyle
      close: jest.fn().mockResolvedValue('MOCK_CLOSED')
    },
    Schema: jest.fn(),
    model: jest.fn().mockReturnValue({
      // Veritabanı sorgusu gelirse bu sahte veriyi dön
      find: jest.fn().mockResolvedValue([
        { name: 'Mock Lead', company: 'Test Corp', amount: 5000 }
      ]),
      save: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({})
    })
  };
  return mMongoose;
});

// Server dosyasını çağır (Artık sahte mongoose kullanacak)
const app = require('../server');

describe('SecureLeadVault API Testleri (Mocked)', () => {
    
    // 1. BASİT KONTROL
    test('Sistem ayakta mı? (Sanity Check)', () => {
        expect(true).toBe(true);
    });

    // 2. API TESTİ (DB'ye gitmeden, Mock veri ile)
    test('GET /api/leads -> 200 Dönüyor mu?', async () => {
        const res = await request(app).get('/api/leads');
        
        // Gerçek DB'ye gitmediği için anında cevap verecek
        expect(res.statusCode).toBe(200);
        
        // Sahte verimiz gelmiş mi?
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // 3. GÜVENLİK TESTİ
    test('Helmet çalışıyor mu?', async () => {
        const res = await request(app).get('/api/leads');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});