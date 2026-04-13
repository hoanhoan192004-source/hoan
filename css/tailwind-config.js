tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium indigo-violet palette
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#4c6ef5',
          700: '#3b5bdb',
          800: '#2b3f8e',
          900: '#1a2555',
          950: '#0f172a',
        },
        surface: {
          DEFAULT: '#ffffff',
          dim: '#f8fafc',
          container: '#f1f5f9',
          'container-high': '#e2e8f0',
          dark: '#0a0e1a',
          'dark-dim': '#111827',
          'dark-container': '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.1)',
        'glass-xl': '0 24px 64px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 60px rgba(99, 102, 241, 0.2)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 32px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  }
};
