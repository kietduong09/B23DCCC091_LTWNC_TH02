import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export default function ProgressBar() {
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.queue[s.currentIndex]?.duration ?? 0);
  const pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
  return (
    <div className="progress">
      <span className="time">{formatDuration(position)} / {formatDuration(duration)}</span>
      <div className="track" role="progressbar" aria-label="Tiến trình bài hát"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
