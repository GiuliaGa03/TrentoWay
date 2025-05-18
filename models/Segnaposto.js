const mongoose = require('mongoose');

const CoordinateSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  }
}, { _id: false });

const RecensioneSchema = new mongoose.Schema({
  utenteId: { type: String, required: true },
  testo: { type: String, required: true },
  voto: { type: Number, required: true, min: 1, max: 5 }
}, { _id: true });

const SegnapostoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  indirizzo: { type: String, default: '' },
  descrizione: { type: String, default: '' },
  coordinate: {
    type: CoordinateSchema,
    required: true
  },
  punti: { type: Number, default: 0, min: 0 },
  indizio: { type: String, default: '' },
  quiz: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: [] }],
  recensioni: { type: [RecensioneSchema], default: [] },
  numeroVisitatori: { type: Number, default: 0, min: 0 }
});

module.exports = mongoose.model('Segnaposto', SegnapostoSchema);
