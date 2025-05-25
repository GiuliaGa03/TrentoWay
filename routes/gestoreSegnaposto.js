const express = require('express');
const router = express.Router();
const Segnaposto = require('../models/Segnaposto');
const Quiz = require('../models/Quiz');

//restituisce la lista dei segnaposto esistenti
router.get('/', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find().populate('quiz');
    res.status(200).json(segnaposti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// restituisce un singolo segnaposto in base all'ID
router.get('/:id', async (req, res) => {
  try {
    const segnaposto = await Segnaposto.findById(req.params.id).populate('quiz');
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.status(200).json(segnaposto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un nuovo segnaposto
router.post('/', async (req, res) => {
  try {
    const nuovo = new Segnaposto(req.body); // quiz deve essere un array di ObjectId
    const creato = await nuovo.save();
    res.status(201).json({ message: 'Segnaposto creato con successo'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Aggiorna un segnaposto esistente
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

// Elimina un segnaposto esistente
router.delete('/:id', async (req, res) => {
  try {
    const eliminato = await Segnaposto.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.status(200).json({ message: 'Segnaposto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:segnapostoId/quiz/:quizId', async (req, res) => {
  try {
    const { segnapostoId, quizId } = req.params;

    const segnaposto = await Segnaposto.findById(segnapostoId);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    const quizEsistente = await Quiz.findById(quizId);
    if (!quizEsistente) return res.status(404).json({ message: 'Quiz non trovato' });

    if (!segnaposto.quiz.includes(quizId)) {
      segnaposto.quiz.push(quizId);
      await segnaposto.save();
    }

    res.status(200).json({ message: 'Quiz associato al segnaposto' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:segnapostoId/quiz/:quizId', async (req, res) => {
  try {
    const { segnapostoId, quizId } = req.params;

    const segnaposto = await Segnaposto.findById(segnapostoId);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    const quizEsistente = await Quiz.findById(quizId);
    if (!quizEsistente) return res.status(404).json({ message: 'Quiz non trovato' });

    if (!segnaposto.quiz.includes(quizId)) {
      return res.status(400).json({ message: 'Il quiz non è associato a questo segnaposto' });
    }

    // Rimuovi il quiz dall'array
    segnaposto.quiz = segnaposto.quiz.filter(id => id.toString() !== quizId);
    await segnaposto.save();

    res.status(200).json({ message: 'Quiz dissociato dal segnaposto' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});












module.exports = router;