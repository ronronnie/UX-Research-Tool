/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Poker dark theme
        bg: {
          primary: '#0f1623',
          secondary: '#1a2235',
          tertiary: '#212d42',
          card: '#1e2a3a',
        },
        accent: {
          green: '#22c55e',
          'green-dim': '#16a34a',
          amber: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        },
        border: {
          DEFAULT: '#2a3a52',
          light: '#3a4f6a',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(34,197,94,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
