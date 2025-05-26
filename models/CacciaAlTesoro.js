const mongoose = require('mongoose');

const CacciaAlTesoroSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  listaSegnaposti: [{
    segnaposto: { type: mongoose.Schema.Types.ObjectId, ref: 'Segnaposto' },
    ordine: { type: Number, required: true }
  }]
});


module.exports = mongoose.model('CacciaAlTesoro', CacciaAlTesoroSchema);

