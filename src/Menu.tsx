// Corrigé des TD React du 19/10 : un menu, une page par TD. Un clic change l'adresse (#td1, #td2…).
import { useEffect, useState } from 'react';
import { Td1 } from './td1-fiche-film/Td1';
import { Td2 } from './td2-cartes/Td2';
import { Td3 } from './td3-compteur/Td3';
import { Td4 } from './td4-jaime/Td4';
import { Td5 } from './td5-recherche/Td5';
import { Td6 } from './td6-minuteur/Td6';
import { Td7 } from './td7-affiches/Td7';
import { Td7 as Td7PlusLoin } from './td7-affiches/Td7-plus-loin';

const pages = [
  { id: 'td1', label: 'TD 1 · Fiche', Page: Td1 },
  { id: 'td2', label: 'TD 2 · Cartes', Page: Td2 },
  { id: 'td3', label: 'TD 3 · Compteur', Page: Td3 },
  { id: 'td4', label: "TD 4 · J'aime", Page: Td4 },
  { id: 'td5', label: 'TD 5 · Recherche', Page: Td5 },
  { id: 'td6', label: 'TD 6 · Minuteur', Page: Td6 },
  { id: 'td7', label: 'TD 7 · Affiches', Page: Td7 },
  { id: 'td7plus', label: 'TD 7 · Plus loin', Page: Td7PlusLoin },
];

export function Menu() {
  const [hash, setHash] = useState(window.location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setHash(window.location.hash.slice(1));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const current = pages.find((p) => p.id === hash) ?? pages[0];
  return (
    <>
      <nav className="menu">
        {pages.map((p) => (
          <a key={p.id} href={`#${p.id}`} aria-current={p === current ? 'page' : undefined}>
            {p.label}
          </a>
        ))}
      </nav>
      <current.Page />
    </>
  );
}
