// TD 14 : la base de données SQLite (un seul fichier : server/films.db).
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { films as filmsDeDepart } from './films.ts';

export type Film = { id: number; title: string; year: number; overview: string; seen: boolean };

// Une ligne telle que SQLite la renvoie : « seen » y vaut 0 ou 1.
type Ligne = { id: number; title: string; year: number; overview: string; seen: number };

// Ouvre le fichier films.db (il est créé s'il n'existe pas).
const db = new DatabaseSync(join(import.meta.dirname, 'films.db'));

// Crée la table si elle n'existe pas encore.
db.exec(`
  CREATE TABLE IF NOT EXISTS films (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    title    TEXT    NOT NULL,
    year     INTEGER NOT NULL,
    overview TEXT    NOT NULL DEFAULT '',
    seen     INTEGER NOT NULL DEFAULT 0
  )
`);

// Si la table est vide, y met les films de départ.
const { n } = db.prepare('SELECT COUNT(*) AS n FROM films').get() as { n: number };
if (n === 0) {
  const insert = db.prepare('INSERT INTO films (id, title, year, overview) VALUES (?, ?, ?, ?)');
  for (const film of filmsDeDepart) {
    insert.run(film.id, film.title, film.year, film.overview);
  }
}

// SQLite stocke « vu » en 0 ou 1. Le site attend true ou false.
function enFilm(ligne: Ligne): Film {
  return { ...ligne, seen: ligne.seen === 1 };
}

export function listFilms(annee?: number): Film[] {
  const lignes =
    annee === undefined
      ? db.prepare('SELECT * FROM films ORDER BY id').all()
      : db.prepare('SELECT * FROM films WHERE year = ? ORDER BY id').all(annee);
  return (lignes as Ligne[]).map(enFilm);
}

export function getFilm(id: number): Film | undefined {
  const ligne = db.prepare('SELECT * FROM films WHERE id = ?').get(id) as Ligne | undefined;
  return ligne && enFilm(ligne);
}

export function addFilm(title: string, year: number): Film {
  const resultat = db.prepare('INSERT INTO films (title, year) VALUES (?, ?)').run(title, year);
  return getFilm(Number(resultat.lastInsertRowid)) as Film;
}

export function setSeen(id: number, seen: boolean): void {
  db.prepare('UPDATE films SET seen = ? WHERE id = ?').run(seen ? 1 : 0, id);
}

export function deleteFilm(id: number): void {
  db.prepare('DELETE FROM films WHERE id = ?').run(id);
}

export function titleExists(title: string): boolean {
  return db.prepare('SELECT 1 FROM films WHERE title = ? COLLATE NOCASE').get(title) !== undefined;
}