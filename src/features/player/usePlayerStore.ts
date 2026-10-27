import { create } from 'zustand';
import type { Song } from '../../types';

interface PlayerState {
  queue: Song[];
  currentIndex: number; // -1 khi chưa phát
  isPlaying: boolean;
  position: number; // giây
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  playQueue: (songs, startIndex) => {
    if (startIndex < 0 || startIndex >= songs.length) return;
    set({ queue: songs, currentIndex: startIndex, isPlaying: true, position: 0 });
  },
  togglePlay: () => {
    const { currentIndex, isPlaying } = get();
    if (currentIndex < 0) return;
    set({ isPlaying: !isPlaying });
  },
  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex < 0) return;
    if (currentIndex + 1 >= queue.length) set({ isPlaying: false, position: 0 });
    else set({ currentIndex: currentIndex + 1, position: 0 });
  },
  prev: () => {
    const { currentIndex, position } = get();
    if (currentIndex < 0) return;
    if (position > 3 || currentIndex === 0) set({ position: 0 });
    else set({ currentIndex: currentIndex - 1, position: 0 });
  },
  addToQueue: (song) => {
    if (get().queue.some((s) => s.id === song.id)) return;
    set({ queue: [...get().queue, song] });
  },
  tick: () => {
    const { isPlaying, queue, currentIndex, position } = get();
    const current = queue[currentIndex];
    if (!isPlaying || !current) return;
    if (position + 1 >= current.duration) get().next();
    else set({ position: position + 1 });
  },
}));
