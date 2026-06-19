import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [
    {
      files: [
        "{srcDir}/components/**/*.{vue,js,jsx,mjs,ts,tsx}",
        "{srcDir}/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}",
        "{srcDir}/pages/**/*.{vue,js,jsx,mjs,ts,tsx}",
        "{srcDir}/plugins/**/*.{js,ts,mjs}",
        "{srcDir}/composables/**/*.{js,ts,mjs}",
        "{srcDir}/utils/**/*.{js,ts,mjs}",
        "{srcDir}/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}",
        "{srcDir}/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}",
        "{srcDir}/app.config.{js,ts,mjs}",
        "{srcDir}/app/spa-loading-template.html",
      ],
    },
  ],
  theme: {
    extend: {
      extend: {
        colors: { primary: colors.amber },
        screens: {
          xs: "480px",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
        animation: {
          fadeIn: "fadeIn 0.3s ease-out",
          "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0", transform: "translateY(-10px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
