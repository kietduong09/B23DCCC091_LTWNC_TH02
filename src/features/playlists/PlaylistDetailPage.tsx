import { useParams } from 'react-router-dom';
import { SONGS } from '../../data/songs';
import { formatDuration, formatTotal } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const playlist = usePlaylists().find((p) => p.id === id);
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);
  if (!playlist) return <p>Không tìm thấy playlist</p>;

  const songs = playlist.songIds.flatMap((sid) => SONGS.find((s) => s.id === sid) ?? []);
  const total = songs.reduce((sum, s) => sum + s.duration, 0);
  return (
    <section>
      <h1>{playlist.name}</h1>
      <p>Tổng thời lượng: {formatTotal(total)}</p>
      {songs.length === 0 ? <p>Playlist này chưa có bài nào. Thêm bài từ Thư viện bằng nút + Playlist.</p> : (
        <>
          <button onClick={() => playQueue(songs, 0)}>Phát tất cả</button>
          <ul className="plain">
            {songs.map((s) => (
              <li key={s.id} className="row simple">
                <span className="title">{s.title}</span><span className="artist">{s.artist}</span>
                <span className="dur">{formatDuration(s.duration)}</span>
                <button onClick={() => dispatch({ type: 'removeSong', playlistId: playlist.id, songId: s.id })}>Bỏ</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
