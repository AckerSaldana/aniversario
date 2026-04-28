/// <reference types="vite/client" />

declare module '*.glsl?raw' {
  const content: string;
  export default content;
}

declare module '@fontsource-variable/fraunces';
declare module '@fontsource-variable/inter';
