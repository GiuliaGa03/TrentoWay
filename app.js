const Segnaposto = require('./models/Segnaposto');
const Quiz = require('./models/Quiz');

const express = require("express");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");
const cors = require('cors')
const path = require("path");
const app = express();
const gestoreSegnaposti= require("./routes/gestoreSegnaposto.js");
const gestoreQuiz = require("./routes/gestoreQuiz.js");


// Carica il file OpenAPI
const swaggerFile = fs.readFileSync("./swagger/oas3.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS requests
app.use(cors())

// Serve i file statici dalla cartella "static"
app.use(express.static(path.join(__dirname, 'static')));

// Per ogni altro percorso non gestito dai file statici, restituisci `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});



//tutte le route per segnaposti vengono gestite da gestoreSegnaposti.js
app.use('/api/v1/segnaposti', gestoreSegnaposti);

//tutte le route per quiz vengono gestite da gestoreQuiz.js
app.use('/api/v1/quiz', gestoreQuiz);

//tutte le route per la caccia al tesoro vengono gestite da gestoreCacciaAlTesoro.js
app.use('/api/v1/caccia', gestoreCacciaAlTesoro);


// Questo endpoint restituisce la chiave API di Google Maps in un file JavaScript per via della sicurezza (la chiave deve stare in .env e mai su github)
app.get('/api/maps-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.GOOGLE_MAPS_API_KEY = "${process.env.GOOGLE_MAPS_API_KEY}";`);
});




module.exports = app; //serve qunado viene istanziata dagli altri file come index che la richiama cosi: const app = require("./app");