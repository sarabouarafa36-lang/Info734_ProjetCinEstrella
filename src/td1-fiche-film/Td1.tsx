// Corrigé — TD 1 — Ma fiche film, avec le « si tu as fini » (résumé manquant).
const film = {
  title: 'Dernier métro pour Mars',
  year: 2026,
  overview: 'Une conductrice découvre une station absente de tous les plans.',
};

export function Td1() {
  return (
    <main>
      <h1>TD 1 — Ma fiche film</h1>
      <article className="fiche">
        <div className="poster tone-1">
          <span>Au cinéma</span>
          <strong>{film.title}</strong>
          <span>{film.year}</span>
        </div>
        <h2>{film.title}</h2>
        {film.year >= 2025 && <p className="nouveau">Nouveau !</p>}
        <p className="year">{film.year}</p>
        <p>{film.overview || 'Résumé indisponible.'}</p>
      </article>
    </main>
  );
}
