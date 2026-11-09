// Corrigé — TD 7 — Les affiches : la liste chargée avec fetch, avec la recherche.
// TD 10 : la grille charge /api/films, depuis le serveur ; le proxy de Vite transmet la requête au port 3000.
// TD 12 : un formulaire ajoute un film avec POST.
// TD 13 : « Vu » (PATCH) et « Supprimer » (DELETE), toujours après la réponse du serveur.
import { useEffect, useState, type FormEvent } from 'react';
import type { Movie } from '../donnees/films';

type Film = Movie & { seen?: boolean };

function FilmCard({
  movie,
  busy,
  onToggleSeen,
  onDelete,
}: {
  movie: Film;
  busy: boolean;
  onToggleSeen: () => void;
  onDelete: () => void;
}) {
  return (
    <article className={movie.seen ? 'movie seen' : 'movie'}>
      <div className={`poster tone-${movie.id % 6}`}>
        <span>Au cinéma</span>
        <strong>{movie.title}</strong>
        <span>{movie.year}</span>
      </div>
      <h3>{movie.title}</h3>
      <p className="year">
        {movie.year} {movie.seen && '· ✓ Vu'}
      </p>
      <div className="actions">
        <button onClick={onToggleSeen} disabled={busy}>
          {movie.seen ? 'À revoir' : 'Vu'}
        </button>
        <button onClick={onDelete} disabled={busy}>
          Supprimer
        </button>
      </div>
    </article>
  );
}

export function Td7() {
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // TD 12 : l'état du formulaire.
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // TD 13 : l'état des boutons des cartes.
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/films');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Film[] = await response.json();
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

  async function toggleSeen(movie: Film) {
    setActionError(null);
    setBusyId(movie.id);
    try {
      const response = await fetch(`/api/films/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seen: !movie.seen }),
      });
      if (!response.ok) {
        const data = await response.json();
        setActionError(data.erreur);
        return;
      }
      const updated: Film = await response.json();
      setMovies((previous) => previous.map((m) => (m.id === updated.id ? updated : m)));
    } catch {
      setActionError("Le serveur ne répond pas : le film n'a pas été modifié.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeFilm(movie: Film) {
    if (!window.confirm(`Supprimer « ${movie.title} » ?`)) return;
    setActionError(null);
    setBusyId(movie.id);
    try {
      const response = await fetch(`/api/films/${movie.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        setActionError(data.erreur);
        return;
      }
      setMovies((previous) => previous.filter((m) => m.id !== movie.id));
    } catch {
      setActionError("Le serveur ne répond pas : le film n'a pas été supprimé.");
    } finally {
      setBusyId(null);
    }
  }

  const visible = movies.filter((m) => m.title.toLowerCase().includes(query.trim().toLowerCase()));
  const seenCount = movies.filter((m) => m.seen).length;

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
          <p>
            {visible.length} film(s) affiché(s) · {seenCount} film(s) vu(s) sur {movies.length}
          </p>
          {actionError && <p className="error">{actionError}</p>}
          {visible.length === 0 && <p>Aucun film ne correspond.</p>}
          <div className="catalog">
            {visible.map((movie) => (
              <FilmCard
                key={movie.id}
                movie={movie}
                busy={busyId === movie.id}
                onToggleSeen={() => toggleSeen(movie)}
                onDelete={() => removeFilm(movie)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}