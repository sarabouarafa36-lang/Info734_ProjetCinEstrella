// Fourni : des films inventés pour les exercices.
export type Movie = { id: number; title: string; year: number; overview: string };

export const films: Movie[] = [
  {
    id: 1,
    title: 'Dernier métro pour Mars',
    year: 2026,
    overview: 'Une conductrice découvre une station absente de tous les plans.',
  },
  {
    id: 2,
    title: 'La nuit des parapluies',
    year: 2025,
    overview: 'Une ville se réveille avec des parapluies qui racontent les secrets de leurs propriétaires.',
  },
  {
    id: 3,
    title: 'Le lac à l’envers',
    year: 2024,
    overview: 'Trois amis explorent le reflet d’un lac où le temps remonte.',
  },
  {
    id: 4,
    title: 'Silence, on cuisine',
    year: 2026,
    overview: 'Un ingénieur du son rejoint une brigade de cuisine pendant un concours improbable.',
  },
  {
    id: 5,
    title: 'Les étoiles de poche',
    year: 2023,
    overview: 'Une astronome collectionne les morceaux d’un ciel disparu.',
  },
  {
    id: 6,
    title: 'Retour à lundi',
    year: 2025,
    overview: 'Deux colocataires tentent de sortir d’un lundi qui recommence après chaque café.',
  },
];
