const express = require('express');
const router = express.Router();
const CacciaAlTesoro = require('../models/CacciaAlTesoro');
const Segnaposto = require('../models/Segnaposto');

// GET: Tutte le cacce al tesoro
router.get('/', async (req, res) => {
  try {
    const cacce = await CacciaAlTesoro.find().populate({
      path: 'listaSegnaposti',
      populate: { path: 'quiz' }
    });
    res.status(200).json(cacce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Caccia al tesoro singola
router.get('/:id', async (req, res) => {
  try {
    const caccia = await CacciaAlTesoro.findById(req.params.id).populate('listaSegnaposti');
    if (!caccia) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });
    res.status(200).json(caccia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crea una nuova caccia al tesoro
router.post('/', async (req, res) => {
  try {
    const nuova = new CacciaAlTesoro(req.body);
    await nuova.save();
    res.status(201).json({ message: 'Caccia al tesoro creata con successo' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Aggiorna una caccia al tesoro
router.put('/:id', async (req, res) => {
  try {
    const aggiornata = await CacciaAlTesoro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aggiornata) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });
    res.status(200).json({ message: 'Caccia al tesoro aggiornata con successo' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Elimina una caccia al tesoro
router.delete('/:id', async (req, res) => {
  try {
    const eliminata = await CacciaAlTesoro.findByIdAndDelete(req.params.id);
    if (!eliminata) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });
    res.status(200).json({ message: 'Caccia al tesoro eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Aggiunge un segnaposto alla caccia al tesoro
router.post('/:cacciaId/segnaposto/:segnapostoId', async (req, res) => {
  try {
    const { cacciaId, segnapostoId } = req.params;

    const caccia = await CacciaAlTesoro.findById(cacciaId);
    if (!caccia) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });

    const segnaposto = await Segnaposto.findById(segnapostoId);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    if (!caccia.listaSegnaposti.includes(segnapostoId)) {
      caccia.listaSegnaposti.push(segnapostoId);
      await caccia.save();
    }

    res.status(200).json({ message: 'Segnaposto aggiunto alla caccia al tesoro' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Rimuove un segnaposto dalla caccia al tesoro
router.delete('/:cacciaId/segnaposto/:segnapostoId', async (req, res) => {
  try {
    const { cacciaId, segnapostoId } = req.params;

    const caccia = await CacciaAlTesoro.findById(cacciaId);
    if (!caccia) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });

    if (!caccia.listaSegnaposti.includes(segnapostoId)) {
      return res.status(400).json({ message: 'Il segnaposto non è associato a questa caccia' });
    }

    caccia.listaSegnaposti = caccia.listaSegnaposti.filter(id => id.toString() !== segnapostoId);
    await caccia.save();

    res.status(200).json({ message: 'Segnaposto rimosso dalla caccia al tesoro' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
