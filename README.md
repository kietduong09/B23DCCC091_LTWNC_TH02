# Phòng nghe – Trình phát nhạc mini (TH02 LTWNC)

Trình phát nhạc **mô phỏng**: không có âm thanh thật, "phát nhạc" là đồng hồ đếm giây + thanh tiến trình. Dữ liệu 10.000 bài do thuật toán xác định sinh ra (`src/data/songs.ts`).

## Chạy trên Windows (Node.js >= 22.12)
```
cd music-player
npm install
npm run dev        # chạy ứng dụng
npm test           # chạy test
npm run coverage   # coverage, chụp bảng kết quả lưu thành coverage.png
npm run build
```

## Kiến trúc state
- Player (đổi mỗi giây): Zustand + selector; chỉ `ProgressBar` đọc `position`.
- Yêu thích: Zustand + `persist` (key `music-favorites`).
- Playlist: `useReducer(withLogger(playlistReducer))` + 2 Context tách riêng, lưu `music-playlists`.
- Giao diện sáng/tối: `ThemeContext` riêng + `useMemo`.
- Tìm kiếm/lọc/sắp xếp: `useState` cục bộ, debounce 300 ms, danh sách ảo hóa bằng `FixedSizeList` (560px / 56px).

## Trạng thái kiểm chứng
Project được tạo trong môi trường không có mạng nên **chưa chạy** `npm install`, `npm test`, `npm run build`. Đã kiểm chứng riêng phần logic thuần (dữ liệu, formatDuration, reducer) bằng tsx/tsc.
Chưa làm: test `SongRow` và `PlaylistsPage`, `coverage.png`, git commit, kiểm tra giao diện trên trình duyệt.
