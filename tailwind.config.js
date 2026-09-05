/** @type {import('tailwind.config').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': '#090d16',
        'bg-base-dark': '#090d16',
        'canvas': {
          DEFAULT: '#090d16',
          950: '#090d16',
          900: '#0c1322',
          800: '#0f172a',
        },
        'text-primary': '#cbd5e1',
        'text-heading': '#f8fafc',
        'text-muted': '#94a3b8',
        'surface-dark': 'rgba(15, 23, 42, 0.75)',
        'surface-panel': 'rgba(15, 23, 42, 0.60)',
        'emerald': {
          DEFAULT: '#10b981',
          500: '#10b981',
          600: '#059669',
          400: '#34d399',
          300: '#6ee7b7',
          dark: '#047857',
        },
        'teal': {
          DEFAULT: '#2dd4bf',
          500: '#2dd4bf',
          600: '#0d9488',
          400: '#5eead4',
          dark: '#0f766e',
        },
        'amber': {
          DEFAULT: '#f59e0b',
          500: '#f59e0b',
          600: '#d97706',
          400: '#fbbf24',
        },
        'indigo': {
          DEFAULT: '#6366f1',
          500: '#6366f1',
          600: '#4f46e5',
          400: '#818cf8',
        },
        'lime-soft': '#DDF3A6',
        'sage-soft': '#EAF1E8',
        'muted': '#94a3b8',
        'warning': '#f59e0b',
        'critical': '#ef4444',
        ivory: {
          50: '#FFFFFF',
          100: '#F7F8F3',
          200: '#EAF1E8',
          300: '#DDE6DA',
        },
        forest: {
          900: '#090d16',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        ai: {
          500: '#6366f1',
          600: '#4f46e5',
          100: '#e0e7ff',
        },
        aqi: {
          good: '#10b981',
          moderate: '#f59e0b',
          poor: '#f97316',
          verypoor: '#ef4444',
          severe: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        chip: '6px',
        input: '8px',
        card: '16px',
        panel: '20px',
      },
      boxShadow: {
        'resting': '0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        'elevated': '0 10px 24px -4px rgba(0, 0, 0, 0.4)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
        'card': '0 8px 16px -4px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.1)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.35)',
      }
    },
  },
  plugins: [],
}
