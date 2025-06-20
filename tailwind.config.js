/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
          'sans-serif'
        ]
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09'
        },
        poker: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#313131',
          950: '#1a1a1a'
        },
        felt: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bbe5cb',
          300: '#8dd1a7',
          400: '#5bb67d',
          500: '#369c5e',
          600: '#277d4a',
          700: '#20643d',
          800: '#1d5034',
          900: '#19422c',
          950: '#0c2417'
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        }
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.15), 0 10px 20px -2px rgba(0, 0, 0, 0.08)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        strong: '0 10px 40px -10px rgba(0, 0, 0, 0.3), 0 20px 50px -10px rgba(0, 0, 0, 0.15)',
        glow: '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-green': '0 0 25px rgba(34, 197, 94, 0.4)',
        'glow-gold': '0 0 25px rgba(234, 179, 8, 0.4)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.4)',
        'poker-table': 'inset 0 0 50px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)',
        chip: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-soft': 'bounceSoft 0.8s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'flip-in': 'flipIn 0.6s ease-out',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'chip-flip': 'chipFlip 0.8s ease-out',
        'card-deal': 'cardDeal 0.7s ease-out',
        'money-rain': 'moneyRain 1.2s ease-out',
        'poker-glow': 'pokerGlow 2.5s ease-in-out infinite',
        'suit-dance': 'suitDance 2s ease-in-out infinite',
        'casino-neon': 'casinoNeon 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        flipIn: {
          '0%': { opacity: '0', transform: 'rotateY(-90deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0)' }
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-180deg) scale(0.5)' },
          '100%': { opacity: '1', transform: 'rotate(0) scale(1)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(234, 179, 8, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' }
        },
        chipFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.1)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' }
        },
        cardDeal: {
          '0%': { opacity: '0', transform: 'translateX(-100px) rotate(-45deg)' },
          '50%': { opacity: '0.5', transform: 'translateX(0) rotate(0deg) scale(1.1)' },
          '100%': { opacity: '1', transform: 'translateX(0) rotate(0deg) scale(1)' }
        },
        moneyRain: {
          '0%': { opacity: '0', transform: 'translateY(-50px) scale(0.5)' },
          '20%': { opacity: '1', transform: 'translateY(0) scale(1.2)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        pokerGlow: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)' },
          '33%': { boxShadow: '0 0 35px rgba(234, 179, 8, 0.6)' },
          '66%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }
        },
        suitDance: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(5deg)' },
          '50%': { transform: 'translateY(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(-3px) rotate(-3deg)' }
        },
        casinoNeon: {
          '0%, 100%': { textShadow: '0 0 10px rgba(234, 179, 8, 0.8)' },
          '50%': { textShadow: '0 0 20px rgba(234, 179, 8, 1), 0 0 30px rgba(234, 179, 8, 0.8)' }
        }
      }
    }
  },
  plugins: []
}
