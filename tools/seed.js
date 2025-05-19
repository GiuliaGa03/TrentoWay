const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Segnaposto = require('../models/Segnaposto');
const Quiz = require('../models/Quiz');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connesso a MongoDB. Pulizia dati...');

    await Segnaposto.deleteMany();
    await Quiz.deleteMany();

    console.log('Creazione quiz...');

    const quiz1 = await Quiz.create({
      domanda: "In quale stile architettonico è costruito il Duomo?",
      risposte: [
        { testo: "Romanico", corretta: false },
        { testo: "Gotico", corretta: true },
        { testo: "Barocco", corretta: false },
        { testo: "Neoclassico", corretta: false }
      ],
      punti: 5
    });

    const quiz2 = await Quiz.create({
      domanda: "Quale papa è stato incoronato nel Duomo di Trento?",
      risposte: [
        { testo: "Nessuno", corretta: false },
        { testo: "Giovanni XXIII", corretta: false },
        { testo: "Pio X", corretta: false },
        { testo: "Gregorio X", corretta: true }
      ],
      punti: 7
    });

    const quiz3 = await Quiz.create({
      domanda: "Che tipo di mostre si trovano al MUSE?",
      risposte: [
        { testo: "Arte moderna", corretta: false },
        { testo: "Storia medievale", corretta: false },
        { testo: "Scienze naturali", corretta: true },
        { testo: "Cinema", corretta: false }
      ],
      punti: 6
    });

    console.log('Creazione segnaposti...');

    await Segnaposto.create([
      {
        nome: "Duomo di Trento",
        indirizzo: "Piazza Duomo, Trento",
        descrizione: "Cattedrale gotica, simbolo della città",
        coordinate: { lat: 46.0667, lng: 11.1211 },
        punti: 15,
        indizio: "",
        quiz: [quiz1._id, quiz2._id],
        recensioni: [
          { utenteId: "user123", testo: "Bellissimo posto!", voto: 5 },
          { utenteId: "user456", testo: "Imponente e ricco di storia", voto: 4 }
        ],
        numeroVisitatori: 0
      },
      {
        nome: "Museo delle Scienze (MUSE)",
        indirizzo: "Corso del Lavoro e della Scienza, Trento",
        descrizione: "Museo interattivo di scienza e natura",
        coordinate: { lat: 46.0593, lng: 11.1218 },
        punti: 20,
        indizio: "",
        quiz: [quiz3._id],
        recensioni: [
          { utenteId: "marta88", testo: "Perfetto per i bambini", voto: 5 }
        ],
        numeroVisitatori: 0
      }
    ]);

    console.log('Dati inseriti con successo!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Errore durante il seed:', err);
    mongoose.disconnect();
  });
