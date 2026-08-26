export function useHeaderHeight() {
  const headerHeight = ref(0);

  const updateHeaderHeight = () => {
    if (import.meta.client) {
      const header = document.querySelector('header, [data-header="true"], nav.fixed');
      if (header) {
        headerHeight.value = header.getBoundingClientRect().height;
      } else {
        headerHeight.value = window.innerWidth >= 1024 ? 110 : 70;
      }
    } else {
      headerHeight.value = 110;
    }
  };

  onMounted(() => {
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', updateHeaderHeight, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeaderHeight);
    window.removeEventListener('scroll', updateHeaderHeight);
  });

  return {
    headerHeight: readonly(headerHeight),
    updateHeaderHeight,
  };
}

export const headerHeightKey = '--header-height';