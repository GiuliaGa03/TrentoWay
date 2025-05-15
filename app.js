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

// Endpoint di prova
app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Ciao, il server è attivo!" });
});

app.use(express.static(path.join(__dirname, 'static'))); //express.static è un middleware montato con app.use che serve i file statici 
                                                        //che si trovano nella cartella static.

app.get('/', (req, res) => {   //restituisce la pagina index.html nel percorso home /
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/api/maps-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});



module.exports = app; //serve qunado viene istanziata dagli altri file come index che la richiama cosi: const app = require("./app");