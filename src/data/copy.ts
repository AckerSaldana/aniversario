// Drafts poéticos del prompt original. Edítalos libremente, son la fuente única
// de verdad para todo el texto del sitio.

export const copy = {
  hero: {
    line: 'Hace dos años, en una ciudad que no era la nuestra, el universo decidió alinearse.',
  },

  vichy: {
    place: 'Vichy · Francia',
    lines: [
      'Vichy no era de ninguno de los dos.',
      'Por eso fue perfecta.',
      'Dos extranjeros encontrándose en una ciudad que tampoco les pertenecía,',
      'hablando de cosas pequeñas en las calles que llevaban siglos esperándonos.',
    ],
  },

  palnorte: {
    place: 'Pal Norte · Monterrey · 2024',
    lines: [
      'En el Pal Norte descubrimos que el ruido también puede ser íntimo.',
      'Miles de personas y aún así te seguía oyendo a ti.',
      'Bailar mal, los dos, resultó ser la mejor forma de bailar bien.',
    ],
  },

  desierto: {
    place: 'Museo del Desierto · Saltillo',
    lines: [
      'En Saltillo, entre fósiles más viejos que cualquier idea de nosotros,',
      'me di cuenta de que ya no quería que nada se extinguiera.',
      'Ni los dinosaurios, ni los museos vacíos un martes, ni esto.',
    ],
  },

  mosaico: {
    line: 'Y en medio de todo, los días normales, que resultaron ser los más importantes.',
  },

  quebec: {
    place: 'Québec · Canadá',
    lines: [
      'Québec fue nuestra primera aventura ya como nosotros.',
      'El primer aeropuerto juntos, el primer mapa que arruinamos,',
      'caminando en un castillo sin saber bien el camino —',
      'descubriendo que perderse contigo era parte del plan.',
    ],
  },

  hull: {
    place: 'Hull · Inglaterra',
    lines: [
      'Que vinieras a Hull',
      'es de las cosas más serias que alguien ha hecho por mí.',
      'Atravesar océanos para ver una ciudad gris',
      'solo porque yo estaba en ella.',
      'Aprendí algo en ese tiempo que no sé explicar todavía:',
      'que el lugar no importa cuando la persona sí.',
    ],
  },

  presente: {
    lines: [
      'Dos años.',
      'Trece ciudades.',
      'El mismo sentimiento que crece.',
    ],
  },

  futuro: {
    line: 'Y todavía nos faltan muchas primeras veces.',
    // TODO: easter egg / mensaje oculto del capítulo 6
    secret: '',
  },
} as const;

export const chapters = [
  { id: 0, slug: 'hero', label: 'Apertura', roman: 'I' },
  { id: 1, slug: 'vichy', label: 'Vichy', roman: 'II' },
  { id: 2, slug: 'norte', label: 'Norte', roman: 'III' },
  { id: 3, slug: 'mosaico', label: 'Cotidiano', roman: 'IV' },
  { id: 4, slug: 'travesias', label: 'Travesías', roman: 'V' },
  { id: 5, slug: 'presente', label: 'Presente', roman: 'VI' },
  { id: 6, slug: 'futuro', label: 'Futuro', roman: 'VII' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];
