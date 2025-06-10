const request = require('supertest');
const app = require('../app');

//da testare con npx jest tests/maps_config.test.js se vuoi testare solo questo file

describe('GETS /api/maps-config.js', () => {
  test('should return the Google Maps API key in JavaScript format', async () => {
    const res = await request(app).get('/api/maps-config.js');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/javascript; charset=utf-8');
    
    // Controlla che la chiave API sia presente nel corpo della risposta
    expect(res.text).toMatch(/window\.GOOGLE_MAPS_API_KEY\s*=\s*".+?";/);
  });
});
