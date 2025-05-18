const Segnaposto = require('./models/Segnaposto');
const Quiz = require('./models/Quiz');

const express = require("express");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");
const cors = require('cors')
const path = require("path");
const app = express();



// Carica il file OpenAPI
const swaggerFile = fs.readFileSync("./swagger/oas3.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS requests
 */
app.use(cors())



// Serve i file statici dalla cartella "static"
app.use(express.static(path.join(__dirname, 'static')));

// Per ogni altro percorso non gestito dai file statici, restituisci `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// GET: Ottieni tutti i segnaposti
app.get('/api/segnaposti', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find().populate('quiz');
    res.json(segnaposti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Ottieni un singolo segnaposto per ID
app.get('/api/segnaposti/:id', async (req, res) => {
  try {
    const segnaposto = await Segnaposto.findById(req.params.id).populate('quiz');
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.json(segnaposto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Aggiungi un nuovo segnaposto
app.post('/api/segnaposti', async (req, res) => {
  try {
    const nuovo = new Segnaposto(req.body); // quiz deve essere un array di ObjectId
    const creato = await nuovo.save();
    res.status(201).json(creato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Aggiorna un segnaposto esistente
app.put('/api/segnaposti/:id', async (req, res) => {
  try {
    const aggiornato = await Segnaposto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!aggiornato) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.json(aggiornato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Elimina un segnaposto
app.delete('/api/segnaposti/:id', async (req, res) => {
  try {
    const eliminato = await Segnaposto.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ message: 'Segnaposto non trovato' });
    res.json({ message: 'Segnaposto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Ottieni tutti i quiz
app.get('/api/quiz', async (req, res) => {
  try {
    const quiz = await Quiz.find();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Ottieni un singolo quiz per ID
app.get('/api/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz non trovato' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Aggiungi un nuovo quiz
app.post('/api/quiz', async (req, res) => {
  try {
    const nuovoQuiz = new Quiz(req.body);
    const salvato = await nuovoQuiz.save();
    res.status(201).json(salvato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Aggiorna un quiz esistente
app.put('/api/quiz/:id', async (req, res) => {
  try {
    const aggiornato = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aggiornato) return res.status(404).json({ message: 'Quiz non trovato' });
    res.json(aggiornato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Elimina un quiz
app.delete('/api/quiz/:id', async (req, res) => {
  try {
    const eliminato = await Quiz.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ message: 'Quiz non trovato' });
    res.json({ message: 'Quiz eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Aggiungere quiz a un segnaposto esistente
app.post('/api/segnaposti/:id/quiz', async (req, res) => {
  try {
    const nuovoQuiz = await Quiz.create(req.body);
    const segnaposto = await Segnaposto.findById(req.params.id);
    if (!segnaposto) return res.status(404).json({ message: 'Segnaposto non trovato' });

    segnaposto.quiz.push(nuovoQuiz._id);
    await segnaposto.save();

    res.status(201).json({ message: 'Quiz aggiunto e associato al segnaposto', quiz: nuovoQuiz });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// Questo endpoint restituisce la chiave API di Google Maps in un file JavaScript per via della sicurezza (la chiave deve stare in .env e mai su github)
app.get('/api/maps-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.GOOGLE_MAPS_API_KEY = "${process.env.GOOGLE_MAPS_API_KEY}";`);
});




module.exports = app; //serve qunado viene istanziata dagli altri file come index che la richiama cosi: const app = require("./app");