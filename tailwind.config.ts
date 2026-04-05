import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        surfaceMuted: "var(--color-surface-muted)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        primary: "var(--color-primary)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      borderRadius: {
        shell: "var(--radius-shell)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        shell: "var(--shadow-shell)",
        card: "var(--shadow-card)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        shell: "var(--space-shell)",
        section: "var(--space-section)",
      },
    },
  },
  plugins: [],
};

export default config;
