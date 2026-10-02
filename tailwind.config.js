/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toomakt: {
          bg: '#F5EFE6',
          'bg-warm': '#FFFDF5',
          cream: '#FFFDF5',
          dark: '#1F1127',
          'dark-violet': '#2C1838',
          orange: '#FF5E2B',
          yellow: '#FFE842',
          lime: '#C4E86E',
          pink: '#FF4D8D',
          teal: '#4AD4DA',
          peach: '#FFB088',
          coral: '#FF6B6B',
          purple: '#B497D6',
          muted: '#6B5872',
          border: '#1F1127',
        }
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '4px 4px 0px #1F1127',
        'neo-sm': '2px 2px 0px #1F1127',
        'neo-lg': '6px 6px 0px #1F1127',
        'neo-xl': '8px 8px 0px #1F1127',
        'neo-white': '4px 4px 0px #FFFFFF',
        'neo-orange': '4px 4px 0px #FF5E2B',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
