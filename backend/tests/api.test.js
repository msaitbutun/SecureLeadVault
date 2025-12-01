const request = require('supertest');

// --- GELİŞMİŞ MOCK YAPISI ---
jest.mock('mongoose', () => {
  const mMongoose = {
    connect: jest.fn().mockResolvedValue('MOCK_CONNECTED'),
    connection: {
      readyState: 1, 
      close: jest.fn().mockResolvedValue('MOCK_CLOSED')
    },
    Schema: jest.fn(),
    // Model fonksiyonu (Lead) çağrıldığında dönen nesne:
    model: jest.fn().mockReturnValue({
      // 1. find().sort() zincirini taklit et
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { name: 'Mock Lead', company: 'Test Corp', amount: 5000, date: new Date() }
        ])
      }),
      // 2. countDocuments hatasını çöz
      countDocuments: jest.fn().mockResolvedValue(10),
      // 3. Diğer metodlar
      save: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({})
    })
  };
  return mMongoose;
});

const app = require('../server');

describe('SecureLeadVault API Testleri (Mocked)', () => {
    
    test('Sistem ayakta mı? (Sanity Check)', () => {
        expect(true).toBe(true);
    });

    test('GET /api/leads -> 200 Dönüyor mu?', async () => {
        const res = await request(app).get('/api/leads');
        expect(res.statusCode).toBe(200);
        // Dönen verinin array olduğunu kontrol et
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('Helmet çalışıyor mu?', async () => {
        const res = await request(app).get('/api/leads');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});