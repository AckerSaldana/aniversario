import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// chloe (display) llega vía Typekit en index.html; Inter como body fallback rápido
import '@fontsource-variable/inter';
import '@fontsource-variable/caveat/index.css';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
