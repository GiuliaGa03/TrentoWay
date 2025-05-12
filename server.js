const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");

const app = express();
const PORT = process.env.PORT || 3000;

// Carica il file OpenAPI
const swaggerFile = fs.readFileSync("./swagger/oas3.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint di prova
app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Ciao, il server è attivo!" });
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
