/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090E',
          800: '#0B0F19',
          700: '#121827',
          600: '#1F293D',
          500: '#334155',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          900: '#164E63',
        },
        brand: {
          primary: '#06B6D4',
          secondary: '#3B82F6',
          accent: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          critical: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
