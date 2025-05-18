const mongoose = require('mongoose');

// Schema per una singola risposta
const RispostaSchema = new mongoose.Schema({
  testo: { type: String, required: true },
  corretta: { type: Boolean, default: false }
});

// Schema del quiz completo
const QuizSchema = new mongoose.Schema({
  domanda: { type: String, required: true },
  risposte: {
    type: [RispostaSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0 
  },
  punti: { type: Number, default: 0, min: 0 }
});

module.exports = mongoose.model('Quiz', QuizSchema);
