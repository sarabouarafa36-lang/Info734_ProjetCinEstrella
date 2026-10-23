// Corrigé — TD 7 — Les affiches : la liste chargée avec fetch, avec la recherche.
// « Aller plus loin » (sélection, filtre par année, tri, résumé au clic) : Td7-plus-loin.tsx.
import { useEffect, useState } from 'react';
import type { Movie } from '../donnees/films';

function FilmCard({ movie }: { movie: Movie }) {
  return (
    <article className="movie">
      <div className={`poster tone-${movie.id % 6}`}>
        <span>Au cinéma</span>
        <strong>{movie.title}</strong>
        <span>{movie.year}</span>
      </div>
      <h3>{movie.title}</h3>
      <p className="year">{movie.year}</p>
    </article>
  );
}

export function Td7() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch('/api/films', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Movie[] = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError('Impossible de charger les films. Le serveur ne répond pas.');
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setError(null);
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  const visible = movies.filter((m) => m.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main>
      <h1>TD 7 — Les affiches</h1>
      <label htmlFor="query">Rechercher un film</label>
      <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Chargement des films…</p>}
      {error && (
        <>
          <p className="error">{error}</p>
          <button onClick={retry}>Réessayer</button>
        </>
      )}
      {!loading && !error && (
        <>
          <p>{visible.length} film(s)</p>
          {visible.length === 0 && <p>Aucun film ne correspond.</p>}
          <div className="catalog">
            {visible.map((movie) => (
              <FilmCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
