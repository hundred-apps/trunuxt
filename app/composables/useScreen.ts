export type ScreenSize = "sm" | "md" | "lg" | "xl";

// { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }
export const defaultScreenConfig: {
  [key in ScreenSize]: number;
} = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useScreen = () => {
  const screenSize = reactive({
    width: 0,
    height: 0,
  });

  const current = ref<ScreenSize>("sm");

  const getSize = (width?: number) => {
    if (width === undefined) width = screenSize.width;
    const { sm, md, lg, xl } = defaultScreenConfig;
    if (width < Number(sm)) return "sm";
    if (width < Number(md)) return "md";
    if (width < Number(lg)) return "lg";
    if (width < Number(xl)) return "xl";
    return "xl";
  };

  const onWindowResize = () => {
    const { innerWidth, innerHeight } = window;
    screenSize.width = innerWidth;
    screenSize.height = innerHeight;
    current.value = getSize();
  };

  const higherThan = (size: ScreenSize, defScreenSize?: ScreenSize) => {
    const { sm, md, lg, xl } = defaultScreenConfig;
    const currentWidth = defScreenSize
      ? defaultScreenConfig[defScreenSize]
      : screenSize.width;

    if (size === "sm") return currentWidth >= Number(sm);
    if (size === "md") return currentWidth >= Number(md);
    if (size === "lg") return currentWidth >= Number(lg);
    if (size === "xl") return currentWidth >= Number(xl);
    return false;
  };

  const lowerThan = (size: ScreenSize, defScreenSize?: ScreenSize) => {
    const { sm, md, lg, xl } = defaultScreenConfig;
    const currentWidth = defScreenSize
      ? defaultScreenConfig[defScreenSize]
      : screenSize.width;

    if (size === "sm") return currentWidth < Number(sm);
    if (size === "md") return currentWidth < Number(md);
    if (size === "lg") return currentWidth < Number(lg);
    if (size === "xl") return currentWidth < Number(xl);
    return false;
  };

  onMounted(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", onWindowResize);
    screenSize.width = window.innerWidth;
    screenSize.height = window.innerHeight;
    current.value = getSize(window.innerWidth);
  });

  onUnmounted(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", onWindowResize);
  });

  return {
    getSize,
    screenSize,
    current,
    higherThan,
    lowerThan,
  };
};
