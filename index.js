require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");



const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;

// Connessione a MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connessione a MongoDB Atlas riuscita!");
    
    // Avvia il server solo dopo la connessione al DB
    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
    
  })
  .catch((err) => {
    console.error("Errore di connessione a MongoDB:", err);
  });



