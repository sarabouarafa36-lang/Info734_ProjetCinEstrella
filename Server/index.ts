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

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})