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
        'bg-base': '#F7F8F3',
        'text-primary': '#12221C',
        'emerald': {
          DEFAULT: '#20A86B',
          500: '#20A86B',
          600: '#188E59',
          400: '#3EDB93',
          dark: '#259a64',
        },
        'teal': {
          DEFAULT: '#2C9C98',
          500: '#2C9C98',
          600: '#227E7B',
          400: '#45B5B1',
          dark: '#288e8a',
        },
        'indigo': {
          DEFAULT: '#6C63FF',
          500: '#6C63FF',
          600: '#584FFF',
          400: '#857EFF',
        },
        'lime-soft': '#DDF3A6',
        'sage-soft': '#EAF1E8',
        'muted': '#64736D',
        'warning': '#F3B63F',
        'critical': '#E85D5D',
        // Dark theme specific tokens
        'bg-base-dark': '#07110F',
        'surface-dark': '#0D1B18',
        // Ivory aliases for backwards compatibility
        ivory: {
          50: '#FFFFFF',
          100: '#F7F8F3',
          200: '#EAF1E8',
          300: '#DDE6DA',
        },
        forest: {
          900: '#07110F',
          800: '#12221C',
          700: '#1B332A',
          600: '#284C3E',
        },
        ai: {
          500: '#6C63FF',
          600: '#584FFF',
          100: '#EEECFF',
        },
        aqi: {
          good: '#20A86B',
          moderate: '#F3B63F',
          poor: '#E85D5D',
          verypoor: '#C0392B',
          severe: '#7D3C98',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        chip: '6px',
        input: '6px',
        card: '12px',
        panel: '20px',
      },
      boxShadow: {
        'resting': '0 2px 8px -1px rgba(18, 34, 28, 0.04)',
        'elevated': '0 10px 24px -4px rgba(18, 34, 28, 0.08)',
        'soft': '0 4px 20px -2px rgba(18, 34, 28, 0.05)',
        'card': '0 10px 30px -5px rgba(18, 34, 28, 0.08)',
      }
    },
  },
  plugins: [],
}
