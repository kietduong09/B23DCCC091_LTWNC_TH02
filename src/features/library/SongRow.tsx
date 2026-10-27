import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  song: Song;
  index: number;
  style?: CSSProperties;
  isFavorite: boolean;
  canAddToPlaylist: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

function SongRowBase({ song, index, style, isFavorite, canAddToPlaylist,
  onPlay, onToggleFavorite, onAddToQueue, onAddToPlaylist }: SongRowProps) {
  return (
    <div className="row" style={style} role="listitem">
      <span className="num">{index + 1}</span>
      <span className="title">{song.title}</span>
      <span className="artist">{song.artist}</span>
      <span className="genre">{song.genre}</span>
      <span className="dur">{formatDuration(song.duration)}</span>
      <span className="actions">
        <button onClick={() => onPlay(song)} aria-label={`Phát ${song.title}`}>Phát</button>
        <button onClick={() => onToggleFavorite(song.id)} aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>{isFavorite ? '♥' : '♡'}</button>
        <button onClick={() => onAddToQueue(song)} aria-label={`Thêm ${song.title} vào hàng đợi`}>+ Hàng đợi</button>
        <button onClick={() => onAddToPlaylist(song)} disabled={!canAddToPlaylist}
          aria-label={`Thêm ${song.title} vào playlist`}>+ Playlist</button>
      </span>
    </div>
  );
}

export const SongRow = memo(SongRowBase);
export default SongRow;
