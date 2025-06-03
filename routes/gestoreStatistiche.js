const express = require('express');
const router = express.Router();
const Segnaposto = require('../models/Segnaposto');
const Statistiche = require('../tools/Statistiche');
const Auth = require('../autenticazione/middlewareAutenticazione');

// Ordina per visite
router.get('/visite', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find();
    const stats = new Statistiche(segnaposti);
    res.json(stats.perVisite());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ordina per nome
router.get('/nome', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find();
    const stats = new Statistiche(segnaposti);
    res.json(stats.perNome());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ordina per voto medio
router.get('/voti', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find();
    const stats = new Statistiche(segnaposti);
    res.json(stats.perVotoMedio());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
