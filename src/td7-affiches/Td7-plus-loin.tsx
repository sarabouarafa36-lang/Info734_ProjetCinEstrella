// Corrigé — TD 7, « aller plus loin » : sélection, filtre par année, tri, résumé au clic.
// Pour l'essayer : copier ce fichier à la place de Td7.tsx.
import { useEffect, useState } from 'react';
import type { Movie } from '../donnees/films';

function FilmCard({
  movie,
  selected,
  opened,
  onToggle,
  onOpen,
}: {
  movie: Movie;
  selected: boolean;
  opened: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="movie">
      <div className={`poster tone-${movie.id % 6}`} onClick={onOpen} style={{ cursor: 'pointer' }}>
        <span>Au cinéma</span>
        <strong>{movie.title}</strong>
        <span>{movie.year}</span>
      </div>
      <h3>{movie.title}</h3>
      <p className="year">{movie.year}</p>
      {opened && <p className="hint">{movie.overview}</p>}
      <button onClick={onToggle}>{selected ? 'Retirer' : 'Sélectionner'}</button>
    </article>
  );
}

export function Td7() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState<'title' | 'year'>('title');
  const [ids, setIds] = useState<number[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/films.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Movie[] = await response.json();
        setMovies(data);
      } catch {
        setError('Impossible de charger les films.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const years = [...new Set(movies.map((m) => m.year))].sort();
  const visible = movies
    .filter(
      (m) =>
        m.title.toLowerCase().includes(query.trim().toLowerCase()) &&
        (year === '' || m.year === Number(year)),
    )
    .sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title, 'fr') : b.year - a.year));

  function toggle(id: number) {
    setIds((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
  }

  return (
    <main>
      <h1>TD 7 — Les affiches</h1>
      <label htmlFor="query">Rechercher un film</label>
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
      <label htmlFor="sort">Trier par</label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value === 'year' ? 'year' : 'title')}
        style={{ maxWidth: 260 }}
      >
        <option value="title">Titre</option>
        <option value="year">Année, du plus récent</option>
      </select>
      {loading && <p>Chargement des films…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <p>
            {visible.length} film(s) · {ids.length} sélectionné(s)
          </p>
          {visible.length === 0 && <p>Aucun film ne correspond.</p>}
          <div className="catalog">
            {visible.map((movie) => (
              <FilmCard
                key={movie.id}
                movie={movie}
                selected={ids.includes(movie.id)}
                opened={openedId === movie.id}
                onToggle={() => toggle(movie.id)}
                onOpen={() => setOpenedId(openedId === movie.id ? null : movie.id)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
