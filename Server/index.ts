import express from 'express'
import { films } from './films.ts'

const app = express()
const PORT = 3000

// Journal : une ligne par requête, par exemple « GET /api/films/999 404 »
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`)
  })
  next()
})
// TD 12 : lit le corps JSON des requêtes et le met dans req.body.
app.use(express.json());

app.get('/api/films', (req, res) => {
  const annee = req.query.annee
  if (typeof annee === 'string') {
    res.json(films.filter((film) => film.year === Number(annee)))
    return
  }
  res.json(films)
})

app.get('/api/films/:id', (req, res) => {
  const idTexte = req.params.id

  // 400 : l'identifiant n'est pas un nombre entier
  if (!/^-?\d+$/.test(idTexte)) {
    res.status(400).json({ erreur: `L'identifiant « ${idTexte} » n'est pas un nombre entier.` })
    return
  }

  const film = films.find((f) => f.id === Number(idTexte))

  // 404 : aucun film n'a cet identifiant
  if (!film) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${idTexte}.` })
    return
  }

  res.json(film)
})

// TD 12 : ajouter un film.
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

  const film = {
    id: Math.max(0, ...films.map((f) => f.id)) + 1,
    title: titre,
    year,
    overview: '',
  };
  films.push(film);
  res.status(201).json(film);
});

// TD 13 : transforme le texte de l'adresse en nombre entier, ou renvoie null si ce n'en est pas un.
function lireId(texte: string): number | null {
  return /^-?\d+$/.test(texte) ? Number(texte) : null;
}

// TD 13 : marquer un film vu, ou à voir.
app.patch('/api/films/:id', (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) {
    res.status(400).json({ erreur: "L'identifiant n'est pas un nombre entier." });
    return;
  }

  const film = films.find((f) => f.id === id);
  if (!film) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${id}.` });
    return;
  }

  const { seen } = req.body ?? {};
  if (typeof seen !== 'boolean') {
    res.status(400).json({ erreur: 'Le champ « seen » doit être true ou false.' });
    return;
  }

  film.seen = seen;
  res.json(film);
});

// TD 13 : supprimer un film.
app.delete('/api/films/:id', (req, res) => {
  const id = lireId(req.params.id);
  if (id === null) {
    res.status(400).json({ erreur: "L'identifiant n'est pas un nombre entier." });
    return;
  }

  const index = films.findIndex((f) => f.id === id);
  if (index === -1) {
    res.status(404).json({ erreur: `Aucun film n'a l'identifiant ${id}.` });
    return;
  }

  films.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})