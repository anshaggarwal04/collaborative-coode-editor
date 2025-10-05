import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {keyframes: {
      // 🔹 Smooth diagonal gradient animation
      gradient: {
        "0%, 100%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
      },
    },
    animation: {
      gradient: "gradient 8s ease infinite",
    },
  },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "forest", "coffee"],
  },
};
