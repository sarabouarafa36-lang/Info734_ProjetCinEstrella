// Corrigé — TD 2 — Des cartes de films, avec le « si tu as fini » (nombre de films, couleurs).
import { films, type Movie } from '../donnees/films';

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

export function Td2() {
  return (
    <main>
      <h1>TD 2 — Des cartes de films</h1>
      <p>{films.length} films</p>
      <div className="catalog">
        {films.map((movie) => (
          <FilmCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
