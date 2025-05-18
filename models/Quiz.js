const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  domanda: { type: String, required: true },
  risposte: [{ type: String, required: true }],
  indiceRispostaGiusta: { type: Number, required: true },
  punti: { type: Number, default: 0 }
});

module.exports = mongoose.model('Quiz', QuizSchema);
