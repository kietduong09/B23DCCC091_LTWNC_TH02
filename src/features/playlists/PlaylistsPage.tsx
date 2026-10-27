import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed === '') return setError('Tên playlist không được để trống');
    if (playlists.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) return setError('Tên playlist đã tồn tại');
    dispatch({ type: 'create', id: crypto.randomUUID(), name: trimmed });
    setName('');
    setError('');
  };

  return (
    <section>
      <h1>Playlist</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>Tên playlist
          <input value={name} onChange={(e) => setName(e.target.value)}
            aria-invalid={error !== ''} aria-describedby="pl-error" />
        </label>
        <button type="submit">Tạo</button>
        <p id="pl-error" role="alert" className="error">{error}</p>
      </form>
      {playlists.length === 0 ? <p>Chưa có playlist nào. Hãy tạo playlist đầu tiên ở trên.</p> : (
        <ul className="plain">
          {playlists.map((p) => (
            <li key={p.id} className="row simple">
              <Link to={`/playlists/${p.id}`}>{p.name}</Link>
              <span>{p.songIds.length} bài</span>
              <button onClick={() => dispatch({ type: 'remove', id: p.id })} aria-label={`Xóa ${p.name}`}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
