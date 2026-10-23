import express from 'express'
import { films } from './films.ts'

const app = express()
const PORT = 3000

app.get('/api/films', (req, res) => {
  const annee = req.query.annee
  if (typeof annee === 'string') {
    res.json(films.filter((film) => film.year === Number(annee)))
    return
  }
  res.json(films)
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})