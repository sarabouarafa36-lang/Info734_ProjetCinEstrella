// Corrigé — TD 7 — Les affiches : la liste chargée avec fetch, avec la recherche.
// TD 10 : la grille charge /api/films, depuis le serveur ; le proxy de Vite transmet la requête au port 3000.
// TD 12 : un formulaire ajoute un film avec POST.
import { useEffect, useState, type FormEvent } from 'react';
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

  // TD 12 : l'état du formulaire.
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/films');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Movie[] = await response.json();
        setMovies(data);
      } catch {
        setError('Le serveur ne répond pas. Est-il lancé (npm run server) ?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function addFilm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFormError(null);
    try {
      const response = await fetch('/api/films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, year: Number(year) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.erreur);
        return;
      }
      setMovies((previous) => [...previous, data]);
      setTitle('');
      setYear('');
    } catch {
      setFormError('Le serveur ne répond pas.');
    } finally {
      setSending(false);
    }
  }

  const visible = movies.filter((m) => m.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main>
      <h1>TD 7 — Les affiches</h1>

      <form onSubmit={addFilm}>
        <h2>Ajouter un film</h2>
        <label htmlFor="title">Titre</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="year">Année</label>
        <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <button type="submit" disabled={sending}>
          {sending ? 'Envoi…' : 'Ajouter'}
        </button>
        {formError && <p className="error">{formError}</p>}
      </form>

      <label htmlFor="query">Rechercher un film</label>
      <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Chargement des films…</p>}
      {error && <p className="error">{error}</p>}
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