import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { playlistReducer } from './playlistReducer';
import type { Playlist, PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

const KEY = 'music-playlists';
const PlaylistStateContext = createContext<Playlist[] | null>(null);
const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | null>(null);
const reducer = withLogger(playlistReducer);

const isPlaylist = (v: unknown): v is Playlist => {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return typeof p.id === 'string' && typeof p.name === 'string' &&
    Array.isArray(p.songIds) && p.songIds.every((s) => typeof s === 'string');
};

const load = (): Playlist[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isPlaylist) : [];
  } catch { return []; }
};

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(playlists)); } catch { /* bỏ qua */ }
  }, [playlists]);
  const state = useMemo(() => playlists, [playlists]);
  return (
    <PlaylistDispatchContext.Provider value={dispatch}>
      <PlaylistStateContext.Provider value={state}>{children}</PlaylistStateContext.Provider>
    </PlaylistDispatchContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const ctx = useContext(PlaylistStateContext);
  if (!ctx) throw new Error('usePlaylists phải được dùng bên trong PlaylistProvider');
  return ctx;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const ctx = useContext(PlaylistDispatchContext);
  if (!ctx) throw new Error('usePlaylistDispatch phải được dùng bên trong PlaylistProvider');
  return ctx;
}
