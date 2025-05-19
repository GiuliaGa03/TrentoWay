const express = require('express');
const router = express.Router();
const Segnaposto = require('../models/Segnaposto');
const Quiz = require('../models/Quiz');

// GET: Ottieni tutti i quiz
router.get('/', async (req, res) => {
  try {
    const quiz = await Quiz.find();
    res.status(200).json(quiz); // 200 esplicitamente dichiarato
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz non trovato' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const nuovoQuiz = new Quiz(req.body);
    const salvato = await nuovoQuiz.save();
    res.status(201).json({ message: 'Quiz creato con successo', quiz: salvato });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const aggiornato = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aggiornato) return res.status(404).json({ message: 'Quiz non trovato' });
    res.status(200).json({ message: 'Quiz aggiornato con successo', quiz: aggiornato });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminato = await Quiz.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ message: 'Quiz non trovato' });
    res.status(200).json({ message: 'Quiz eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;