// Corrigé — TD 3 — Un compteur, avec le « si tu as fini » (le pas).
// Question : changer une variable ne prévient pas React. setCount enregistre la nouvelle valeur et
// demande un nouvel affichage ; la fonction Td3 est rappelée et lit la nouvelle valeur.
import { useState } from 'react';

export function Td3() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  return (
    <main>
      <h1>TD 3 — Un compteur</h1>
      <p className="compteur" style={{ color: count >= 10 ? 'crimson' : undefined }}>
        {count}
      </p>
      <button disabled={count === 0} onClick={() => setCount(Math.max(0, count - step))}>
        −{step}
      </button>{' '}
      <button onClick={() => setCount(count + step)}>+{step}</button>{' '}
      <button onClick={() => setCount(0)}>Remettre à zéro</button>
      <label htmlFor="step">Pas</label>
      <select id="step" value={step} onChange={(e) => setStep(Number(e.target.value))} style={{ maxWidth: 120 }}>
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
    </main>
  );
}
