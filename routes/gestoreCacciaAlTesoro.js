const express = require('express');
const router = express.Router();
const CacciaAlTesoro = require('../models/CacciaAlTesoro');
const Segnaposto = require('../models/Segnaposto');
const Auth = require('../autenticazione/middlewareAutenticazione');

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
router.post('/', Auth('admin'), async (req, res) => {
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

router.put('/:id/ordine', async (req, res) => {
  try {
    const caccia = await CacciaAlTesoro.findById(req.params.id);
    if (!caccia) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });

    const nuovaLista = req.body.listaSegnaposti;

    if (!Array.isArray(nuovaLista)) {
      return res.status(400).json({ message: 'Formato della lista non valido' });
    }

    //verifica che ogni entry abbia segnaposto e ordine
    for (const entry of nuovaLista) {
      if (!entry.segnaposto || typeof entry.ordine !== 'number') {
        return res.status(400).json({ message: 'Ogni elemento deve contenere segnaposto e ordine' });
      }
    }

    caccia.listaSegnaposti = nuovaLista;
    await caccia.save();

    res.status(200).json({ message: 'Ordine aggiornato con successo' });
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

// POST: Aggiunge un segnaposto alla caccia al tesoro con ordine
router.post('/:cacciaId/segnaposto/:segnapostoId', async (req, res) => {
  try {
    const { cacciaId, segnapostoId } = req.params;
    const { ordine } = req.body; // ordine passato nel body

    const caccia = await CacciaAlTesoro.findById(cacciaId);
    if (!caccia) return res.status(404).json({ message: 'Caccia al tesoro non trovata' });

    const segnaposto = await Segnaposto.findById(segnapostoId);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    const giaPresente = caccia.listaSegnaposti.some(entry =>
      entry.segnaposto.toString() === segnapostoId
    );

    if (!giaPresente) {
      caccia.listaSegnaposti.push({
        segnaposto: segnapostoId,
        ordine: ordine ?? caccia.listaSegnaposti.length + 1
      });

      await caccia.save();
    }

    res.status(200).json({ message: 'Segnaposto aggiunto alla caccia al tesoro con ordine' });
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

    const presente = caccia.listaSegnaposti.some(entry =>
      entry.segnaposto.toString() === segnapostoId
    );

    if (!presente) {
      return res.status(400).json({ message: 'Il segnaposto non è associato a questa caccia' });
    }

    caccia.listaSegnaposti = caccia.listaSegnaposti.filter(entry =>
      entry.segnaposto.toString() !== segnapostoId
    );

    await caccia.save();

    res.status(200).json({ message: 'Segnaposto rimosso dalla caccia al tesoro' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
