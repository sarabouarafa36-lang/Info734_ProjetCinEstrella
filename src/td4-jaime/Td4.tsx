// Corrigé — TD 4 — J'aime, et un champ de saisie.
// Partie A : chaque LikeButton garde son propre état. Le « si tu as fini » (total) est dans Total,
// en bas du fichier : l'état monte dans le parent, et les boutons le reçoivent en props.
import { useState } from 'react';
import { films } from '../donnees/films';

function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>♥ {likes}</button>;
}

export function Td4() {
  const [name, setName] = useState('');
  return (
    <main>
      <h1>TD 4 — J'aime, et un champ de saisie</h1>
      <h2>Partie A</h2>
      <div className="catalog">
        {films.slice(0, 3).map((movie) => (
          <article className="movie" key={movie.id}>
            <h3>{movie.title}</h3>
            <LikeButton />
          </article>
        ))}
      </div>
      <h2>Partie B</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton prénom" />
      {name.trim() === '' ? (
        <p>Tape ton prénom.</p>
      ) : (
        <p>
          Bonjour {name} ! ({name.length} caractères)
        </p>
      )}
      <Total />
    </main>
  );
}

function SharedLikeButton({ likes, onLike }: { likes: number; onLike: () => void }) {
  return <button onClick={onLike}>♥ {likes}</button>;
}

function Total() {
  const [likes, setLikes] = useState<Record<number, number>>({});
  const total = Object.values(likes).reduce((sum, n) => sum + n, 0);
  return (
    <>
      <h2>Si tu as fini : le total</h2>
      <p>Total : {total} ♥</p>
      <div className="catalog">
        {films.slice(0, 3).map((movie) => (
          <article className="movie" key={movie.id}>
            <h3>{movie.title}</h3>
            <SharedLikeButton
              likes={likes[movie.id] ?? 0}
              onLike={() => setLikes({ ...likes, [movie.id]: (likes[movie.id] ?? 0) + 1 })}
            />
          </article>
        ))}
      </div>
    </>
  );
}
