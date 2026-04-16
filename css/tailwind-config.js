tailwind.config = {
  darkMode: 'class',
  safelist: [
    'hidden', 'md:flex', 'sm:inline-flex', 'grid', 'grid-cols-1', 'md:grid-cols-4', 'lg:grid-cols-5',
    'md:col-span-2', 'lg:col-span-2', 'gap-1', 'gap-2.5', 'gap-10', 'mb-12', 'mt-20', 'pt-16', 'pb-8',
    'text-[9px]', 'text-[10px]', 'text-[14px]', 'text-[18px]', 'text-[20px]',
    'px-5', 'py-2.5', 'px-3', 'py-1.5', 'bg-emerald-50', 'dark:bg-emerald-500/10',
    'text-emerald-600', 'dark:text-emerald-400', 'animate-pulse',
    'bg-gradient-to-r', 'from-brand-600', 'via-violet-500', 'to-cyan-500',
    'backdrop-blur-sm', 'backdrop-blur-2xl', 'open', 'scrolled', 'active',
    'md:hidden', 'sm:h-18', 'max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'border-t', 'border-slate-200/50', 'dark:border-white/10'
  ],
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
