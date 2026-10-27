import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

export const renderWithProviders = (ui: ReactElement) =>
  render(
    <MemoryRouter>
      <PlaylistProvider>{ui}</PlaylistProvider>
    </MemoryRouter>,
  );
