import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { SONGS, GENRES } from '../../data/songs';
import type { Genre, Song } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlaylists, usePlaylistDispatch } from '../playlists/PlaylistContext';
import SongRow from './SongRow';

type Sort = 'default' | 'title' | 'duration';
interface RowData {
  songs: Song[];
  favorites: string[];
  canAddToPlaylist: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const song = data.songs[index];
  return (
    <SongRow song={song} index={index} style={style} isFavorite={data.favorites.includes(song.id)}
      canAddToPlaylist={data.canAddToPlaylist} onPlay={data.onPlay}
      onToggleFavorite={data.onToggleFavorite} onAddToQueue={data.onAddToQueue}
      onAddToPlaylist={data.onAddToPlaylist} />
  );
};
const itemKey = (index: number, data: RowData) => data.songs[index].id;

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<Genre | 'all'>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [playlistId, setPlaylistId] = useState('');
  const [notice, setNotice] = useState('');
  const debounced = useDebounce(query, 300);

  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const favorites = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const handleQueryShift = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  const visible = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const list = SONGS.filter((s) =>
      (genre === 'all' || s.genre === genre) &&
      (q === '' || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
    if (sort === 'title') return [...list].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    if (sort === 'duration') return [...list].sort((a, b) => a.duration - b.duration);
    return list;
  }, [debounced, genre, sort]);

  const selectedId = playlists.some((p) => p.id === playlistId) ? playlistId : playlists[0]?.id ?? '';

  const onPlay = useCallback((song: Song) => playQueue(visible, visible.indexOf(song)), [playQueue, visible]);
  const onAddToPlaylist = useCallback((song: Song) => {
    const target = playlists.find((p) => p.id === selectedId);
    if (!target) return;
    if (target.songIds.includes(song.id)) { setNotice(`“${song.title}” đã có trong ${target.name}`); return; }
    dispatch({ type: 'addSong', playlistId: target.id, songId: song.id });
    setNotice(`Đã thêm “${song.title}” vào ${target.name}`);
  }, [playlists, selectedId, dispatch]);

  const itemData = useMemo<RowData>(() => ({
    songs: visible, favorites, canAddToPlaylist: playlists.length > 0, onPlay,
    onToggleFavorite: toggleFavorite, onAddToQueue: addToQueue, onAddToPlaylist,
  }), [visible, favorites, playlists.length, onPlay, toggleFavorite, addToQueue, onAddToPlaylist]);

  return (
    <section>
      <h1>Thư viện</h1>
      <div className="filters">
        <label>Tìm kiếm<input type="search" value={query} onChange={handleQueryShift} placeholder="Tên bài hoặc ca sĩ" /></label>
        <label>Thể loại
          <select value={genre} onChange={(e) => setGenre(e.target.value as Genre | 'all')}>
            <option value="all">Tất cả</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label>Sắp xếp
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </label>
        <label>Playlist đang chọn
          <select value={selectedId} onChange={(e) => setPlaylistId(e.target.value)} disabled={playlists.length === 0}>
            {playlists.length === 0 && <option value="">Chưa có playlist</option>}
            {playlists.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </div>
      <p>Tìm thấy {visible.length} bài hát</p>
      <p className="notice" role="status">{notice}</p>
      {visible.length === 0 ? <p>Không tìm thấy bài hát nào</p> : (
        <div role="list">
          <FixedSizeList height={560} width="100%" itemCount={visible.length} itemSize={56}
            itemData={itemData} itemKey={itemKey}>{Row}</FixedSizeList>
        </div>
      )}
    </section>
  );
}
