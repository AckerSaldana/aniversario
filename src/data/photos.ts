// Manifiesto de fotos por capítulo.
// Mientras llegan las reales usamos URLs de Unsplash con la paleta del sitio.
// Para reemplazar: pon tus archivos en public/photos/{capitulo}/ y cambia las URLs
// por rutas locales (e.g. '/photos/01-vichy/parque.webp').

export type Photo = {
  src: string;
  alt: string;
  // ratio puede ayudar a evitar CLS si lo quieres usar después
  w?: number;
  h?: number;
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos: Record<string, Photo[]> = {
  // 01 · Vichy — río Allier, Belle Époque, parques
  vichy: [
    {
      src: u('photo-1502602898657-3e91760cbb34'),
      alt: 'TODO: foto de Vichy o del parque junto al Allier',
    },
  ],

  // 02a · MARCO Monterrey — patio central, fuente, arte contemporáneo
  marco: [
    {
      src: u('photo-1554907984-15263bfd63bd'),
      alt: 'TODO: foto del patio del MARCO',
    },
    {
      src: u('photo-1577720580479-7d839d829c73'),
      alt: 'TODO: foto de una obra del MARCO',
    },
    {
      src: u('photo-1578926375605-eaf7559b1458'),
      alt: 'TODO: foto de nosotros en el MARCO',
    },
  ],

  // 02b · Museo del Desierto Saltillo — fósiles, paisaje árido
  desierto: [
    {
      src: u('photo-1547149800-50e14e996dd6'),
      alt: 'TODO: foto del Museo del Desierto',
    },
    {
      src: u('photo-1547036967-23d11aacaee0'),
      alt: 'TODO: foto del paisaje árido de Saltillo',
    },
  ],

  // 03 · Mosaico — días cotidianos, café, comidas, repetición
  mosaico: [
    { src: u('photo-1495474472287-4d71bcdd2085'), alt: 'TODO: café de la mañana' },
    { src: u('photo-1473662712681-29a7d5ddf9a6'), alt: 'TODO: comida cualquiera' },
    { src: u('photo-1517345438041-cf88334ce7b4'), alt: 'TODO: caminata sin destino' },
    { src: u('photo-1499914485622-a88fac536970'), alt: 'TODO: ventana de cocina' },
    { src: u('photo-1535930749574-1399327ce78f'), alt: 'TODO: domingo lento' },
    { src: u('photo-1485178575877-1a13bf489dfe'), alt: 'TODO: tarde cualquiera' },
  ],

  // 04a · Quebec — invierno, Vieux Québec, francés
  quebec: [
    {
      src: u('photo-1519178614-68673b201f36'),
      alt: 'TODO: foto del Vieux Québec',
    },
    {
      src: u('photo-1485981138371-f1edd4c12be2'),
      alt: 'TODO: foto de la nieve en Québec',
    },
  ],

  // 04b · Hull — niebla, ladrillo rojo, Humber Bridge
  hull: [
    {
      src: u('photo-1520637836862-4d197d17c50a'),
      alt: 'TODO: foto del Humber Bridge en niebla',
    },
    {
      src: u('photo-1502602898657-3e91760cbb34'),
      alt: 'TODO: pub o calle de Hull',
    },
  ],

  // 05 · Presente — síntesis, polaroids flotando alrededor
  presente: [
    { src: u('photo-1502602898657-3e91760cbb34'), alt: 'TODO: presente 1' },
    { src: u('photo-1485178575877-1a13bf489dfe'), alt: 'TODO: presente 2' },
    { src: u('photo-1519178614-68673b201f36'), alt: 'TODO: presente 3' },
    { src: u('photo-1547149800-50e14e996dd6'), alt: 'TODO: presente 4' },
  ],
};
