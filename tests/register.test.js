
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

let counter = 0;
function getUniqueEmail() {
  //return `test${counter++}@example.com`;
  return `testuser_${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
}
function getUniqueUsername() {
  //return `utente${Date.now()}${Math.floor(Math.random() * 10000)}`;
  return 'user' + Math.random().toString(36).substring(2, 10);
}

jest.setTimeout(30000); // Imposta un timeout di 30 secondi per i test

describe('Registrazione utente', () => {
  test('Registrazione con email valida', async () => {
    const username = getUniqueUsername();
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: 'Password123',
        confirmPassword: 'Password123',
        username: username
      });

    console.log('debug email valida:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  test('Email non valida', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
        username: getUniqueUsername()
      });

    expect(res.status).toBe(400);
  });

  test('Email già registrata', async () => {
    const email = getUniqueEmail();
    await request(app).post('/api/v1/autenticazione/registrazione').send({
      email,
      password: 'Password123',
      confirmPassword: 'Password123',
      username: getUniqueUsername()
    });

    const res = await request(app).post('/api/v1/autenticazione/registrazione').send({
      email,
      password: 'Password456',
      confirmPassword: 'Password456',
      username: getUniqueUsername()
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/già registrato/i);
  });

  test('Password vuota', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: '',
        confirmPassword: '',
        username: getUniqueUsername()
      });

    expect(res.status).toBe(400);
  });

  test('Password troppo corta', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: '123',
        confirmPassword: '123',
        username: getUniqueUsername()
      });

    expect(res.status).toBe(400);
  });

  test('Password troppo lunga', async () => {
    const longPassword = 'A1' + 'a'.repeat(50);
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: longPassword,
        confirmPassword: longPassword,
        username: getUniqueUsername()
      });

    expect(res.status).toBe(400);
  });

  test('Tutti i campi vuoti', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({});

    expect(res.status).toBe(400);
  });

  test('Email già presente ma con maiuscole diverse', async () => {
    const baseEmail = `utente${Date.now()}@gmail.com`;

    await request(app).post('/api/v1/autenticazione/registrazione').send({
      email: baseEmail.toLowerCase(),
      password: 'Password123',
      confirmPassword: 'Password123',
      username: getUniqueUsername()
    });

    const res = await request(app).post('/api/v1/autenticazione/registrazione').send({
      email: baseEmail.toUpperCase(),
      password: 'Password123',
      confirmPassword: 'Password123',
      username: getUniqueUsername()
    });

    // Il comportamento dipende da come il server gestisce le email duplicate case insensibili
    // Se il server non normalizza le email, dovrebbe restituire 201 per successo
    // Se il server normalizza le email, dovrebbe restituire 400 per duplicato
    expect(res.status).toBe(400);
  });

  test('Username vuoto', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: 'Password123',
        confirmPassword: 'Password123',
        username: ''
      });

    expect(res.status).toBe(400);
  });
});

// Chiusura della connessione al database dopo i test
afterAll(async () => {
  await mongoose.connection.close();
});

