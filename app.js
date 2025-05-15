const Segnaposto = require('./models/Segnaposto');
const express = require("express");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");
const cors = require('cors')

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

// Endpoint di prova
app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Ciao, il server è attivo!" });
});

// GET: Ottieni tutti i segnaposti
app.get('/api/segnaposti', async (req, res) => {
  try {
    const segnaposti = await Segnaposto.find();
    res.json(segnaposti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Aggiungi un nuovo segnaposto
app.post('/api/segnaposti', async (req, res) => {
  try {
    const nuovoSegnaposto = new Segnaposto(req.body);
    const salvato = await nuovoSegnaposto.save();
    res.status(201).json(salvato);
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
      { new: true } // restituisce il documento aggiornato
    );
    if (!aggiornato) {
      return res.status(404).json({ message: 'Segnaposto non trovato' });
    }
    res.json(aggiornato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Elimina un segnaposto
app.delete('/api/segnaposti/:id', async (req, res) => {
  try {
    const eliminato = await Segnaposto.findByIdAndDelete(req.params.id);
    if (!eliminato) {
      return res.status(404).json({ message: 'Segnaposto non trovato' });
    }
    res.json({ message: 'Segnaposto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Ottieni un singolo segnaposto per ID
app.get('/api/segnaposti/:id', async (req, res) => {
  try {
    const segnaposto = await Segnaposto.findByIdAndUpdate(
      req.params.id,
      { $inc: { numeroVisitatori: 1 } }, // test incremento automatico
      { new: true }
    );
    if (!segnaposto) {
      return res.status(404).json({ message: 'Segnaposto non trovato' });
    }
    res.json(segnaposto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = app; //serve qunado viene istanziata dagli altri file come index che la richiama cosi: const app = require("./app");