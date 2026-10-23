// Corrigé — TD 5 — Chercher un film, avec le « si tu as fini » (filtre par année).
// Question : visible se déduit de query à chaque affichage. Un second état pourrait se
// désynchroniser de query, et demanderait de le tenir à jour à chaque frappe.
import { useState } from 'react';
import { films } from '../donnees/films';

const years = [...new Set(films.map((m) => m.year))].sort();

export function Td5() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const visible = films.filter(
    (m) =>
      m.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (year === '' || m.year === Number(year)),
  );
  return (
    <main>
      <h1>TD 5 — Chercher un film</h1>
      <label htmlFor="query">Titre</label>
      <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <label htmlFor="year">Année</label>
      <select id="year" value={year} onChange={(e) => setYear(e.target.value)} style={{ maxWidth: 160 }}>
        <option value="">Toutes</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <p>{visible.length} résultat(s)</p>
      {visible.length === 0 && <p>Aucun film ne correspond.</p>}
      <div className="catalog">
        {visible.map((movie) => (
          <article className="movie" key={movie.id}>
            <div className={`poster tone-${movie.id % 6}`}>
              <strong>{movie.title}</strong>
            </div>
            <h3>{movie.title}</h3>
            <p className="year">{movie.year}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
