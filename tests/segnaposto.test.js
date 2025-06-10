const mongoose = require('mongoose');
const request = require('supertest');
const crypto = require('crypto');
const dotenv = require('dotenv');
const app = require('../app');
const Utente = require('../models/Utente');
dotenv.config();

const uid = crypto.randomBytes(3).toString('hex');
const username = `adm_${uid}`;
const email = `${username}@test.com`;
const password = 'AdminPassword123';

const nomeUnico = "segnaposto_3b893e77"; // garantito unico

let adminToken = '';
let createdSegnapostoId = '';

beforeAll(async () => {
  jest.setTimeout(30000);
  const mongoURI = process.env.MONGODB_URI;
  await mongoose.connect(mongoURI);

  const existing = await Utente.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("🟡 Utente già presente, lo elimino...");
    await Utente.deleteOne({ email: email.toLowerCase() });
  }

  console.log("🟡 Registrazione...");
  const reg = await request(app)
    .post('/api/v1/autenticazione/registrazione')
    .send({
      email,
      password,
      confirmPassword: password,
      username,
      firstName: 'Test',
      lastName: 'Admin'
    });

  console.log("✅ Registrazione status:", reg.status);
  console.log("❌ Registrazione response body:", reg.body);

  if (reg.status !== 201) {
    throw new Error("❌ Registrazione fallita, impossibile continuare i test.");
  }

  console.log("🟡 Promozione a admin...");
  await Utente.updateOne(
    { email: email.toLowerCase() },
    { $set: { ruolo: 'admin' } }
  );

  const utente = await Utente.findOne({ email: email.toLowerCase() });
  if (!utente) throw new Error("❌ Utente non trovato dopo la registrazione.");
  if (utente.ruolo !== 'admin') throw new Error("❌ Ruolo non aggiornato ad admin.");
  console.log("✅ Ruolo:", utente.ruolo);

  const res = await request(app)
    .post('/api/v1/autenticazione/login')
    .send({ email, password });

  adminToken = res.body.token;
  if (!adminToken) throw new Error("❌ Token non ottenuto dopo il login.");
});

describe('Test API Segnaposto', () => {
  test('Creazione di un nuovo segnaposto con dati validi', async () => {
    const data = {
      nome: nomeUnico,
      indirizzo: 'Via Roma 1, Milano',
      descrizione: 'Descrizione test',
      coordinate: { lat: 45.4642, lng: 9.1900 },
      punti: 10,
      indizio: 'Indizio test',
    };

    const res = await request(app)
      .post('/api/v1/segnaposti')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data);

    console.log("✅ POST /segnaposti response:", res.status, res.body);
    expect(res.status).toBe(201);

    const lista = await request(app).get('/api/v1/segnaposti');
    const created = lista.body.find(sp => sp.nome === nomeUnico);
    expect(created).toBeDefined();
    createdSegnapostoId = created._id.toString();
  });

  test('Accesso al dettaglio di un segnaposto esistente', async () => {
    const res = await request(app).get(`/api/v1/segnaposti/${createdSegnapostoId}`);
    console.log("✅ GET /segnaposti/:id response:", res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.nome).toBeDefined();
  });

  test('Creazione con campi vuoti', async () => {
    const res = await request(app)
      .post('/api/v1/segnaposti')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test('Creazione con coordinate non valide', async () => {
    const res = await request(app)
      .post('/api/v1/segnaposti')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: "segnaposto_nonvalido",
        coordinate: { lat: 200, lng: 200 }
      });

    expect(res.status).toBe(400);
  });
  
});

afterAll(async () => {
  await Utente.deleteMany({ email: /adm_/ });
  await mongoose.connection.close();
});


