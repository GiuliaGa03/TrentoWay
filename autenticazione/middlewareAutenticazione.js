//lo scopo del middleware è quello di recuperare il token dalla richiesta
//controla se è valido e lo spacchetta in modo da recuperare i dati dell'utente (id e ruolo e nulla di più)
// coi dati utente puo legge il ruolo
// per evitare poi di far fare il controllo del ruolo alle route singole, questo middleware, permette di definire
// uno o piu ruoli che possono accedere alla route direttamente qunado viene aggiunto (es : router.get('/', Auth('admin', 'player') ,async (req, res) => {....)



const jwt = require('jsonwebtoken');

//commento che spiega il funzionamento del middleware qunado si passa col mouse sopra il nome della funzione
/**
 * Middleware di autenticazione + autorizzazione a ruoli specifici
 * @param {...string} allowedRoles - Ruoli che hanno accesso alla route
 */

const authMiddleware = (...allowedRoles) => {  //i tre puntini indicano che si possono passare più ruoli come argomenti, prendendoli come un array
  return (req, res, next) => {
    const authHeader = req.headers.authorization; // recupera l'header di autorizzazione dalla richiesta
    if (!authHeader || !authHeader.startsWith('Bearer ')) {    // controlla se l'header esiste e inizia con 'Bearer '
      return res.status(401).json({ message: 'Token mancante o malformato' });
    }

    // essento che l'eader è composto da " Bearer 'token' ", per prendere il token si divide la stringa
    // tra Bearrer e token dove c'è lo spazio e si prende la seconda parte [1], ovvero solo il token
    const token = authHeader.split(' ')[1]; 
    
    

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // es: { userId: "...", role: "admin" }
        //la prima condizione controlla se sono stati passati dei ruoli al middleware e la seconda se il ruolo passato nel token è tra quelli passati al middleware
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











