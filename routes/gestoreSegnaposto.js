const express = require('express');
const router = express.Router();
const Segnaposto = require('../models/Segnaposto');
const Quiz = require('../models/Quiz');

router.get('/', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find().populate('quiz');
    res.status(200).json(segnaposti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const segnaposto = await Segnaposto.findById(req.params.id).populate('quiz');
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.status(200).json(segnaposto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuovo = new Segnaposto(req.body); // quiz deve essere un array di ObjectId
    const creato = await nuovo.save();
    res.status(201).json({ message: 'Segnaposto creato con successo'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const aggiornato = await Segnaposto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!aggiornato) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.status(200).json({ message: 'Segnaposto aggiornato con successo' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminato = await Segnaposto.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.status(200).json({ message: 'Segnaposto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/quiz', async (req, res) => {
  try {
    const segnaposto = await Segnaposto.findById(req.params.id);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    const quizId = req.body.quizId;

    // Verifica che il quiz esista
    const quizEsistente = await Quiz.findById(quizId);
    if (!quizEsistente) return res.status(404).json({ message: 'Quiz non trovato' });

    // Aggiungi l'ID del quiz solo se non è già presente
    if (!segnaposto.quiz.includes(quizId)) {
      segnaposto.quiz.push(quizId);
      await segnaposto.save();
    }

    res.status(200).json({ message: 'Quiz associato al segnaposto'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});










module.exports = router;