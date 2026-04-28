// Manifiesto de fotos por capítulo.
// Mientras llegan las reales usamos picsum.photos con seeds — siempre cargan,
// son deterministas (mismo seed = misma foto), y mantienen aspect ratio polaroid.
// Para reemplazar: pon tus archivos en public/photos/{capitulo}/ y cambia las URLs
// por rutas locales (e.g. '/photos/01-vichy/parque.webp').

export type Photo = {
  src: string;
  alt: string;
  /** URL opcional de video corto (mp4/webm) — convierte la polaroid en
   *  "live photo": el clip se reproduce en loop al pasar el cursor o al
   *  abrir el modal de zoom. */
  video?: string;
  w?: number;
  h?: number;
};

const u = (seed: string, w = 1600, h = 2000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const photos: Record<string, Photo[]> = {
  // 01 · Vichy — río Allier, Belle Époque, parques
  vichy: [
    {
      src: u('vichy-allier'),
      alt: 'TODO: foto de Vichy o del parque junto al Allier',
    },
  ],

  // 02a · Pal Norte 2024 — fotos locales en public/images/
  palnorte: [
    {
      src: '/images/Palnorte.JPEG',
      video: '/images/Palnorte.webm',
      alt: 'Pal Norte 2024 — escenario',
    },
    {
      src: '/images/PalNorte2.JPEG',
      video: '/images/Palnorte2.webm',
      alt: 'Pal Norte 2024 — los columpios',
    },
    { src: '/images/DinoQuesadillas.JPEG', alt: 'Pal Norte 2024 — dinoquesadillas' },
  ],

  // 02b · Museo del Desierto Saltillo — fósiles, paisaje árido
  desierto: [
    { src: u('desierto-fosiles'), alt: 'TODO: foto del Museo del Desierto' },
    { src: u('desierto-paisaje'), alt: 'TODO: foto del paisaje árido de Saltillo' },
  ],

  // 03 · Mosaico — momentos. El orden empareja por índice con TILE_CONFIG
  // de Chapter03Mosaico.tsx (captions: EscapeRoom, Quebec Beis, Sultanes,
  // DaleMixx, Sea at Hull, SixFlags).
  mosaico: [
    {
      src: '/images/mosaicos/EscapeRoom.jpg',
      video: '/images/mosaicos/EscapeRoom.webm',
      alt: 'Escape Room',
    },
    {
      src: '/images/mosaicos/QuebecBaseball.jpg',
      video: '/images/mosaicos/QuebecBaseball.webm',
      alt: 'Québec, béisbol',
    },
    {
      src: '/images/mosaicos/Sultanes.jpg',
      video: '/images/mosaicos/Sultanes.webm',
      alt: 'Sultanes — béisbol en Monterrey',
    },
    {
      src: '/images/mosaicos/DaleMixx.jpg',
      video: '/images/mosaicos/DaleMixx.webm',
      alt: 'Dale Mixx',
    },
    {
      src: '/images/mosaicos/HullSea.jpg',
      video: '/images/mosaicos/HullSea.webm',
      alt: 'Hull, frente al mar',
    },
    {
      src: '/images/mosaicos/SixFlags.jpg',
      video: '/images/mosaicos/SixFlags.webm',
      alt: 'Six Flags',
    },
  ],

  // 04a · Quebec — invierno, Vieux Québec, francés
  quebec: [
    { src: u('quebec-vieux'), alt: 'TODO: foto del Vieux Québec' },
    { src: u('quebec-nieve'), alt: 'TODO: foto de la nieve en Québec' },
  ],

  // 04b · Hull — niebla, ladrillo rojo, Humber Bridge
  hull: [
    { src: u('hull-bridge'), alt: 'TODO: foto del Humber Bridge en niebla' },
    { src: u('hull-pub'), alt: 'TODO: pub o calle de Hull' },
  ],

  // 05 · Presente — síntesis, polaroids flotando alrededor
  presente: [
    { src: u('presente-1'), alt: 'TODO: presente 1' },
    { src: u('presente-2'), alt: 'TODO: presente 2' },
    { src: u('presente-3'), alt: 'TODO: presente 3' },
    { src: u('presente-4'), alt: 'TODO: presente 4' },
  ],
};
