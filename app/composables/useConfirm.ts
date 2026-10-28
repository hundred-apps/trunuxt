import { ElMessageBox } from 'element-plus';

export function useConfirm() {
  const { t } = useI18n();

  const confirm = (message: string, title?: string, options = {}) => {
    return ElMessageBox.confirm(message, title || t('confirm.title'), {
      confirmButtonText: t('confirm.delete'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      ...options,
    });
  };

  const confirmDelete = (name: string, title?: string) => {
    return confirm(t('confirm.deleteMessage', { name }), title);
  };

  return {
    confirm,
    confirmDelete,
  };
}
