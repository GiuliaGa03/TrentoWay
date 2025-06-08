const mongoose = require('mongoose');

const utenteSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nome:     { type: String },
  cognome:  { type: String },
  ruolo:    { type: String, default: 'player' },
  segnapostiSbloccati: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Segnaposto', default: [] }],
  punteggio: { type: Number, default: 0 },
});

module.exports = mongoose.model('Utente', utenteSchema);