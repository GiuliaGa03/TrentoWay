const mongoose = require('mongoose');

const CoordinateSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const SegnapostoSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  indirizzo: { type: String, required: true },
  coordinate: {
    type: CoordinateSchema,
    required: true
  },
  quiz: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz' // Riferimento al modello Quiz
  }],
  indizio: { type: String, default: null },
  punti: { type: Number, default: 0 }
});

module.exports = mongoose.model('Segnaposto', SegnapostoSchema);
