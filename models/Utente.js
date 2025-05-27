const mongoose =require('mongoose');

const UtenteSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    cognome: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ruolo: { type: String, enum: ['utente', 'amministratore'], default: 'utente' },
    dataRegistrazione: { type: Date, default: Date.now },
    segnapostiVisti: {type: [mongoose.Schema.Types.ObjectId], ref: 'Segnaposto', default: [] },
    punti: { type: Number, default: 0, min: 0 },
})

module.export= mongoose.model('Utente', UtenteSchema);