import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090909",
        card: "#141414",
        gold: "#d6ad5b",
        light: "#f7f7f7",
        muted: "#aaaaaa",
        line: "#272727",
        "line-soft": "#252525",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 50% 25%, #2a2419 0, #111 32%, #090909 68%)",
        "card-grad": "linear-gradient(145deg, #19160f, #101010)",
        "photo-grad": "linear-gradient(145deg, #292929, #111)",
      },
    },
  },
  plugins: [],
};

export default config;