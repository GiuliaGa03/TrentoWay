
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connessione al database MongoDB prima di eseguire i test
beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(mongoURI);
});



const request = require('supertest');
const app = require('../app');

function getUniqueUsername() {
  //return `utente${Date.now()}${Math.floor(Math.random() * 10000)}`;
  return 'user' + Math.random().toString(36).substring(2, 10);
}
function getUniqueEmail() {
  return `testuser_${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
}

// Variabili per l'utente di test
let testEmail = getUniqueEmail().toLowerCase();
let testPassword = 'Password123';

jest.setTimeout(30000); // Imposta un timeout di 30 secondi per i test


// Creazione di un utente valido per i test
beforeAll(async () => {
  await request(app)
    .post('/api/v1/autenticazione/registrazione')
    .send({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
      username: getUniqueUsername()
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
    expect(res.body.message).toMatch(/Email obbligatoria/i);
  });



  test('Login con entrambi email e password vuoti', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/login')
      .send({
        email: '',
        password: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email e password obbligatorie/i);
  });

  test('login bloccato dopo 5 tentativi falliti', async () => {
    // Simulazione di 5 tentativi falliti
    // Creazione di un nuovo utente per il test
    const email = getUniqueEmail();
    const password = 'Password123';

    await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email,
        password,
        confirmPassword: password,
        username: getUniqueUsername()
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
        password
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Troppi tentativi falliti, riprova più tardi/i);
  });



  
});


// Chiusura della connessione al database dopo i test
afterAll(async () => {
  await mongoose.connection.close();
});



