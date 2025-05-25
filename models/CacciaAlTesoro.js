const mongoose = require('mongoose');

const CacciaAlTesoroSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  listaSegnaposti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Segnaposto' }]
});


module.exports = mongoose.model('CacciaAlTesoro', CacciaAlTesoroSchema);

