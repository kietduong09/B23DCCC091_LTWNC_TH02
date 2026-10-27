import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const songs = useMemo(() => SONGS.filter((s) => ids.includes(s.id)), [ids]);
  return (
    <section>
      <h1>Yêu thích</h1>
      {songs.length === 0 ? (
        <p>Bạn chưa có bài hát yêu thích. <Link to="/">Quay lại thư viện</Link> và bấm ♡ để thêm.</p>
      ) : (
        <>
          <p>{songs.length} bài</p>
          <button onClick={() => playQueue(songs, 0)}>Phát tất cả</button>
          <ul className="plain">
            {songs.map((s) => (
              <li key={s.id} className="row simple">
                <span className="title">{s.title}</span><span className="artist">{s.artist}</span>
                <span className="dur">{formatDuration(s.duration)}</span>
                <button onClick={() => toggle(s.id)} aria-label="Bỏ yêu thích">♥</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
