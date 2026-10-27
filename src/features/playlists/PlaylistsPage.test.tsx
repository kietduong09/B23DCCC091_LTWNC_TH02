import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaylistsPage from './PlaylistsPage';
import { renderWithProviders } from '../../testUtils';

describe('PlaylistsPage', () => {
  beforeEach(() => localStorage.clear());

  it('bấm Tạo khi ô trống thì hiện lỗi', async () => {
    renderWithProviders(<PlaylistsPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì playlist xuất hiện trong danh sách', async () => {
    renderWithProviders(<PlaylistsPage />);
    await userEvent.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('link', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('không cho tạo tên trùng không phân biệt hoa thường', async () => {
    renderWithProviders(<PlaylistsPage />);
    const input = screen.getByLabelText('Tên playlist');
    await userEvent.type(input, 'Chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    await userEvent.type(input, 'chạy bộ');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('xóa playlist khỏi danh sách', async () => {
    renderWithProviders(<PlaylistsPage />);
    await userEvent.type(screen.getByLabelText('Tên playlist'), 'Tập gym');
    await userEvent.click(screen.getByRole('button', { name: 'Tạo' }));
    await userEvent.click(screen.getByRole('button', { name: 'Xóa Tập gym' }));
    expect(screen.queryByRole('link', { name: 'Tập gym' })).not.toBeInTheDocument();
  });
});