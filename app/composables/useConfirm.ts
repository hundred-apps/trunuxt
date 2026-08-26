import { ElMessageBox } from 'element-plus';

export function useConfirm() {
  const confirm = (message: string, title = 'Konfirmasi', options = {}) => {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      type: 'warning',
      ...options,
    });
  };

  const confirmDelete = (name: string, title = 'Konfirmasi') => {
    return confirm(`Hapus "${name}"?`, title);
  };

  return {
    confirm,
    confirmDelete,
  };
}