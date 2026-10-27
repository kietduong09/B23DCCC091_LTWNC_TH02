export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; playlistId: string; songId: string }
  | { type: 'removeSong'; playlistId: string; songId: string };

const update = (list: Playlist[], id: string, fn: (p: Playlist) => Playlist): Playlist[] =>
  list.some((p) => p.id === id) ? list.map((p) => (p.id === id ? fn(p) : p)) : list;

export const playlistReducer = (state: Playlist[], action: PlaylistAction): Playlist[] => {
  switch (action.type) {
    case 'create':
      return state.some((p) => p.id === action.id) ? state : [...state, { id: action.id, name: action.name, songIds: [] }];
    case 'rename':
      return update(state, action.id, (p) => ({ ...p, name: action.name }));
    case 'remove':
      return state.some((p) => p.id === action.id) ? state.filter((p) => p.id !== action.id) : state;
    case 'addSong':
      return update(state, action.playlistId, (p) =>
        p.songIds.includes(action.songId) ? p : { ...p, songIds: [...p.songIds, action.songId] });
    case 'removeSong':
      return update(state, action.playlistId, (p) =>
        p.songIds.includes(action.songId) ? { ...p, songIds: p.songIds.filter((s) => s !== action.songId) } : p);
  }
};
