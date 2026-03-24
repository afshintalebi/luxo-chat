import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        english: ["var(--font-inter)", "sans-serif"],
        farsi: ["var(--font-noto-sans-arabic)", "sans-serif"],
      },
    },
  },
};

export default config;