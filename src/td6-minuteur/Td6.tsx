// Corrigé — TD 6 — Un minuteur, avec le « si tu as fini » (mm:ss et compte à rebours).
// Sans clearInterval : « Arrêter » n'arrête plus rien, et chaque « Démarrer » ajoute un minuteur
// sans arrêter l'ancien. Le temps accélère.
import { useEffect, useState } from 'react';

function mmss(total: number) {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function Td6() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = `${seconds} s`;
  }, [seconds]);

  return (
    <main>
      <h1>TD 6 — Un minuteur</h1>
      <p className="compteur">{mmss(seconds)}</p>
      <button onClick={() => setRunning(true)} disabled={running}>
        Démarrer
      </button>{' '}
      <button onClick={() => setRunning(false)} disabled={!running}>
        Arrêter
      </button>{' '}
      <button onClick={() => setSeconds(0)}>Remettre à zéro</button>
      <CountDown />
    </main>
  );
}

function CountDown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (left === null || left === 0) return;
    const id = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return (
    <>
      <h2>Si tu as fini : compte à rebours</h2>
      <p className="compteur">{left === 0 ? 'Terminé !' : (left ?? 10)}</p>
      <button onClick={() => setLeft(10)}>Lancer 10 secondes</button>
    </>
  );
}
