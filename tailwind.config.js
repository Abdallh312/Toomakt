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
        obsidian:   '#0D090C',
        cacao:      '#120D11',
        surface:    '#171116',
        card:       '#1D141C',
        'card-hover': '#241923',
        gold:       '#E8BD6D',
        'gold-light':'#F2CE7F',
        'gold-deep': '#C89748',
        amber:      '#EFB55B',
        terracotta: '#C4563E',
        ivory:      '#FAF7F2',
        cashmere:   '#C8BEB5',
        'border-dark': '#33242E',
        'border-gold': 'rgba(232, 189, 109, 0.16)',
        // backward compat alias
        cream:      '#171116',
        parchment:  '#1D141C',
        ink:        '#FAF7F2',
        olive:      '#E8BD6D',
      },
      fontFamily: {
        serif:    ['"Lora"', '"Cormorant Garamond"', '"Fraunces"', 'Georgia', 'serif'],
        lora:     ['"Lora"', 'Georgia', 'serif'],
        display:  ['"Lora"', '"Cormorant Garamond"', '"Fraunces"', 'Georgia', 'serif'],
        editorial:['"Lora"', '"Cormorant Garamond"', '"Fraunces"', 'Georgia', 'serif'],
        calligraphy: ['"Amiri"', '"Lora"', '"Cormorant Garamond"', 'serif'],
        mono:     ['"Sometype Mono"', 'monospace'],
        sans:     ['"Alexandria"', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic:   ['"Alexandria"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['9rem',    { lineHeight: '0.92' }],
        '11xl': ['11rem',   { lineHeight: '0.90' }],
        '12xl': ['13rem',   { lineHeight: '0.88' }],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(0,0,0,0.55)',
        'gold':   '0 4px 20px rgba(232,189,109,0.22)',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
