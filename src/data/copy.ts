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
      'hablando de cosas pequeñas bajo árboles que llevaban siglos esperándonos.',
    ],
  },

  marco: {
    place: 'MARCO · Monterrey',
    lines: [
      'En el MARCO aprendimos a estar callados juntos.',
      'Mirar lo mismo y entender cosas distintas.',
      'Discutir sobre una pieza durante el café de después.',
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
      'Québec fue la primera vez que te vi en otro idioma.',
      'Un francés con acento de río congelado.',
      'Y aún así, seguías siendo tú,',
      'pidiendo el café exactamente como en casa.',
    ],
  },

  hull: {
    place: 'Hull · Inglaterra',
    lines: [
      'Que vinieras a Hull',
      'es de las cosas más serias que alguien ha hecho por mí.',
      'Atravesar océanos para ver una ciudad gris',
      'solo porque yo estaba en ella.',
      'Aprendí algo esa semana que no sé explicar todavía:',
      'que el lugar no importa cuando la persona sí.',
    ],
  },

  presente: {
    lines: [
      'Dos años.',
      'Cinco ciudades.',
      'Una sola decisión repetida muchas veces.',
    ],
  },

  futuro: {
    line: 'Y todavía nos faltan todas las primeras veces.',
    credits: 'Hecho a mano por Acker · {{fecha}}',
    // TODO: easter egg / mensaje oculto del capítulo 6
    secret: '',
  },
} as const;

export const chapters = [
  { id: 0, slug: 'hero', label: 'Apertura', roman: 'I' },
  { id: 1, slug: 'vichy', label: 'Vichy', roman: 'II' },
  { id: 2, slug: 'museos', label: 'Museos', roman: 'III' },
  { id: 3, slug: 'mosaico', label: 'Cotidiano', roman: 'IV' },
  { id: 4, slug: 'travesias', label: 'Travesías', roman: 'V' },
  { id: 5, slug: 'presente', label: 'Presente', roman: 'VI' },
  { id: 6, slug: 'futuro', label: 'Futuro', roman: 'VII' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];
