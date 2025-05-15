const mongoose = require('mongoose');
require('dotenv').config();
const Segnaposto = require('./models/Segnaposto');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connesso a MongoDB. Inserimento dati...');

    await Segnaposto.deleteMany();

    const dati = [
      {
        nome: "Duomo di Trento",
        indirizzo: "Piazza Duomo, Trento",
        descrizione: "Cattedrale gotica, simbolo della città",
        coordinate: { lat: 46.0667, lng: 11.1211 },
        punti: 15,
        quiz: [
          {
            domanda: "In quale stile architettonico è costruito il Duomo?",
            risposte: ["Romanico", "Gotico", "Barocco", "Neoclassico"],
            indiceRispostaGiusta: 1,
            punti: 5
          },
          {
            domanda: "Quale papa è stato incoronato nel Duomo di Trento?",
            risposte: ["Nessuno", "Giovanni XXIII", "Pio X", "Gregorio X"],
            indiceRispostaGiusta: 3,
            punti: 7
          }
        ],
        recensioni: [
          {
            utenteId: "user123",
            testo: "Luogo affascinante, assolutamente da visitare!",
            voto: 5
          },
          {
            utenteId: "user456",
            testo: "Architettura bellissima, ma molto affollato.",
            voto: 4
          }
        ]
      },
      {
        nome: "Museo delle Scienze (MUSE)",
        indirizzo: "Corso del Lavoro e della Scienza, Trento",
        descrizione: "Museo interattivo di scienza e natura",
        coordinate: { lat: 46.0593, lng: 11.1218 },
        punti: 20,
        recensioni: [
          {
            utenteId: "marta88",
            testo: "Ottimo per i bambini, super interattivo!",
            voto: 5
          }
        ]
      }
    ];

    await Segnaposto.deleteMany(); // Opzionale: pulisce la collezione prima
    await Segnaposto.insertMany(dati);
    console.log('🎉 Dati (con quiz e recensioni) inseriti con successo!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore:', err);
  });
