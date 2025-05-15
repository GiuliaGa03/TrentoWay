const mongoose = require('mongoose');

const RecensioneSchema = new mongoose.Schema({
  utenteId: String,
  testo: String,
  voto: Number
});

const QuizSchema = new mongoose.Schema({
  domanda: String,
  risposte: [String],
  indiceRispostaGiusta: Number,
  punti: Number
});

const SegnapostoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  indirizzo: String,
  descrizione: String,
  coordinate: {
    lat: Number,
    lng: Number
  },
  punti: Number,
  indizio: String,
  quiz: [QuizSchema],
  recensioni: [RecensioneSchema],
  numeroVisitatori: { type: Number, default: 0 }
});

module.exports = mongoose.model('Segnaposto', SegnapostoSchema);
