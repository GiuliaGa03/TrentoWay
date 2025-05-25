const express = require('express');
const router = express.Router();
const Segnaposto = require('../models/Segnaposto');
const CacciaAlTesoro = require('../models/CacciaAlTesoro');
const Quiz = require('../models/Quiz');


router.get('/', async (req, res) => {
  try {
    // Recupera tutte le cacce al tesoro dal database
    const cacce = await CacciaAlTesoro.find();

    // Restituisci la lista in formato JSON
    res.status(200).json(cacce);
  } catch (error) {
    // Gestione errori
    res.status(500).json({ message: error.message });
  }
});
