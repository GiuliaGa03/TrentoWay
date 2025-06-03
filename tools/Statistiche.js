class Statistiche {
  constructor(segnaposti) {
    this.segnaposti = segnaposti;
  }

  perVisite() {
    return [...this.segnaposti].sort((a, b) => b.numeroVisitatori - a.numeroVisitatori);
  }

  perNome() {
    return [...this.segnaposti].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  perVotoMedio() {
    const calcolaMedia = (recensioni) => {
      if (recensioni.length === 0) return 0;
      const somma = recensioni.reduce((acc, r) => acc + r.voto, 0);
      return somma / recensioni.length;
    };

    return [...this.segnaposti].sort((a, b) => calcolaMedia(b.recensioni) - calcolaMedia(a.recensioni));
  }
}

module.exports = Statistiche;
