const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Segnaposto = require('../models/Segnaposto');
const Quiz = require('../models/Quiz');
const CacciaAlTesoro = require('../models/CacciaAlTesoro');
const Utente = require('../models/Utente');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connesso a MongoDB. Pulizia dati...');

    await Segnaposto.deleteMany();
    await Quiz.deleteMany();
    await CacciaAlTesoro.deleteMany();
    await Utente.deleteMany();

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

const quiz4= await Quiz.create({
  domanda: "Qual è lo stile architettonico principale della Basilica di Santa Maria Maggiore a Trento?",
  risposte: [
    { testo: "Romanico", corretta: true },
    { testo: "Barocco", corretta: false },
    { testo: "Gotico", corretta: false },
    { testo: "Rinascimentale", corretta: false }
  ],
  punti: 5
});


    console.log('Creazione segnaposti...');

    const segnapostiCreati = await Segnaposto.create([
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
      }, 
      {
        nome: "Basilica di Santa Maria Maggiore",
        indirizzo: "Vicolo delle Orsoline, Trento",
        descrizione: "La Basilica di Santa Maria Maggiore a Trento è uno degli edifici religiosi più importanti e antichi della città. Costruita tra il XVI e il XVII secolo in stile rinascimentale, si distingue per la sua facciata semplice ma elegante e per gli interni riccamente decorati, con affreschi e opere d'arte sacra. La basilica ha un ruolo centrale nella vita religiosa e culturale di Trento, essendo sede di numerosi eventi e celebrazioni storiche.",
        coordinate: { lat: 46.0686, lng: 11.1194 },
        punti: 15,
        indizio: "",
        quiz: [quiz4._id],
        recensioni: [],
        numeroVisitatori: 0
      }
    ]);

    console.log('Creazione caccia al tesoro...');

  await CacciaAlTesoro.create({
    titolo: "Tesoro di Trento",
    descrizione: "Un'avventura tra i luoghi più iconici di Trento.",
    listaSegnaposti: segnapostiCreati.map((sp, index) => ({
      segnaposto: sp._id,
      ordine: index + 1 // Ordine crescente da 1 in poi
    }))
  });

  console.log('Creazione utenti...');

  await Utente.create({
  username: "adminTrento",
  email: "admin@admin",
  password: "Admin1",
  nome: "Mario",
  cognome: "Rossi",
  ruolo: "admin",
  segnapostiSbloccati: []  // puoi mettere ObjectId di segnaposti se vuoi
  },
  {
  username: "playerLuca",
  email: "player@player",
  password: "Player1",
  nome: "Luca",
  cognome: "Bianchi",
  ruolo: "player",
  segnapostiSbloccati: []
});




    console.log('Dati inseriti con successo!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Errore durante il seed:', err);
    mongoose.disconnect();
  });
