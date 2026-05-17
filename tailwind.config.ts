import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        municipal: {
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#1877c9",
          600: "#0f63ad",
          700: "#0b4f8c",
          900: "#092540"
        },
        civic: {
          green: "#15803d",
          red: "#b91c1c",
          amber: "#b7791f"
        }
      },
      boxShadow: {
        panel: "0 14px 34px rgba(9, 37, 64, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
