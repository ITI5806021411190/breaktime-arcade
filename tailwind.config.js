/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: '#080B1A',
          card: '#111633',
          surface: '#181F45',
          purple: '#A855F7',
          cyan: '#06B6D4',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['"Prompt"', '"Kanit"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Kanit"', '"Prompt"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.35)',
      }
    },
  },
  plugins: [],
}
