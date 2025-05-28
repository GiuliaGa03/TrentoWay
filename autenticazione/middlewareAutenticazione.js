//lo scopo del middleware è quello di recuperare il token dalla richiesta
//controla se è valido e lo spacchetta in modo da recuperare i dati dell'utente
// coi dati utente puo legge il ruolo
// per evitare poi di far fare il controllo del ruolo alle route questo middleware permette di definire
// un ruolo specifico che deve essere presente nel token per poter accedere alla route e queto viene 
// definito nel momemto che si aggiunge il middleware alla route


const jwt = require('jsonwebtoken');

const authMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token mancante o malformato' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // es: { userId: "...", role: "admin" }

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Accesso negato: ruolo insufficiente' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token non valido' });
    }
  };
};

module.exports = authMiddleware;











