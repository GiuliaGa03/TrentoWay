const request = require('supertest');
const app = require('../app');

let counter = 0;
function getUniqueEmail() {
  return `test${counter++}@example.com`;
}

describe('Registrazione utente', () => {
  test('Registrazione con email valida', async () => {
    const res = await request(app)
      .post('/api/v1/autenticazione/registrazione')
      .send({
        email: getUniqueEmail(),
        password: 'Password123',
        confirmPassword: 'Password123',
        username: 'utenteValido'
      });

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
        username: 'utenteErrore'
      });

    expect(res.status).toBe(400);
  });

  test('Email già registrata', async () => {
    const email = getUniqueEmail();

    await request(app).post('/api/v1/autenticazione/registrazione').send({
      email,
      password: 'Password123',
      confirmPassword: 'Password123',
      username: 'utente1'
    });

    const res = await request(app).post('/api/v1/autenticazione/registrazione').send({
      email,
      password: 'Password456',
      confirmPassword: 'Password456',
      username: 'utente2'
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
        username: 'utenteErrore'
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
        username: 'utenteErrore'
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
        username: 'utenteErrore'
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
      username: 'utente1'
    });

    const res = await request(app).post('/api/v1/autenticazione/registrazione').send({
      email: baseEmail.toUpperCase(),
      password: 'Password123',
      confirmPassword: 'Password123',
      username: 'utente2'
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

