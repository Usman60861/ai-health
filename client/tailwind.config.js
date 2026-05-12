export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      spacing: {
        '14': '3.5rem',
      },
      colors: {
        primary: '#6C63FF',
        'primary-50': '#F5F4FF',
        'primary-100': '#EBEAFF',
        'primary-200': '#D7D4FF',
        'primary-300': '#B8B3FF',
        'primary-400': '#9A92FF',
        'primary-500': '#6C63FF',
        'primary-600': '#4D42FF',
        'primary-700': '#3730DB',
        'primary-800': '#2822A3',
        'primary-900': '#1C1870',
        secondary: '#FFC62C',
        'secondary-50': '#FFF9E6',
        'secondary-100': '#FFF3CC',
        'secondary-200': '#FFE799',
        'secondary-300': '#FFDB66',
        'secondary-400': '#FFCF33',
        'secondary-500': '#FFC62C',
        'secondary-600': '#E6A800',
        'secondary-700': '#B38300',
        'secondary-800': '#805E00',
        'secondary-900': '#4D3800',
        accent: '#10b981',
        background: {
          DEFAULT: '#1A1A2E',
          light: '#25253D',
          lighter: '#2F2F4A',
        },
        card: {
          DEFAULT: '#25253D',
          hover: '#2F2F4A',
        },
        text: {
          primary: '#E0E0E0',
          secondary: '#A0A0B0',
          muted: '#808090',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        dark: {
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
          400: '#71717a',
          500: '#a1a1aa',
        },
        health: {
          emerald: '#16A34A',
          teal: '#14B8A6',
          mint: '#6EE7B7',
          orange: '#FB923C',
          charcoal: '#0F172A',
          softGray: '#F8FAFC',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(108, 99, 255, 0.1)',
        'card-hover': '0 8px 30px rgba(108, 99, 255, 0.2)',
        'glow': '0 0 20px rgba(108, 99, 255, 0.4)',
        'glow-secondary': '0 0 20px rgba(255, 198, 44, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108, 99, 255, 0.5), 0 0 10px rgba(108, 99, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.8), 0 0 30px rgba(108, 99, 255, 0.5)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
};
