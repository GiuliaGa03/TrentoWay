const request = require('supertest');
const app = require('../app');

let testEmail = `testlogin${Date.now()}@example.com`;
let testPassword = 'Password123';

// Creazione di un utente valido per i test
beforeAll(async () => {
  await request(app)
    .post('/api/v1/autenticazione/registrazione')
    .send({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
      username: 'utenteLogin'
    });
});

describe('Login utente', () => {
  test('Login con credenziali valide', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testEmail);
  });

  test('Login con email corretta ma password errata', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: testEmail,
        password: 'PasswordSbagliata'
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Password errata/i);
  });

  test('Login con email non registrata', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: 'nonregistrata@example.com',
        password: 'Qualsiasi123'
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Utente non trovato/i);
  });

  //ancora da implementare nel backend

  test('Login con campo password vuoto', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: testEmail,
        password: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Password obbligatoria/i); 
  });

  test('Login con campo email vuoto', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: '',
        password: testPassword
      });

    expect(res.status).toBe(400);  
    expect(res.body.message).toMatch(/Email  obligatoria/i);
  });



  test('Login con entrambi email e password vuoti', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: '',
        password: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email e password sono obbligatorie/i);
  });

  test('login bloccato dopo 5 tentativi falliti', async () => {
    // Simulazione di 5 tentativi falliti
    const email = `testblock${Date.now()}@example.com`;
    // Creazione di un nuovo utente per il test
    const password = 'Password123';
    await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email,
        password,
        confirmPassword: password,
        username: 'utenteBloccato'
      });

    // Effettua 5 tentativi di login con password errata
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/autenticazione/login')
        .send({
          email,
          password: 'PasswordSbagliata'
        });
    }
    // Il sesto tentativo dovrebbe fallire con un messaggio di blocco
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email,
        password: 'PasswordCorretta'
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Troppi tentativi falliti, riprova più tardi/i);
  });



  
});

