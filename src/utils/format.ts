export const formatDuration = (seconds: number): string => {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const s = total % 60;
  return `${Math.floor(total / 60)}:${s < 10 ? '0' : ''}${s}`;
};

export const formatTotal = (seconds: number): string =>
  `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`;
