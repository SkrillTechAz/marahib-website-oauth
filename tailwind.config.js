/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        hatton: ['Hatton', 'serif'],
        didot: ['Didot', 'Times New Roman', 'Times', 'serif'],
      },
      colors: {
        primary: {
          50: '#F8F8F8',    // Light gray
          100: '#FFFFFF',   // White
          200: '#F5F5F5',   // Very light gray
          300: '#E5E5E5',   // Light gray
          400: '#A3A3A3',   // Medium gray
          500: '#737373',   // Dark gray
          600: '#525252',   // Darker gray
          700: '#404040',   // Very dark gray
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};