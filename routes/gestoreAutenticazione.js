const express = require('express');
const router =express.Router();
const Utente =erquire('../models/Utente');
const bcrypt = require('bcrypt');
const database = require('mime-db');


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        //presa la mail e password si cerca nel database l'utente con quella mail
        const utente = await Utente.findOne({ email });
        if (!utente){
            return res.status(404).json({ message: "Utente non trovato"});
        }

        // se l'utente esiste si confronta la password inserita con quella salvata nel database
        const passwordValida = await bcrypt.compare(password, utente.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Password errata" });
        }
        
        // il token viene generato se la password è corretta
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        //se l'autenticazione è avvenuta con successo la risposta contiene un json con il boobleano success con true, il token e tutti i dati utente
        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
          },
          redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/game/map'
        });
    } catch (error) {
        res.status(500).json({ error: 'Errore server' });
    }
});
