const express = require('express');
const router =express.Router();
const Utente =require('../models/Utente');
const bcrypt = require('bcrypt');
const UtenteSchema = require('../models/Utente');
const jwt = require('jsonwebtoken');
require('dotenv').config();




router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // si controlla che i campi email e password siano stati compilati
        // se uno dei due è vuoto si risponde con un errore 400
        if (!email && !password) {
          return res.status(400).json({ message: "Email e password obbligatorie" });
        }

        if (!email) {
          return res.status(400).json({ message: "Email obbligatoria" });
        }
        
        if (!password) {
          return res.status(400).json({ message: "Password obbligatoria" });
        }
        
        //presa la mail e password si cerca nel database l'utente con quella mail
        const utente = await UtenteSchema.findOne({ email });
        if (!utente){
            return res.status(404).json({ message: "Utente non trovato"});
        }

        // se l'utente ha superato il numero massimo di tentativi di login falliti
        if (utente.bloccaFinoAl && utente.bloccaFinoAl > new Date()) {
          return res.status(403).json({ message: "Troppi tentativi falliti, riprova più tardi" });
        }

        // se l'utente esiste si confronta la password inserita con quella salvata nel database
        const passwordValida = await bcrypt.compare(password, utente.password);
        if (!passwordValida) {

          utente.tentativiFallitiLogin += 1; // incrementa il contatore dei tentativi falliti
          if (utente.tentativiFallitiLogin >= 5) { // se sono stati fatti 5 tentativi falliti 
            utente.bloccaFinoAl = new Date(Date.now() + 15 * 60 * 1000); // blocca l'utente per 15 minuti
          }
          await utente.save(); // salva le modifiche all'utente
          // se la password non è corretta si risponde con un errore 401
          return res.status(401).json({ message: "Password errata" });
        }

        // se la password è corretta si resetta il contatore dei tentativi falliti e il blocco
        utente.tentativiFallitiLogin = 0;
        utente.bloccaFinoAl = null;
        await utente.save(); // salva le modifiche all'utente
        
        // il token viene generato se la password è corretta
        const token = jwt.sign(
          { userId: utente._id, role: utente.ruolo },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        

        //se l'autenticazione è avvenuta con successo la risposta contiene un json con il boobleano success con true, il token e tutti i dati utente
        res.json({
          success: true,
          token,
          user: {
            id: utente._id,
            email: utente.email,
            username: utente.username,
            ruolo: utente.ruolo
          },
          redirectTo: utente.ruolo === 'admin' ? '/admin/dashboard' : '/'
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Errore server' });
    }
});

router.post('/registrazione', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      lastName
    } = req.body;

    // bisogna controllare se tutti i campi sono stati compilati
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati' });
    }

    //email normalizzata in minuscolo per evitare problemi di case sensitivity
    const emailNormalized = email.toLowerCase();

    // si controlla che l'email abbia un formato valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({ message: 'Email non valida' });
    }


    // si controlla che lo username abbia lunghezza corretta e non contenga caratteri non validi
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (username.length < 3 || username.length > 20 || !usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Username deve essere tra 3 e 20 caratteri' });
    }


    //controllo se rispettate le lunghezze minime e massime password
    if (password.length < 5 || password.length > 30) {
      return res.status(400).json({ message: 'La password deve essere lunga tra 5 e 30 caratteri.' });
    }
    // si controlla che la password abbia almeno una lettera maiuscola, una minuscola e un numero
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero.'
      });
    }
    //si controlla che la password e la conferma password coincidano 
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Le password non coincidono.' });
    }


    // verifica utente esistente
    const utenteEsistente = await Utente.findOne({ email: emailNormalized });
    if (utenteEsistente) {
      return res.status(400).json({ message: 'Utente già registrato' });
    }

    // se tutto è andato bene si crea l'utente
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuovoUtente = new Utente({
      username,
      email: emailNormalized,
      password: hashedPassword,
      nome: firstName || '',
      cognome: lastName || '',
      ruolo: 'player', 
      tentativiFallitiLogin: 0,
      bloccaFinoAl: null,
    });

    await nuovoUtente.save();

    // si genera poi il token JWT per l'utente appena registrato che scade in 24h
    const token = jwt.sign(
      { userId: nuovoUtente._id, role: nuovoUtente.ruolo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // dopo la registrazione si risponde con un json che contiene il token, i dati dell'utente e un booleano success
    // e un redirectTo che indica dove reindirizzare l'utente in base al suo ruolo (NB admin/dashboard non esiste ancora)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: nuovoUtente._id,
        username: nuovoUtente.username,
        email: nuovoUtente.email,
        ruolo: nuovoUtente.ruolo,
      },
      redirectTo: '/'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server durante la registrazione' });
  }
});

module.exports = router;