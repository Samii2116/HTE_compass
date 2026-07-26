/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          raised: '#161b27',
          overlay: '#1e2433',
          hover: '#252b3b',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          glow: '#6366f1',
        },
        border: {
          DEFAULT: '#2a3144',
          subtle: '#1f2535',
        },
        muted: {
          DEFAULT: '#94a3b8',
          foreground: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.2)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-subtle':
          'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
