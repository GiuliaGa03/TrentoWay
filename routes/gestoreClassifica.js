const express = require('express');
const router = express.Router();
const Utente = require('../models/Utente');


router.get('/', async (req, res) => {
  try {
    const utenti = await Utente.find({}, 'username punti')
      .sort({ punti: -1 });

    res.status(200).json(utenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero della classifica', error: error.message });
  }
});

module.exports = router;
