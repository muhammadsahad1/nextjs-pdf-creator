import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#3F3F3F', // Adding a custom dark color
        'dark-secondary': '#1a1a1a', // Adding another custom color
        zinc: {
          900: '#3F3F3F', // Adding Zinc-900 color
        },
      },
    },
  },
  plugins: [],
};
export default config;
