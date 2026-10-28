/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colours (values come from CSS variables in index.css)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        // Brand palette
        primary: '#7C3AED',
        secondary: '#06B6D4',
        accent: '#EC4899',
        ink: '#0B1020',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(124, 58, 237, 0.65)',
        'glow-cyan': '0 0 40px -8px rgba(6, 182, 212, 0.6)',
        'glow-pink': '0 0 40px -8px rgba(236, 72, 153, 0.55)',
      },
    },
  },
  plugins: [],
};
