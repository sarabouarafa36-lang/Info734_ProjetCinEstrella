import express from 'express';
import { addFilm, deleteFilm, getFilm, listFilms, setSeen, titleExists } from './db.ts';

const app = express();

// Journal : une ligne par requête, par exemple « GET /api/films/999 404 ».
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

// Lit le corps JSON des requêtes (POST, PATCH).
app.use(express.json());

// Transforme le texte de l'adresse en nombre entier, ou renvoie null si ce n'en est pas un.
function lireId(texte: string): number | null {
  return /^-?\d+$/.test(texte) ? Number(texte) : null;
}

// Tous les films. Bonus : /api/films?annee=2025, la base choisit les films de cette année.
app.get('/api/films', (req, res) => {
  if (req.query.annee === undefined) {
    res.json(listFilms());
    return;
  }
  const annee = Number(req.query.annee);
  res.json(Number.isInteger(annee) ? listFilms(annee) : []);
});

// Un seul film.
app.get('/api/films/:id', (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) {
    res.status(400).json({ erreur: `L'identifiant « ${req.params.id} » n'est pas un nombre entier.` });
    return;
  }

  const film = getFilm(id);
  if (!film) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${id}.` });
    return;
  }

  res.json(film);
});

// Ajouter un film.
app.post('/api/films', (req, res) => {
  const { title, year } = req.body ?? {};

  const titre = typeof title === 'string' ? title.trim() : '';
  if (titre.length < 1 || titre.length > 80) {
    res.status(400).json({ erreur: 'Le titre doit faire de 1 à 80 caractères.' });
    return;
  }

  if (typeof year !== 'number' || !Number.isInteger(year) || year < 1888 || year > 2030) {
    res.status(400).json({ erreur: "L'année doit être un nombre entier, de 1888 à 2030." });
    return;
  }

  // Bonus : un titre déjà présent est refusé (409 = conflit).
  if (titleExists(titre)) {
    res.status(409).json({ erreur: 'Un film porte déjà ce titre.' });
    return;
  }

  res.status(201).json(addFilm(titre, year));
});

// Marquer un film vu, ou à voir.
app.patch('/api/films/:id', (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) {
    res.status(400).json({ erreur: "L'identifiant n'est pas un nombre entier." });
    return;
  }

  const film = getFilm(id);
  if (!film) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${id}.` });
    return;
  }

  const { seen } = req.body ?? {};
  if (typeof seen !== 'boolean') {
    res.status(400).json({ erreur: 'Le champ « seen » doit être true ou false.' });
    return;
  }

  setSeen(id, seen);
  res.json({ ...film, seen });
});

// Supprimer un film.
app.delete('/api/films/:id', (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) {
    res.status(400).json({ erreur: "L'identifiant n'est pas un nombre entier." });
    return;
  }

  if (!getFilm(id)) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${id}.` });
    return;
  }

  deleteFilm(id);
  res.status(204).end();
});

app.listen(3000, () => console.log('API des films : http://localhost:3000/api/films'));