import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/be-vietnam-pro/200.css';
import '@fontsource/be-vietnam-pro/300.css';
import '@fontsource/be-vietnam-pro/500.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider><PlaylistProvider><App /></PlaylistProvider></ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
