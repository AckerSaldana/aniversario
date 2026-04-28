# Dos años · una carta de amor

Sitio inmersivo scroll-driven hecho a mano. Siete capítulos cinematográficos sobre una sola escena Three.js persistente.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

## Stack

- **React 19 + TypeScript + Vite 8**
- **Three.js** vía `@react-three/fiber` y `@react-three/drei`, post-processing con `@react-three/postprocessing`
- **GSAP 3** con `@gsap/react`, `ScrollTrigger`, `SplitText`
- **Lenis** para smooth scroll, conectado al `gsap.ticker`
- **Zustand** como bus ligero entre los capítulos DOM y la escena 3D

## Cómo está organizado

```
src/
├── App.tsx              # Canvas persistente + capítulos + indicador
├── main.tsx             # entry
├── three/               # escena, partículas custom shaders, polaroids 3D
├── chapters/            # Chapter00Hero ... Chapter06Futuro
├── components/          # ProgressIndicator, Polaroid, SplitTextLine
├── hooks/               # useLenis, useReducedMotion, useChapterScroll
├── data/                # copy.ts (textos), photos.ts (manifiesto)
└── styles/              # tokens.css, reset, global, módulos por capítulo
```

## Dónde meto mis cosas

| Quiero cambiar… | Edita esto |
|-----------------|-----------|
| Texto de un capítulo | `src/data/copy.ts` |
| Foto de un capítulo | `src/data/photos.ts` (URLs stock por defecto). Si quieres archivos locales: ponlos en `public/photos/{capitulo}/...` y cambia las rutas. |
| Modelo 3D (grulla) | Drop tu `.obj` en `public/models/grulla.obj`. Mientras no exista se usa un icosaedro placeholder. |
| Paleta global | `src/styles/tokens.css` |
| Paleta de partículas por capítulo | `src/three/store.ts` (objeto `PALETTES`) |
| Tipografía | `src/styles/tokens.css` (las fuentes vienen de `@fontsource-variable`) |
| Mensaje del cierre | `copy.futuro.secret` en `src/data/copy.ts` |
| Coreografía de scroll por capítulo | el archivo del capítulo en `src/chapters/` |

## Estado actual

✅ **Fase A (este commit)** · Scaffold completo, escena 3D viva, los 7 capítulos con texto y stagger básico.

⏳ **Fase B** · Coreografía rica por capítulo (delegar 01 Vichy y 04 Travesías al agente `gsap-storyteller`):
- 01 Vichy: niebla densa entrando, partículas formando la palabra "Vichy", polaroid 3D
- 02 Museos: timeline horizontal scrubbed para MARCO + transición de paleta al Desierto
- 04 Travesías: grulla orbital + MotionPath atlántico + cambio Quebec → Hull
- 05 Presente: polaroids 3D flotando alrededor del modelo

⏳ **Fase C** · Pulido: lazy/preload por capítulo, Lighthouse mobile ≥85, A11y review final.

## Pasos para deploy en Cloudflare Pages

1. Crea un repo Git y push.
2. En Cloudflare Pages: **Connect to Git** → selecciona el repo.
3. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 20+
4. Deploy. La primera build cachea `node_modules` y el resto son rápidas.

(Alternativa CLI con Wrangler: `npm run build && npx wrangler pages deploy dist`.)

## Pendientes para Acker

1. **Fotos reales** por capítulo, en `public/photos/{capitulo}/` (WebP, ≤1920px lado largo, ≤400 KB).
2. **OBJ** de la grulla en `public/models/grulla.obj`.
3. **Refinar copy** en `src/data/copy.ts` cuando quieras los textos finales.
4. **Easter egg** del capítulo 6 en `copy.futuro.secret`.
5. **Fecha** en `copy.futuro.credits` (ahora dice `{{fecha}}`).
6. Decidir si Fraunces se queda o sustituirla por `Migra` / `PP Editorial New` (requieren licencia).

---

Hecho con cuidado. Si rompes algo, lo arreglamos.
