/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toomakt: {
          bg: '#FAF7F2',
          'bg-warm': '#F4EFEA',
          cream: '#FDFBF7',
          plum: '#3C1322',
          dark: '#1A1A1A',
          charcoal: '#221C18',
          muted: '#736B63',
          'muted-light': '#9B938A',
          border: '#E8E2D7',
          'border-dark': '#CFC5B6',
          sand: '#EAE3D2',
          'sand-light': '#F5F0E6',
          yellow: '#FFD147',
          amber: '#F5A623',
          coral: '#FF8A65',
          berry: '#C84B5B',
          citrus: '#88C057',
          footer: '#1A1512',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(44, 24, 16, 0.04)',
        'soft-md': '0 4px 20px rgba(44, 24, 16, 0.08)',
        'soft-lg': '0 10px 30px rgba(44, 24, 16, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
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
